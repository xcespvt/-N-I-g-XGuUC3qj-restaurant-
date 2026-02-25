
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
  UtensilsCrossed,
  Clock,
  CircleDollarSign,
  UserCheck,
  ClipboardList,
} from "lucide-react";
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
import type { Table, Order, Booking } from "@/context/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGet, usePost, useQueryHelpers } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { tables, addTable, updateTable, deleteTable, tableTypes, addTableType, deleteTableType, setTableTypes, orders, bookings, branches, selectedBranch, setTables, setBookings } = useAppStore();
  const { toast } = useToast();
  const { invalidate } = useQueryHelpers();

  // Determine active restaurantId from selected branch (fallback to example id)
  const activeBranch = useMemo(() => branches.find(b => b.id === selectedBranch), [branches, selectedBranch]);
  const restaurantId = activeBranch?.restaurantId || "b1a2c3d4-e5f6-7890-1234-56789abcdef";

  // Fetch tables from backend bookings endpoint and sync into store
  const { data: bookingsData, isLoading: isTablesLoading, error: tablesError } = useGet<any>(
    ["bookings", restaurantId],
    `/api/bookings/${restaurantId}`
  );

  // Fetch table types from backend
  const { data: tableTypesData } = useGet<any>(
    ["tableTypes", restaurantId],
    `/api/tables/${restaurantId}/types`
  );

  // Heuristic to extract tables from various possible response shapes
  const extractTablesFromResponse = (raw: any): Table[] => {
    if (!raw) return [];

    // Support APIs that wrap in { data: ... }
    const root = raw?.data ?? raw;

    const normalizeStatus = (s: any): Table["status"] => {
      const lower = (s ?? "available").toString().toLowerCase();
      if (["available", "free", "ready"].includes(lower)) return "Available";
      if (["occupied", "booked", "reserved", "in_use", "confirmed", "pending", "active", "seated", "processing"].includes(lower)) return "Occupied";
      return "Available";
    };

    const mapOne = (t: any): Table => ({
      id: (t?.id ?? t?._id ?? t?.tableId ?? t?.table_id ?? t?.bookingId ?? t?.booking_id ?? t?.name ?? "").toString(),
      name: (t?.name ?? t?.tableName ?? t?.table_name ?? t?.customerName ?? t?.customer_name ?? t?.guestName ?? t?.guest_name ?? t?.customer ?? t?.guest ?? t?.tableId ?? t?.id ?? "Table").toString(),
      capacity: Number(t?.capacity ?? t?.partySize ?? t?.party_size ?? 4),
      status: normalizeStatus(t?.status),
      type: (typeof (t?.type ?? t?.tableType) === 'object' ? (t?.type?.name ?? t?.tableType?.name) : (t?.type ?? t?.tableType)) ?? "Normal",
    });

    // Direct array response
    if (Array.isArray(root)) return root.map(mapOne).filter((t: Table) => t.id && t.name);
    // Common shape: { tables: [...] }
    if (Array.isArray(root?.tables)) return root.tables.map(mapOne).filter((t: Table) => t.id && t.name);

    // Grouped shape: { Available: { count, bookings: [...] }, Occupied: { count, bookings: [...] }, ... }
    const arrays: any[] = [];
    const seen = new Set<any>();
    if (root && typeof root === "object") {
      for (const val of Object.values(root)) {
        if (Array.isArray(val)) {
          if (!seen.has(val)) { arrays.push(val); seen.add(val); }
        } else if (val && typeof val === "object") {
          const v: any = val;
          // Prefer explicit known keys; avoid double-adding via fallback
          if (Array.isArray(v.bookings) && !seen.has(v.bookings)) { arrays.push(v.bookings); seen.add(v.bookings); }
          else if (Array.isArray(v.tables) && !seen.has(v.tables)) { arrays.push(v.tables); seen.add(v.tables); }
          else {
            for (const nested of Object.values(v)) {
              if (Array.isArray(nested) && !seen.has(nested)) { arrays.push(nested); seen.add(nested); }
            }
          }
        }
      }
    }

    const flat = arrays.flat();
    // Map to Table and dedupe by id
    const mapped = flat.map(mapOne).filter((t: Table) => t.id && t.name);
    const byId = new Map<string, Table>();
    for (const t of mapped) {
      if (!byId.has(t.id)) byId.set(t.id, t);
    }
    return Array.from(byId.values());
  };

  useEffect(() => {
    if (!bookingsData) return;
    try {
      const root = (bookingsData as any)?.data ?? bookingsData;

      // Extract tables
      const remoteTables = extractTablesFromResponse(bookingsData);
      if (remoteTables.length > 0) {
        setTables(remoteTables);
      }

      // Extract bookings if present in the response
      let remoteBookings: Booking[] = [];
      if (Array.isArray(root?.bookings)) {
        remoteBookings = root.bookings;
      } else if (Array.isArray(root) && root.length > 0 && (root[0].partySize || root[0].customerName)) {
        remoteBookings = root;
      }

      if (remoteBookings.length > 0) {
        setBookings(remoteBookings);
      }
    } catch (e) {
      console.error("Failed to sync bookings/tables:", e);
    }
  }, [bookingsData, setTables, setBookings]);

  useEffect(() => {
    if (tableTypesData) {
      try {
        const types = Array.isArray(tableTypesData) ? tableTypesData : tableTypesData.data;
        if (Array.isArray(types) && types.length > 0) {
          const normalizedTypes = types.map((t: any) =>
            typeof t === 'object' ? (t.name || t.tableTypeId || "Normal") : t
          );
          setTableTypes(normalizedTypes);
        }
      } catch (e) {
        console.error("Failed to sync table types:", e);
      }
    }
  }, [tableTypesData, setTableTypes]);

  // Mutation: Add table series on server
  const addSeries = usePost<any, { prefix: string; startNumber: number; endNumber: number; capacity: number; type: string }>(
    `/api/bookings/${restaurantId}/tables/series`
  );

  // Mutation: Add table type
  const addTypeMutation = usePost<any, { name: string }>(
    `/api/tables/${restaurantId}/types`
  );

  // Mutation: Delete table type (assuming DELETE /api/tables/:restaurantId/types/:typeName)
  // If the API requires a different shape, this might need adjustment
  const { mutate: deleteTypeApi } = usePost<any, { typeName: string }>(
    `/api/tables/${restaurantId}/types/delete` // Common pattern if true DELETE is not used or wrapped
  );

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

  const getTableOccupationInfo = (table: Table): { type: "Booking" | "Dine-in" | null; order: Order | null, guests: number | null, booking: Booking | null } => {
    if (table.status === "Available") return { type: null, order: null, guests: null, booking: null };

    const activeBooking = bookings.find(b =>
      (b.status === "Confirmed" || b.status === "Pending") &&
      b.tables.some(t => t.id === table.id)
    );

    if (activeBooking) {
      const preOrder = orders.find(o => o.id.includes(activeBooking.id));
      const preOrderedItems = preOrder?.items.filter(item => item.category !== 'Booking');
      return {
        type: "Booking",
        order: preOrderedItems && preOrderedItems.length > 0 ? { ...preOrder, items: preOrderedItems } as Order : null,
        guests: activeBooking.partySize,
        booking: activeBooking,
      };
    }

    const dineInOrder = orders.find(order =>
      order.type === 'Dine-in' &&
      !["Delivered", "Cancelled", "Rejected"].includes(order.status) &&
      order.customerDetails.address.includes(table.name) &&
      !order.items.some(item => item.category === 'Booking')
    );

    if (dineInOrder) {
      return { type: "Dine-in", order: dineInOrder, guests: dineInOrder.items.reduce((acc, item) => acc + item.quantity, 0) || 2, booking: null };
    }

    return { type: 'Dine-in', order: null, guests: table.capacity, booking: null };
  };

  const groupedTables = useMemo(() => {
    return tables.reduce((acc, table) => {
      const type = table.type || 'Uncategorized';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(table);
      return acc;
    }, {} as Record<string, Table[]>);
  }, [tables]);

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
        description: "Please provide both a name and capacity.",
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

    // Call backend add series API
    addSeries.mutate(
      {
        prefix: prefix || "",
        startNumber: startNum,
        endNumber: endNum,
        capacity,
        type,
      },
      {
        onSuccess: async () => {
          toast({ title: "Tables Added", description: `Requested ${endNum - startNum + 1} tables to be added on server.` });
          await invalidate(["bookings", restaurantId]);
          setIsSeriesFormOpen(false);
          setSeriesFormData(initialSeriesFormState);
        },
        onError: (err: any) => {
          toast({ title: "Failed to add series", description: err?.message || "Server error", variant: "destructive" });
        },
      }
    );
  }

  const handleSaveBookingSettings = () => {
    toast({
      title: "Booking Settings Saved",
      description: `Advance booking fee has been ${chargeForBooking ? `set to ₹${bookingFee}` : "disabled"
        }.`,
    });
    setIsBookingSettingsOpen(false);
  };

  const handleAddTableType = () => {
    if (!newTableTypeName.trim()) return;

    addTypeMutation.mutate(
      { name: newTableTypeName.trim() },
      {
        onSuccess: async () => {
          toast({ title: "Type Added", description: `"${newTableTypeName}" has been added successfully.` });
          await invalidate(["tableTypes", restaurantId]);
          setNewTableTypeName("");
        },
        onError: (err: any) => {
          toast({ title: "Failed to add type", description: err?.message || "Server error", variant: "destructive" });
        }
      }
    );
  };

  const handleDeleteTableType = (typeName: string) => {
    // Optimistic or just use API and invalidate
    deleteTypeApi(
      { typeName },
      {
        onSuccess: async () => {
          toast({ title: "Type Deleted", description: `"${typeName}" has been removed.` });
          await invalidate(["tableTypes", restaurantId]);
        },
        onError: (err: any) => {
          toast({ title: "Failed to delete type", description: err?.message || "Server error", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {tablesError && (
        <div className="text-sm text-destructive">Failed to load tables. Please try again.</div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
          <Users className="h-6 w-6" /> Table Management
        </h1>
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsFormOpen(true)} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Table
          </Button>
          <Button onClick={() => setIsSeriesFormOpen(true)} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Series
          </Button>
          <Button onClick={() => setIsTableTypeDialogOpen(true)} variant="outline" className="w-full">
            <Tag className="mr-2 h-4 w-4" /> Manage Types
          </Button>
          <Button onClick={() => setIsBookingSettingsOpen(true)} variant="outline" className="w-full">
            <Settings className="mr-2 h-4 w-4" /> Booking Settings
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {isTablesLoading ? (
          <div className="space-y-8">
            {[1, 2].map((group) => (
              <div key={group}>
                <Skeleton className="h-7 w-48 mb-4" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="flex flex-col h-[220px] shadow-sm">
                      <CardHeader className="flex-grow">
                        <Skeleton className="h-10 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-16 w-full rounded-lg" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.entries(groupedTables).length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No tables found</h3>
            <p className="text-muted-foreground">Start by adding your first table or a table series.</p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-4">
              Add Table
            </Button>
          </div>
        ) : (
          Object.entries(groupedTables).map(([type, tablesOfType]) => (
            <div key={type}>
              <h2 className="text-xl font-semibold mb-4 capitalize flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                {type}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tablesOfType.map((table) => {
                  const occupationInfo = getTableOccupationInfo(table);
                  const isAvailable = table.status === "Available";
                  const isBooking = occupationInfo.type === 'Booking';
                  const preOrderItems = occupationInfo.order?.items.filter(item => item.category !== 'Booking') || [];
                  const subtotal = preOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                  return (
                    <Card
                      key={table.id}
                      className={cn(
                        "flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden",
                        !isAvailable && "border-2",
                        isBooking && "border-blue-500",
                        !isBooking && !isAvailable && "border-red-500",
                      )}
                    >
                      <div className={cn(
                        "absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-transparent via-transparent to-card",
                        !isAvailable && "from-card/0 via-card/50 to-card"
                      )}></div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 absolute top-2 right-2 z-10">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(table)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintQR(table.name)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Print QR
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

                      <CardHeader className="flex-grow">
                        <CardTitle className="text-3xl font-bold">{table.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                          <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {table.capacity} Guests</div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0">
                        {isAvailable ? (
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <p className="font-semibold text-green-700 dark:text-green-300">Available</p>
                          </div>
                        ) : (
                          <div className={cn("p-3 rounded-lg space-y-2", isBooking ? "bg-blue-50 dark:bg-blue-900/30" : "bg-red-50 dark:bg-red-900/30")}>
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <Badge variant="outline" className={cn("capitalize", isBooking ? "text-blue-700 border-blue-300 bg-white" : "text-red-700 border-red-300 bg-white")}>
                                {occupationInfo.type === 'Booking' ? <UserCheck className="mr-1.5 h-3 w-3" /> : <UtensilsCrossed className="mr-1.5 h-3 w-3" />}
                                {occupationInfo.type}
                              </Badge>
                              {occupationInfo.guests && (
                                <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{occupationInfo.guests}</div>
                              )}
                            </div>
                            {preOrderItems.length > 0 ? (
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between items-center text-muted-foreground">
                                  <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" />Pre-order</span>
                                  <span className="font-semibold text-foreground flex items-center">
                                    <IndianRupee className="h-3 w-3 mr-0.5" />
                                    {subtotal.toFixed(0)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                  <span className="flex items-center gap-1"><CircleDollarSign className="h-3 w-3" />Payment</span>
                                  <Badge variant={occupationInfo.order?.payment.status === 'Paid' ? 'default' : 'destructive'} className={cn("px-1.5 py-0 text-[10px]", occupationInfo.order?.payment.status === 'Paid' && "bg-green-600")}>
                                    {occupationInfo.order?.payment.status}
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic text-center py-2">
                                {isBooking ? 'No pre-order items.' : 'Waiting for order...'}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent
          side="bottom"
          className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <form onSubmit={handleSaveTable} className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-xl">
                {editingTable ? "Edit Table" : "Add New Table"}
              </SheetTitle>
              <SheetDescription>
                {editingTable
                  ? "Update the details for this table."
                  : "Provide a name, capacity, and type for the new table."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="table-name">Name</Label>
                <Input
                  id="table-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g., T1, P2, Rooftop-A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, capacity: e.target.value }))
                  }
                  placeholder="e.g., 4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(p => ({ ...p, type: value }))}
                >
                  <SelectTrigger>
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
            <SheetFooter className="p-4 border-t flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTable ? "Save Changes" : "Add Table"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isSeriesFormOpen} onOpenChange={setIsSeriesFormOpen}>
        <SheetContent
          side="bottom"
          className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <form onSubmit={handleSaveTableSeries} className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-xl">Add Table Series</SheetTitle>
              <SheetDescription>
                Quickly add multiple tables with a numerical series.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="series-prefix">Prefix (Optional)</Label>
                <Input
                  id="series-prefix"
                  placeholder="e.g., T, Patio-"
                  value={seriesFormData.prefix}
                  onChange={(e) => setSeriesFormData(p => ({ ...p, prefix: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="series-start">Start Number</Label>
                  <Input
                    id="series-start"
                    type="number"
                    placeholder="e.g., 1"
                    value={seriesFormData.start}
                    onChange={(e) => setSeriesFormData(p => ({ ...p, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="series-end">End Number</Label>
                  <Input
                    id="series-end"
                    type="number"
                    placeholder="e.g., 10"
                    value={seriesFormData.end}
                    onChange={(e) => setSeriesFormData(p => ({ ...p, end: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="series-capacity">Capacity of each table</Label>
                <Input
                  id="series-capacity"
                  type="number"
                  placeholder="e.g., 4"
                  value={seriesFormData.capacity}
                  onChange={(e) => setSeriesFormData(p => ({ ...p, capacity: e.target.value }))}
                />
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
            <SheetFooter className="p-4 border-t flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSeriesFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Series</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
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

      <Sheet open={isBookingSettingsOpen} onOpenChange={setIsBookingSettingsOpen}>
        <SheetContent
          side="bottom"
          className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-xl">Booking Settings</SheetTitle>
              <SheetDescription>
                Manage settings for your online table bookings.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            <SheetFooter className="p-4 border-t flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveBookingSettings}
              >
                Save Settings
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isTableTypeDialogOpen} onOpenChange={setIsTableTypeDialogOpen}>
        <SheetContent
          side="bottom"
          className="sm:max-w-xl mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="text-xl">Manage Table Types</SheetTitle>
              <SheetDescription>Add new types or remove existing ones. This helps in organizing your tables.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTableTypeName}
                  onChange={(e) => setNewTableTypeName(e.target.value)}
                  placeholder="e.g. Rooftop, Bar Seating"
                />
                <Button
                  onClick={handleAddTableType}
                  disabled={!newTableTypeName.trim()}
                >
                  Add Type
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Existing Types</Label>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {tableTypes.map(type => (
                    <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="font-medium text-sm capitalize">{type}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTableType(type)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {tableTypes.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No custom types added.</p>}
                </div>
              </div>
            </div>
            <SheetFooter className="p-4 border-t">
              <Button
                type="button"
                onClick={() => setIsTableTypeDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Done
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

