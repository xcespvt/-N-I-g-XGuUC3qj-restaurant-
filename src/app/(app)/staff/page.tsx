"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Mail,
  MoreHorizontal,
  Phone,
  PlusCircle,
  Search,
  Users,
  GitFork,
  Trash2,
  Pencil,
  Check,
  ChevronsUpDown,
  Share2,
  LayoutGrid,
  Package,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Percent,
  BarChart3,
  Wallet,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/context/useAppStore";
import type { Branch } from "@/context/useAppStore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const initialManagerData = [
  {
    id: "mgr-1",
    name: "Sneha Reddy",
    email: "sneha@restaurant.com",
    phone: "+91 65432 10987",
    avatar: "https://placehold.co/103x103",
    avatarFallback: "SR",
    branchIds: ["indiranagar", "koramangala", "whitefield"],
  },
  {
    id: "mgr-2",
    name: "Vikram Singh",
    email: "vikram@restaurant.com",
    phone: "+91 54321 09876",
    avatar: "https://placehold.co/104x104",
    avatarFallback: "VS",
    branchIds: ["indiranagar"],
  },
  {
    id: "mgr-3",
    name: "Anjali Sharma",
    email: "anjali@restaurant.com",
    phone: "+91 78901 23456",
    avatar: "https://placehold.co/105x105",
    avatarFallback: "AS",
    branchIds: ["koramangala"],
  },
];

type Manager = (typeof initialManagerData)[0];

const defaultPermissions = {
  dashboard: true,
  orders: true,
  menu: true,
  bookings: true,
  tableManagement: true,
  feedback: true,
  promotions: true,
  analytics: true,
  earnings: true,
  settings: false,
};

const permissionDetails = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "orders", label: "Orders", icon: Package },
  { key: "menu", label: "Menu", icon: BookOpen },
  { key: "tableManagement", label: "Tables", icon: Users },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "feedback", label: "Feedback", icon: MessageSquare },
  { key: "promotions", label: "Promotions", icon: Percent },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "earnings", label: "Earnings", icon: Wallet },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  branchIds: [] as string[],
  permissions: defaultPermissions,
};

type FormState = typeof defaultFormState;

const MultiBranchSelect = ({
  branches,
  selectedBranchIds,
  onSelectionChange,
}: {
  branches: Branch[];
  selectedBranchIds: string[];
  onSelectionChange: (branchIds: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (branchId: string) => {
    const newSelection = selectedBranchIds.includes(branchId)
      ? selectedBranchIds.filter((id) => id !== branchId)
      : [...selectedBranchIds, branchId];
    onSelectionChange(newSelection);
  };

  const selectedBranchesText =
    selectedBranchIds.length > 0
      ? `${selectedBranchIds.length} branch${
          selectedBranchIds.length > 1 ? "es" : ""
        } selected`
      : "Select branches...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{selectedBranchesText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search branches..." />
          <CommandList>
            <CommandEmpty>No branches found.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.name}
                  onSelect={() => handleSelect(branch.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBranchIds.includes(branch.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {branch.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function StaffPage() {
  const { branches } = useAppStore();
  const [managers, setManagers] = useState<Manager[]>(initialManagerData);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const { toast } = useToast();

  const filteredManagers = useMemo(() => {
    return managers.filter((manager) =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [managers, searchTerm]);

  const handleCreateClick = () => {
    setEditingManager(null);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  };

  const handleEditClick = (manager: any) => {
    setEditingManager(manager);
    setFormState({ ...defaultFormState, ...manager });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (manager: Manager) => {
    setManagerToDelete(manager);
    setIsDeleteAlertOpen(true);
  };

  const handleShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: "The joining code has been copied to your clipboard.",
    });
  };

  const confirmDelete = () => {
    if (managerToDelete) {
      setManagers((prev) => prev.filter((m) => m.id !== managerToDelete.id));
      toast({
        title: "Manager Removed",
        description: `${managerToDelete.name} has been removed.`,
        variant: "destructive",
      });
      setIsDeleteAlertOpen(false);
      setManagerToDelete(null);
    }
  };

  const handlePermissionChange = (
    permission: keyof typeof defaultPermissions
  ) => {
    setFormState((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleSaveManager = () => {
    if (
      !formState.name ||
      !formState.email ||
      !formState.phone ||
      formState.branchIds.length === 0
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and assign at least one branch.",
        variant: "destructive",
      });
      return;
    }

    if (editingManager) {
      setManagers((prev) =>
        prev.map((m) =>
          m.id === editingManager.id ? ({ ...m, ...formState } as Manager) : m
        )
      );
      toast({
        title: "Manager Updated",
        description: `${formState.name}'s details have been updated.`,
      });
    } else {
      const newManager: Manager = {
        id: `mgr-${Date.now()}`,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        branchIds: formState.branchIds,
        avatar: `https://placehold.co/100x${100 + managers.length}`,
        avatarFallback: formState.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      };
      setManagers((prev) => [newManager, ...prev]);
      toast({
        title: "Manager Added",
        description: `${formState.name} has been added.`,
      });
    }

    setIsFormOpen(false);
    setEditingManager(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Manager Access</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search managers..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateClick} className="flex-shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Manager
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredManagers.map((manager) => (
          <Card
            key={manager.id}
            className="shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={manager.avatar} alt={manager.name} />
                  <AvatarFallback>{manager.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{manager.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{manager.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{manager.phone}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mt-1 -mr-1"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(manager)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Access
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(manager)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Manager
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                  <GitFork className="h-4 w-4" /> Branch Access
                </p>
                <div className="flex flex-wrap gap-2">
                  {manager.branchIds.map((branchId) => {
                    const branch = branches.find((b) => b.id === branchId);
                    return (
                      <Badge key={branchId} variant="secondary">
                        {branch?.name || branchId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredManagers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <p>No managers found. Add one to get started.</p>
          </div>
        )}
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent 
          side="bottom"
          className="sm:max-w-2xl mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>{editingManager ? "Edit Manager" : "Add New Manager"}</SheetTitle>
            <SheetDescription>
              {editingManager
                ? "Update the manager's details and branch access."
                : "Fill in the details to invite a new manager."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formState.name}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formState.email}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, email: e.target.value }))
                }
                disabled={!!editingManager}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formState.phone}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branches">Branch Access</Label>
              <MultiBranchSelect
                branches={branches}
                selectedBranchIds={formState.branchIds}
                onSelectionChange={(ids) =>
                  setFormState((p) => ({ ...p, branchIds: ids }))
                }
              />
            </div>
            {formState.branchIds.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Restaurant Joining Code</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value="XCES123"
                      readOnly
                      className="font-semibold tracking-wider"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleShareCode("XCES123")}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label>Permissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Control what this manager can see and do.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {permissionDetails.map(({ key, label, icon: Icon }) => {
                      const isActive = formState.permissions[key];
                      return (
                        <Button
                          key={key}
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-auto flex flex-col items-center justify-center gap-2 p-3 text-center transition-colors",
                            isActive &&
                              "bg-primary/10 border-primary text-primary"
                          )}
                          onClick={() => handlePermissionChange(key)}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-medium">{label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <SheetFooter className="p-4 border-t">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveManager} className="w-full sm:w-auto">
              {editingManager ? "Save Changes" : "Add Manager"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              {managerToDelete?.name} and revoke their access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
