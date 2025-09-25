
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  PlusCircle,
  Pencil,
  Trash2,
  QrCode,
  MoreHorizontal,
  Settings,
  IndianRupee,
  Plus,
  Tag,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/context/useAppStore";
import type { Table } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const initialFormState = {
  name: "",
  capacity: "",
  type: "Normal",
};

const initialSeriesFormState = {
    prefix: '',
    start: '',
    end: '',
    capacity: '',
    type: "Normal",
};

export default function TableManagementPage() {
  const { tables, addTable, updateTable, deleteTable, tableTypes, addTableType, deleteTableType } = useAppStore();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeriesFormOpen, setIsSeriesFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [seriesFormData, setSeriesFormData] = useState(initialSeriesFormState);

  const [isBookingSettingsOpen, setIsBookingSettingsOpen] = useState(false);
  const [chargeForBooking, setChargeForBooking] = useState(true);
  const [bookingFee, setBookingFee] = useState("100");
  
  const [isTableTypeDialogOpen, setIsTableTypeDialogOpen] = useState(false);
  const [newTableTypeName, setNewTableTypeName] = useState("");

  useEffect(() => {
    if (isFormOpen && editingTable) {
      setFormData({
        name: editingTable.name,
        capacity: editingTable.capacity.toString(),
        type: editingTable.type,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [isFormOpen, editingTable]);

  const handleEditClick = (table: Table) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (table: Table) => {
    setTableToDelete(table);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (tableToDelete) {
      deleteTable(tableToDelete.id);
      setIsDeleteAlertOpen(false);
      setTableToDelete(null);
    }
  };

  const handlePrintQR = (tableName: string) => {
    toast({
      title: `Printing QR for ${tableName}`,
      description: "Your QR code is being generated for printing.",
    });
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and capacity for the table.",
        variant: "destructive",
      });
      return;
    }

    const capacity = parseInt(formData.capacity, 10);
    if (isNaN(capacity) || capacity <= 0) {
      toast({
        title: "Invalid Capacity",
        description: "Please enter a valid number for capacity.",
        variant: "destructive",
      });
      return;
    }

    if (editingTable) {
      updateTable({
        ...editingTable,
        name: formData.name,
        capacity,
        type: formData.type,
      });
    } else {
      addTable(formData.name, capacity, formData.type);
    }

    setIsFormOpen(false);
    setEditingTable(null);
  };
  
  const handleSaveTableSeries = (e: React.FormEvent) => {
    e.preventDefault();
    const { prefix, start, end, capacity: capStr, type } = seriesFormData;

    if (!start || !end || !capStr) {
      toast({ title: "Missing Information", description: "Please fill all fields for the series.", variant: "destructive" });
      return;
    }
    
    const capacity = parseInt(capStr, 10);
    if (isNaN(capacity) || capacity <= 0) {
      toast({ title: "Invalid Capacity", description: "Please enter a valid number for capacity.", variant: "destructive" });
      return;
    }

    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);

    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
       toast({ title: "Invalid Range", description: "Please enter a valid numerical range (e.g., 1 to 10).", variant: "destructive" });
       return;
    }

    let addedCount = 0;
    for (let i = startNum; i <= endNum; i++) {
        const tableName = `${prefix}${i}`;
        addTable(tableName, capacity, type);
        addedCount++;
    }

    toast({ title: "Tables Added", description: `${addedCount} tables have been added to your restaurant.` });
    setIsSeriesFormOpen(false);
    setSeriesFormData(initialSeriesFormState);
  }

  const handleSaveBookingSettings = () => {
    toast({
      title: "Booking Settings Saved",
      description: `Advance booking fee has been ${
        chargeForBooking ? `set to ₹${bookingFee}` : "disabled"
      }.`,
    });
    setIsBookingSettingsOpen(false);
  };
  
  const handleAddTableType = () => {
    if (newTableTypeName.trim()) {
        addTableType(newTableTypeName.trim());
        setNewTableTypeName("");
    }
  };
  const actionButtons = [
    {
      id: 'add-table',
      label: 'Add New Table',
      icon: <PlusCircle className="mr-2 h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => setIsFormOpen(true),
      className: 'flex-1'
    },
    {
      id: 'add-series',
      label: 'Add Table Series',
      icon: <Plus className="mr-2 h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => setIsSeriesFormOpen(true)
    },
    {
      id: 'manage-types',
      label: 'Manage Table Types',
      icon: <Tag className="mr-2 h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => setIsTableTypeDialogOpen(true)
    },
    {
      id: 'booking-settings',
      label: 'Booking Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => setIsBookingSettingsOpen(true)
    }
  ];
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
          <Users className="h-6 w-6" /> Table Management
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
          {actionButtons.map((button) => (
            <Button
              key={button.id}
              variant={button.variant}
              onClick={button.onClick}
              className={`w-full ${button.className || ''}`}
            >
              {button.icon}
              {button.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <Card
            key={table.id}
            className="flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">{table.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 pt-1">
                  <Users className="h-4 w-4" /> Capacity: {table.capacity}
                </CardDescription>
                <CardDescription className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" /> Type: {table.type}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClick(table)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(table)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge
                variant={table.status === "Available" ? "secondary" : "outline"}
                className={cn(
                  "capitalize text-sm",
                  table.status === "Available"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                )}
              >
                {table.status}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handlePrintQR(table.name)}
              >
                <QrCode className="mr-2 h-4 w-4" /> Print QR Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent
          side="bottom"
          className="sm:max-w-md left-1/2 -translate-x-1/2"
        >
          <form onSubmit={handleSaveTable}>
            <DialogHeader>
              <DialogTitle>
                {editingTable ? "Edit Table" : "Add New Table"}
              </DialogTitle>
              <DialogDescription>
                {editingTable
                  ? "Update the details for this table."
                  : "Provide a name and capacity for the new table."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="table-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g., T1, P2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, capacity: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g., 4"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(p => ({ ...p, type: value }))}
                >
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        {tableTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {editingTable ? "Save Changes" : "Add Table"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSeriesFormOpen} onOpenChange={setIsSeriesFormOpen} >
        <DialogContent
          side="bottom"
          className="d-flex justify-center"  
        >
          <form onSubmit={handleSaveTableSeries}>
            <DialogHeader>
              <DialogTitle>Add Table Series</DialogTitle>
              <DialogDescription>
                Quickly add multiple tables with a numerical series.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="series-prefix">Prefix (Optional)</Label>
                 <Input id="series-prefix" placeholder="e.g., T, Patio-" value={seriesFormData.prefix} onChange={(e) => setSeriesFormData(p => ({ ...p, prefix: e.target.value }))} />
               </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="series-start">Start Number</Label>
                        <Input id="series-start" type="number" placeholder="e.g., 1" value={seriesFormData.start} onChange={(e) => setSeriesFormData(p => ({ ...p, start: e.target.value }))} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="series-end">End Number</Label>
                        <Input id="series-end" type="number" placeholder="e.g., 10" value={seriesFormData.end} onChange={(e) => setSeriesFormData(p => ({ ...p, end: e.target.value }))} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="series-capacity">Capacity of each table</Label>
                    <Input id="series-capacity" type="number" placeholder="e.g., 4" value={seriesFormData.capacity} onChange={(e) => setSeriesFormData(p => ({ ...p, capacity: e.target.value }))} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="series-table-type">Type of tables</Label>
                    <Select
                        value={seriesFormData.type}
                        onValueChange={(value) => setSeriesFormData(p => ({ ...p, type: value }))}
                    >
                        <SelectTrigger id="series-table-type">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            {tableTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Series</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent side="bottom" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitleComponent>
              Are you absolutely sure?
            </AlertDialogTitleComponent>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              table "{tableToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isBookingSettingsOpen}
        onOpenChange={setIsBookingSettingsOpen}
      >
        <DialogContent
          side="bottom"
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Booking Settings</DialogTitle>
            <DialogDescription>
              Manage settings for your online table bookings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="charge-booking-fee">
                  Charge for Advance Bookings
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable to charge a small fee for reservations.
                </p>
              </div>
              <Switch
                id="charge-booking-fee"
                checked={chargeForBooking}
                onCheckedChange={setChargeForBooking}
              />
            </div>
            {chargeForBooking && (
              <div className="space-y-2">
                <Label htmlFor="booking-fee">Booking Fee (per booking)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="booking-fee"
                    type="number"
                    value={bookingFee}
                    onChange={(e) => setBookingFee(e.target.value)}
                    className="pl-9"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveBookingSettings}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTableTypeDialogOpen} onOpenChange={setIsTableTypeDialogOpen}>
          <DialogContent side="bottom" className="sm:max-w-xl">
              <DialogHeader>
                  <DialogTitle>Manage Table Types</DialogTitle>
                  <DialogDescription>Add new types or remove existing ones.</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                  <div className="flex gap-2">
                    <Input value={newTableTypeName} onChange={(e) => setNewTableTypeName(e.target.value)} placeholder="e.g. Rooftop, Bar Seating"/>
                    <Button onClick={handleAddTableType}>Add Type</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Existing Types</Label>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                        {tableTypes.map(type => (
                            <div key={type} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <span className="font-medium text-sm">{type}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteTableType(type)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
