"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Users,
  PlusCircle,
  Pencil,
  Trash2,
  QrCode,
  MoreHorizontal,
  MoreVertical,
  Settings,
  IndianRupee,
  Tag,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Layers,
  Plus,
  X,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/context/useAppStore";
import type { Table, Order, Booking } from "@/context/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGet, usePost, useQueryHelpers, useMutationRequestDynamic } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

const initialFormState = {
  name: "",
  capacity: "",
  type: "Normal",
  tableTypeId: ""
};

const initialSeriesFormState = {
  prefix: '',
  start: '',
  end: '',
  capacity: '',
  type: "Normal",
  tableTypeId: ""
};

export default function TableManagementPage() {
  const { tables, addTable, updateTable, deleteTable, tableTypes, setTableTypes, orders, bookings, branches, selectedBranch, setTables, setBookings } = useAppStore();
  const { toast } = useToast();
  const { invalidate } = useQueryHelpers();

  // State for source UI elements
  const [activeZone, setActiveZone] = useState<string>("all");
  const [activeFloor, setActiveFloor] = useState<string>("Ground Floor");
  const [floors, setFloorsList] = useState<string[]>(["Ground Floor", "First Floor", "Rooftop"]);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");

  // Determine active restaurantId from selected branch
  const activeBranch = useMemo(() => branches.find(b => b.id === selectedBranch), [branches, selectedBranch]);
  const restaurantId = activeBranch?.restaurantId || "";
  
  // Fetch bookings and tables from backend
  const { data: bookingsData, isLoading: isTablesLoading, error: tablesError } = useGet<any>(
    ["bookings", restaurantId],
    `/api/bookings/${restaurantId}`,
    undefined,
    { enabled: !!restaurantId }
  );

  // Fetch table types
  const { data: tableTypesData } = useGet<any>(
    ["tableTypes", selectedBranch],
    `/api/tables/${selectedBranch}/types`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const normalizeStatus = (s: any): Table["status"] => {
    const lower = (s ?? "available").toString().toLowerCase();
    if (["available", "free", "ready"].includes(lower)) return "Available";
    return "Occupied";
  };

  const mapOne = (t: any): Table => ({
    id: (t?.tableId ?? t?.id ?? t?._id ?? "").toString(),
    name: (t?.name ?? "Table").toString(),
    capacity: Number(t?.capacity ?? 4),
    status: normalizeStatus(t?.status),
    type: t?.type ?? "Normal",
    tableTypeId: t?.tableTypeId || "",
    section: t?.section || "Main",
    floor: t?.floor || "Ground Floor",
  });

  useEffect(() => {
    if (!bookingsData) return;
    try {
      const root = (bookingsData as any)?.data ?? bookingsData;
      
      let remoteTables: Table[] = [];
      let remoteBookings: Booking[] = [];

      if (root && typeof root === "object" && !Array.isArray(root)) {
          Object.values(root).forEach((group: any) => {
              if (group && Array.isArray(group.bookings)) {
                  // The documents in the status groups are the tables themselves
                  remoteTables.push(...group.bookings.map(mapOne));
                  
                  // If we need to treat some as bookings (e.g. they have partySize/customer info)
                  const potentialBookings = group.bookings.filter((b: any) => b.partySize || b.isAdvanceBooking);
                  remoteBookings.push(...potentialBookings);
              }
          });
      }
      
      setTables(remoteTables);
      if (remoteBookings.length > 0) setBookings(remoteBookings);
    } catch (e) {
      console.error("Failed to sync bookings and tables:", e);
    }
  }, [bookingsData, setTables, setBookings]);

  useEffect(() => {
    if (tableTypesData) {
      try {
        const types = Array.isArray(tableTypesData) ? tableTypesData : (tableTypesData.data || []);
        if (Array.isArray(types)) {
          const normalizedTypes = types.map((t: any) => typeof t === 'object' ? ({ name: t.name, id: t.tableTypeId || t.id }) : ({ name: t, id: t }));
          setTableTypes(normalizedTypes);
        }
      } catch (e) { console.error(e); }
    }
  }, [tableTypesData, setTableTypes]);

  // Mutation Hooks
  const addSeries = usePost<any, any>(`/api/bookings/${restaurantId}/tables/series`);
  const addTypeMutation = usePost<any, { name: string }>(`/api/tables/${selectedBranch}/types`);
  const { mutate: deleteTypeApi } = useMutationRequestDynamic<any, { typeId: string }>("DELETE", (vars) => `/api/tables/${selectedBranch}/types/${encodeURIComponent(vars.typeId)}`);

  const addTableApi = usePost<any, any>(`/api/bookings/${restaurantId}/tables`);
  const updateTableApi = useMutationRequestDynamic<any, any>("PUT", (vars) => `/api/bookings/${vars.restaurantId}/tables/${vars.tableId}`);
  const deleteTableApi = useMutationRequestDynamic<any, any>("DELETE", (vars) => `/api/bookings/${vars.restaurantId}/tables/${vars.tableId}`);

  // UI States
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

  const getTableOccupationInfo = (table: Table) => {
    if (table.status === "Available") return { type: null, order: null, guests: null, booking: null };
    const activeBooking = bookings.find(b => (b.status === "Confirmed" || b.status === "Pending") && b.tables.some(t => t.id === table.id));
    if (activeBooking) {
      const preOrder = orders.find(o => o.id.includes(activeBooking.id));
      return { type: "Booking", order: preOrder || null, guests: activeBooking.partySize, booking: activeBooking };
    }
    const dineInOrder = orders.find(order => order.type === 'Dine-in' && !["Delivered", "Cancelled", "Rejected"].includes(order.status) && order.customerDetails.address.includes(table.name));
    if (dineInOrder) return { type: "Dine-in", order: dineInOrder, guests: dineInOrder.items.reduce((acc, item) => acc + item.quantity, 0) || 2, booking: null };
    return { type: 'Dine-in', order: null, guests: table.capacity, booking: null };
  };

  const filteredTables = useMemo(() => {
    return tables.filter(t => activeZone === "all" || t.tableTypeId === activeZone || t.type === activeZone);
  }, [tables, activeZone]);

  const groupedTables = useMemo(() => {
    return filteredTables.reduce((acc, table) => {
      const group = table.section || table.type || 'Main';
      if (!acc[group]) acc[group] = [];
      acc[group].push(table);
      return acc;
    }, {} as Record<string, Table[]>);
  }, [filteredTables]);

  const stats = useMemo(() => {
    return {
      available: tables.filter(t => t.status === "Available").length,
      occupied: tables.filter(t => t.status === "Occupied").length,
      booked: bookings.filter(b => b.status === "Confirmed").length,
    };
  }, [tables, bookings]);

  // Handlers
  const handleEditClick = (table: Table) => { setEditingTable(table); setFormData({ name: table.name, capacity: table.capacity.toString(), type: table.type, tableTypeId: table.tableTypeId || "" }); setIsFormOpen(true); };
  const handleDeleteClick = (table: Table) => { setTableToDelete(table); setIsDeleteAlertOpen(true); };
  const confirmDelete = () => {
    if (tableToDelete) {
      deleteTableApi.mutate({ tableId: tableToDelete.id, restaurantId }, {
        onSuccess: async () => {
          toast({ title: "Table Deleted", variant: "destructive" });
          await invalidate(["bookings", restaurantId]);
          setIsDeleteAlertOpen(false);
          setTableToDelete(null);
        }
      });
    }
  };
  const handlePrintQR = (tableName: string) => { toast({ title: `Printing QR for ${tableName}`, description: "Generated for printing." }); };
  
  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = parseInt(formData.capacity, 10);
    const payload = { 
      name: formData.name, 
      capacity, 
      type: formData.type,
      tableTypeId: formData.tableTypeId,
      restaurantId // Include this just in case
    };

    if (editingTable) {
      updateTableApi.mutate({ ...payload, tableId: editingTable.id, restaurantId }, {
        onSuccess: async () => {
          toast({ title: "Table Updated", description: `${formData.name} has been updated.` });
          await invalidate(["bookings", restaurantId]);
          setIsFormOpen(false);
          setEditingTable(null);
          setFormData(initialFormState);
        }
      });
    } else {
      addTableApi.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Table Added" });
          invalidate(["tables", selectedBranch]);
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleSaveTableSeries = (e: React.FormEvent) => {
    e.preventDefault();
    addSeries.mutate({ 
      prefix: seriesFormData.prefix, 
      startNumber: parseInt(seriesFormData.start), 
      endNumber: parseInt(seriesFormData.end), 
      capacity: parseInt(seriesFormData.capacity), 
      type: seriesFormData.type,
      tableTypeId: seriesFormData.tableTypeId
    }, {
      onSuccess: async () => { toast({ title: "Tables Added" }); await invalidate(["tables", selectedBranch]); setIsSeriesFormOpen(false); }
    });
  };

  const handleAddTableType = () => {
    addTypeMutation.mutate({ name: newTableTypeName.trim() }, {
      onSuccess: async () => { toast({ title: "Type Added" }); await invalidate(["tableTypes", restaurantId]); setNewTableTypeName(""); },
    });
  };

  const handleDeleteTableType = (typeId: string) => {
    deleteTypeApi({ typeId }, {
      onSuccess: async () => { toast({ title: "Type Deleted" }); await invalidate(["tableTypes", selectedBranch]); },
    });
  };

  const handleAddFloor = () => {
    if (newFloorName.trim() && !floors.includes(newFloorName.trim())) {
      setFloorsList([...floors, newFloorName.trim()]);
      setNewFloorName("");
      setIsAddFloorOpen(false);
      toast({ title: "Floor Added", description: `"${newFloorName}" has been created.` });
    }
  };

  return (
    <div className="pb-40 bg-[#F8FAFC] min-h-screen font-sans animate-in fade-in duration-700 overflow-x-hidden">
      
      {/* 1. Header & Quick Actions */}
      <div className="px-6 pt-10 pb-8 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-[20px] font-semibold text-[#111827]">Tables</h1>
        </div>

        {/* Action HUD Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <button onClick={() => { setEditingTable(null); setFormData(initialFormState); setIsFormOpen(true); }} className="flex items-center justify-center gap-2 bg-[#2563EB] text-white h-[56px] rounded-[14px] active:scale-[0.98] transition-all">
            <PlusCircle size={20} /> <span className="text-[14px] font-medium">Add Table</span>
          </button>
          <button onClick={() => setIsSeriesFormOpen(true)} className="flex items-center justify-center gap-2 bg-[#2563EB] text-white h-[56px] rounded-[14px] active:scale-[0.98] transition-all">
            <Layers size={20} /> <span className="text-[14px] font-medium">Add Series</span>
          </button>
          <button onClick={() => setIsTableTypeDialogOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#2563EB] h-[56px] rounded-[14px] active:scale-[0.98] transition-all">
            <Tag size={20} /> <span className="text-[14px] font-medium">Manage Types</span>
          </button>
          <button onClick={() => setIsBookingSettingsOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#2563EB] h-[56px] rounded-[14px] active:scale-[0.98] transition-all">
            <Settings size={20} /> <span className="text-[14px] font-medium">Settings</span>
          </button>
        </div>

        {/* Floor Selection Chips */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-6 px-6 lg:mx-0 lg:px-0">
          <button
            onClick={() => setIsAddFloorOpen(true)}
            className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#EFF6FF] text-[#2563EB] flex items-center gap-1.5"
          >
            <Plus size={18} />
            Add Floor
          </button>
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                activeFloor === floor ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* HUD Stats */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          <div className="bg-[#F0FDF4] rounded-[16px] p-4 border border-[#DCFCE7] min-w-[140px] flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-[#166534]">Available</p>
              <CheckCircle2 size={16} className="text-[#166534]" />
            </div>
            <p className="text-[24px] font-bold text-[#166534] leading-none">{stats.available.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#FEF2F2] rounded-[16px] p-4 border border-[#FEE2E2] min-w-[140px] flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-[#991B1B]">Occupied</p>
              <Users size={16} className="text-[#991B1B]" />
            </div>
            <p className="text-[24px] font-bold text-[#991B1B] leading-none">{stats.occupied.toString().padStart(2, '0')}</p>
          </div>
          <div className="bg-[#FFFBEB] rounded-[16px] p-4 border border-[#FEF3C7] min-w-[140px] flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-[#92400E]">Booked</p>
              <CalendarCheck size={16} className="text-[#92400E]" />
            </div>
            <p className="text-[24px] font-bold text-[#92400E] leading-none">{stats.booked.toString().padStart(2, '0')}</p>
          </div>
        </div>

        {/* Zone Filters */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar mt-6">
          <button onClick={() => setActiveZone("all")} className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium transition-all ${activeZone === "all" ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"}`}>All Tables</button>
          {tableTypes.map(type => (
            <button key={type.id} onClick={() => setActiveZone(type.id)} className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium transition-all ${activeZone === type.id ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"}`}>{type.name}</button>
          ))}
        </div>
      </div>

      {/* 2. Table Grid */}
      <div className="p-6 max-w-7xl mx-auto">
        {isTablesLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-[140px] rounded-[16px]" />)}
            </div>
        ) : Object.keys(groupedTables).length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100 border-dashed">
                <Users className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[12px]">No Tables Found</p>
                <Button onClick={() => setIsFormOpen(true)} variant="ghost" className="mt-4 text-[#2563EB]">Add Your First Table</Button>
            </div>
        ) : (
            Object.entries(groupedTables).map(([group, tablesInGroup]) => (
                <div key={group} className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-[16px] font-semibold text-[#111827] capitalize">{group}</h3>
                        <div className="flex-1 h-[1px] bg-slate-100"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tablesInGroup.map(table => {
                            const info = getTableOccupationInfo(table);
                            const isAvailable = table.status === "Available";
                            const statusColor = isAvailable ? "bg-[#DCFCE7] text-[#15803D]" : info.type === 'Booking' ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#FEE2E2] text-[#B91C1C]";

                            return (
                                <div key={table.id} className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[155px] relative transition-transform active:scale-[0.98] group hover:border-blue-200">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[20px] font-bold text-[#111827]">{table.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("px-[10px] py-[4px] rounded-[10px] text-[11px] font-bold uppercase", isAvailable ? "bg-[#DCFCE7] text-[#15803D]" : info.type === 'Booking' ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#FEE2E2] text-[#B91C1C]")}>
                                                {isAvailable ? "Available" : info.type === 'Booking' ? 'Booked' : 'Occupied'}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1 hover:bg-slate-50 rounded-full text-slate-400"><MoreVertical size={18} /></button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                                                    <DropdownMenuItem onClick={() => handleEditClick(table)} className="rounded-lg"><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handlePrintQR(table.name)} className="rounded-lg"><QrCode className="mr-2 h-4 w-4" /> Print QR</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(table)} className="text-destructive rounded-lg"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="mt-1">
                                        <p className="text-[13px] text-slate-500 font-medium">Cap: {table.capacity} • {table.type}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={15} className="text-slate-400" />
                                            <span className="text-[14px] font-bold text-slate-800 tracking-tight">{info.guests || 0}/{table.capacity}</span>
                                        </div>
                                        {!isAvailable && (info.booking?.time || (info.order as any)?.time) && (
                                            <div className="flex items-center gap-1">
                                                <Clock size={15} className="text-slate-400" />
                                                <span className="text-[13px] font-bold text-slate-800">{info.booking?.time || (info.order as any)?.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Modals & Sheets */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh] rounded-t-[32px]">
          <form onSubmit={handleSaveTable} className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>{editingTable ? "Edit Table" : "Add New Table"}</SheetTitle>
              <SheetDescription>Provide details for the table configuration.</SheetDescription>
            </SheetHeader>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Table Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., T1" className="rounded-xl h-[48px]" />
              </div>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input type="number" value={formData.capacity} onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))} placeholder="4" className="rounded-xl h-[48px]" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select 
                  value={formData.tableTypeId} 
                  onValueChange={(v) => {
                    const selected = tableTypes.find(t => t.id === v);
                    setFormData(p => ({ ...p, tableTypeId: v, type: selected?.name || "Normal" }));
                  }}
                >
                  <SelectTrigger className="rounded-xl h-[48px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="p-6 border-t flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="flex-1 rounded-xl h-[48px]">Cancel</Button>
              <Button type="submit" className="flex-1 bg-[#2563EB] rounded-xl h-[48px]">{editingTable ? "Save" : "Add"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isSeriesFormOpen} onOpenChange={setIsSeriesFormOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh] rounded-t-[32px]">
            <form onSubmit={handleSaveTableSeries} className="p-6 space-y-4">
                <SheetHeader className="mb-4">
                    <SheetTitle>Add Table Series</SheetTitle>
                    <SheetDescription>Efficiently create multiple tables at once.</SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Prefix</Label><Input value={seriesFormData.prefix} onChange={e => setSeriesFormData(p => ({...p, prefix: e.target.value}))} placeholder="T" className="rounded-xl" /></div>
                    <div className="space-y-1.5"><Label>Capacity</Label><Input type="number" value={seriesFormData.capacity} onChange={e => setSeriesFormData(p => ({...p, capacity: e.target.value}))} placeholder="4" className="rounded-xl" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Start #</Label><Input type="number" value={seriesFormData.start} onChange={e => setSeriesFormData(p => ({...p, start: e.target.value}))} placeholder="1" className="rounded-xl" /></div>
                    <div className="space-y-1.5"><Label>End #</Label><Input type="number" value={seriesFormData.end} onChange={e => setSeriesFormData(p => ({...p, end: e.target.value}))} placeholder="10" className="rounded-xl" /></div>
                </div>
                <div className="space-y-1.5">
                    <Label>Table Type</Label>
                    <Select 
                        value={seriesFormData.tableTypeId} 
                        onValueChange={v => {
                            const selected = tableTypes.find(t => t.id === v);
                            setSeriesFormData(p => ({...p, tableTypeId: v, type: selected?.name || "Normal"}));
                        }}
                    >
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{tableTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="w-full bg-[#2563EB] h-[52px] rounded-xl mt-4">Generate Series</Button>
            </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isBookingSettingsOpen} onOpenChange={setIsBookingSettingsOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 rounded-t-[32px]">
            <div className="p-8 space-y-6">
                <SheetHeader><SheetTitle>Booking Settings</SheetTitle></SheetHeader>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-bold">Charge Advance Fee</Label>
                        <p className="text-[12px] text-slate-500">Collect payment during booking</p>
                    </div>
                    <Switch checked={chargeForBooking} onCheckedChange={setChargeForBooking} />
                </div>
                {chargeForBooking && (
                    <div className="space-y-1.5">
                        <Label>Flat Booking Fee (₹)</Label>
                        <Input type="number" value={bookingFee} onChange={e => setBookingFee(e.target.value)} className="h-[52px] rounded-xl" />
                    </div>
                )}
                <Button onClick={() => { toast({title: "Settings Saved"}); setIsBookingSettingsOpen(false); }} className="w-full bg-[#2563EB] h-[52px] rounded-xl mt-4">Save Configuration</Button>
            </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isTableTypeDialogOpen} onOpenChange={setIsTableTypeDialogOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 rounded-t-[32px]">
            <div className="p-8 space-y-6">
                <SheetHeader><SheetTitle>Table Types</SheetTitle></SheetHeader>
                <div className="flex gap-2">
                    <Input value={newTableTypeName} onChange={e => setNewTableTypeName(e.target.value)} placeholder="e.g., VIP, Outdoor" className="rounded-xl h-[48px]" />
                    <Button onClick={handleAddTableType} className="bg-[#2563EB] rounded-xl h-[48px]">Add</Button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                    {tableTypes.map(type => (
                        <div key={type.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <span className="font-medium text-slate-700">{type.name}</span>
                            <button onClick={() => handleDeleteTableType(type.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitleComponent>Delete Table?</AlertDialogTitleComponent>
            <AlertDialogDescription>Permanent removal of "{tableToDelete?.name}".</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Floor Modal */}
      {isAddFloorOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 flex justify-center pt-20 animate-in fade-in duration-200 px-4"
          onClick={() => setIsAddFloorOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-[24px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-50 shrink-0">
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Add Floor
              </h2>
              <button
                onClick={() => setIsAddFloorOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <Label className="block text-[14px] text-slate-600 mb-2">
                  Floor Name
                </Label>
                <Input
                  type="text"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  placeholder="e.g., Ground Floor"
                  className="w-full h-[52px] bg-slate-50 border-none rounded-xl px-4 text-[15px] focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-50 flex gap-3 shrink-0">
              <button
                onClick={() => setIsAddFloorOpen(false)}
                className="flex-1 h-[52px] bg-transparent text-slate-500 rounded-xl font-bold text-[14px] active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFloor}
                className="flex-1 h-[52px] bg-[#2563EB] text-white rounded-xl font-bold text-[14px] active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
              >
                Save Floor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
