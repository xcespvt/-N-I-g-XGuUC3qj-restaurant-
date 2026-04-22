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
  Gift,
  Boxes,
  MinusCircle,
  ChevronDown,
  Pause,
  Play,
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
  tableTypeId: "",
  floor: ""
};

const initialSeriesFormState = {
  prefix: '',
  start: '',
  end: '',
  capacity: '',
  type: "Normal",
  tableTypeId: "",
  floor: ""
};

export default function TableManagementPage() {
  const { tables, addTable, updateTable, deleteTable, tableTypes, setTableTypes, orders, bookings, branches, selectedBranch, setTables, setBookings } = useAppStore();
  const { toast } = useToast();
  const { invalidate } = useQueryHelpers();

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
    tableTypeId: t?.tableTypeId,
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

  const { mutate: upsertFloorApi } = useMutationRequestDynamic<any, { name: string; floorId?: string }>("POST", () => `/api/branches/${restaurantId}/floors`);
  const { mutate: deleteFloorApi } = useMutationRequestDynamic<any, { floorId: string }>("DELETE", (vars) => `/api/branches/${restaurantId}/floors/${vars.floorId}`);

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
  const [bookingFeeType, setBookingFeeType] = useState<"flat" | "per_type">("flat");
  const [bookingFeePerType, setBookingFeePerType] = useState<Record<string, string>>({});
  const [bookingTermsEnabled, setBookingTermsEnabled] = useState(false);
  const [bookingTerms, setBookingTerms] = useState("");

  const [isTableTypeDialogOpen, setIsTableTypeDialogOpen] = useState(false);
  const [newTableTypeName, setNewTableTypeName] = useState("");

  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [isManagePackagesOpen, setIsManagePackagesOpen] = useState(false);
  const [packages, setPackages] = useState<any[]>([
    {
      id: "pkg-1",
      name: "Birthday Celebration",
      price: "2500",
      included: ["Table Decoration", "Welcome Drinks", "Birthday Cake (500g)"],
      excluded: ["Main Course", "Alcoholic Beverages"],
      status: "active",
    },
    {
      id: "pkg-2",
      name: "Romantic Date",
      price: "1800",
      included: ["Candlelight Setup", "2 Glasses of Wine", "Appetizer Platter"],
      excluded: ["Dessert", "Pick & Drop"],
      status: "active",
    },
  ]);
  const [packageForm, setPackageForm] = useState<any>({
    name: "",
    price: "",
    included: [""],
    excluded: [""],
    termsEnabled: false,
    terms: "",
  });
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const [activeZone, setActiveZone] = useState<string>("all");
  const [activeFloor, setActiveFloor] = useState<string>("All");
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");

  const floors = useMemo(() => activeBranch?.floors || [], [activeBranch]);

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
    return tables.filter(t => {
      const matchesZone = activeZone === "all" || t.tableTypeId === activeZone || t.type === activeZone;
      const matchesFloor = activeFloor === "All" || t.floor === activeFloor;
      return matchesZone && matchesFloor;
    });
  }, [tables, activeZone, activeFloor]);

  const groupedTables = useMemo(() => {
    return filteredTables.reduce((acc, table) => {
      // If 'All' is selected, group by floor. If a floor is selected, group by section.
      const group = activeFloor === "All" ? (table.floor || 'Unassigned') : (table.floor);
      if (!acc[group]) acc[group] = [];
      acc[group].push(table);
      return acc;
    }, {} as Record<string, Table[]>);
  }, [filteredTables, activeFloor]);

  const stats = useMemo(() => {
    return {
      available: tables.filter(t => t.status === "Available").length,
      occupied: tables.filter(t => t.status === "Occupied").length,
      booked: bookings.filter(b => b.status === "Confirmed").length,
    };
  }, [tables, bookings]);

  // Sync activeFloor with available floors
  useEffect(() => {
    if (activeFloor === "All") return;
    if (floors.length > 0) {
      const floorExists = floors.some(f => f.name === activeFloor);
      if (!floorExists || activeFloor === "Ground Floor") {
        // If current floor doesn't exist, or we're on the default but other floors exist
        // we might want to switch. But if Ground Floor exists in the list, keep it.
        const groundExists = floors.some(f => f.name === "Ground Floor");
        if (!groundExists || !floorExists) {
          setActiveFloor(floors[0].name);
        }
      }
    }
  }, [floors, activeFloor]);

  // Package Handlers
  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.price) return;
    if (editingPackageId) {
      setPackages(prev => prev.map(p => p.id === editingPackageId ? { ...p, ...packageForm } : p));
    } else {
      setPackages(prev => [...prev, { ...packageForm, id: `pkg-${Date.now()}`, status: "active" }]);
    }
    setIsCreatePackageOpen(false);
    setPackageForm({ name: "", price: "", included: [""], excluded: [""] });
    setEditingPackageId(null);
  };

  const togglePackageStatus = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  // Handlers
  const handleEditClick = (table: Table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      capacity: table.capacity.toString(),
      type: table.type,
      tableTypeId: table.tableTypeId || "",
      floor: table.floor || "Ground Floor"
    });
    setIsFormOpen(true);
  };
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
      floor: formData.floor || activeFloor,
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
      tableTypeId: seriesFormData.tableTypeId,
      floor: seriesFormData.floor || activeFloor
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
    if (newFloorName.trim()) {
      upsertFloorApi({ name: newFloorName.trim() }, {
        onSuccess: (response) => {
          const updatedFloors = response.data;
          useAppStore.getState().updateBranchFloors(selectedBranch, updatedFloors);
          setNewFloorName("");
          setIsAddFloorOpen(false);
          toast({ title: "Floor Added", description: `"${newFloorName}" has been created.` });
        }
      });
    }
  };

  const handleDeleteFloor = (e: React.MouseEvent, floorId: string) => {
    e.stopPropagation();
    deleteFloorApi({ floorId }, {
      onSuccess: (response) => {
        const updatedFloors = response.data;
        useAppStore.getState().updateBranchFloors(selectedBranch, updatedFloors);
        toast({ title: "Floor Deleted", variant: "destructive" });
      }
    });
  };

  return (
    <div className="pb-40 bg-[#F8FAFC] min-h-screen font-sans animate-in fade-in duration-700 overflow-x-hidden">

      {/* 1. Header & Quick Actions */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-10 pb-6 sm:pb-8 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">Tables</h1>
        </div>

        {/* Action HUD Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-6">
          <button onClick={() => { setEditingTable(null); setFormData({ ...initialFormState, floor: activeFloor }); setIsFormOpen(true); }} className="flex items-center justify-center gap-2 bg-[#1E90FF] text-white h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <PlusCircle size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Add Table</span>
          </button>
          <button onClick={() => { setSeriesFormData({ ...initialSeriesFormState, floor: activeFloor }); setIsSeriesFormOpen(true); }} className="flex items-center justify-center gap-2 bg-[#1E90FF] text-white h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <Layers size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Add Series</span>
          </button>
          <button onClick={() => setIsTableTypeDialogOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <Tag size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Types</span>
          </button>
          <button onClick={() => setIsBookingSettingsOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <Settings size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Booking Settings</span>
          </button>
          <button onClick={() => setIsCreatePackageOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <Gift size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Packages</span>
          </button>
          <button onClick={() => setIsManagePackagesOpen(true)} className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[48px] sm:h-[56px] rounded-[12px] sm:rounded-[14px] active:scale-[0.98] transition-all">
            <Boxes size={18} className="sm:w-5 sm:h-5" /> <span className="text-[13px] sm:text-[14px] font-medium">Manage Packages</span>
          </button>
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

        {/* Floor Selection Chips */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar mt-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <button
            onClick={() => setIsAddFloorOpen(true)}
            className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#E6F4FF] text-[#1E90FF] flex items-center gap-1.5"
          >
            <Plus size={18} />
            Add Floor
          </button>
          <button
            onClick={() => setActiveFloor("All")}
            className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${activeFloor === "All" ? "bg-[#E6F4FF] text-[#1E90FF]" : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"
              }`}
          >
            All Tables
          </button>
          {floors.map((floor) => (
            <button
              key={floor.floorId}
              onClick={() => setActiveFloor(floor.name)}
              className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 group ${activeFloor === floor.name ? "bg-[#E6F4FF] text-[#1E90FF]" : "bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"
                }`}
            >
              {floor.name}
              <span
                onClick={(e) => handleDeleteFloor(e, floor.floorId)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-blue-100 rounded-full transition-all"
              >
                <X size={14} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Table Grid */}
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        {isTablesLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-[120px] sm:h-[140px] rounded-[16px]" />)}
          </div>
        ) : Object.keys(groupedTables).length === 0 ? (
          <div className="py-16 sm:py-20 text-center bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 border-dashed">
            <Users className="mx-auto text-slate-200 mb-4" size={40} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] sm:text-[12px]">No Tables Found on {activeFloor}</p>
            <Button onClick={() => setIsFormOpen(true)} variant="ghost" className="mt-4 text-[#1E90FF] h-9 sm:h-10 text-sm">Add Your First Table</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-2">
            {Object.entries(groupedTables).map(([group, tablesInGroup]) => (
              <div key={group} className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <h3 className="text-[14px] sm:text-[16px] font-bold text-[#111827] capitalize">{group}</h3>
                  <div className="flex-1 h-[1px] bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {tablesInGroup.map(table => {
                    const info = getTableOccupationInfo(table);
                    const isAvailable = table.status === "Available";
                    const statusColor = isAvailable ? "bg-[#DCFCE7] text-[#15803D]" : info.type === 'Booking' ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#FEE2E2] text-[#B91C1C]";

                    return (
                      <div key={table.id} className="bg-white rounded-[16px] p-3 sm:p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[135px] sm:h-[155px] relative transition-all active:scale-[0.98] group hover:border-[#1E90FF]/40 hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <h4 className="text-[16px] sm:text-[20px] font-bold text-[#111827] leading-tight">{table.name}</h4>
                            <div className={cn("inline-block px-[6px] py-[1px] sm:px-[8px] sm:py-[2px] rounded-[4px] sm:rounded-[6px] text-[8px] sm:text-[10px] font-bold uppercase w-fit", isAvailable ? "bg-[#DCFCE7] text-[#15803D]" : info.type === 'Booking' ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#FEE2E2] text-[#B91C1C]")}>
                              {isAvailable ? "Available" : info.type === 'Booking' ? 'Booked' : 'Occupied'}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><MoreVertical size={18} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                              <DropdownMenuItem onClick={() => handleEditClick(table)} className="rounded-lg"><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintQR(table.name)} className="rounded-lg"><QrCode className="mr-2 h-4 w-4" /> Print QR</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(table)} className="text-destructive rounded-lg"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-1">
                          <p className="text-[11px] sm:text-[13px] text-slate-500 font-medium line-clamp-1">Cap: {table.capacity} • {table.type}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-slate-400 sm:w-[15px]" />
                            <span className="text-[12px] sm:text-[14px] font-bold text-slate-800 tracking-tight">{info.guests || 0}/{table.capacity}</span>
                          </div>
                          {!isAvailable && (info.booking?.time || (info.order as any)?.time) && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-slate-400 sm:w-[15px]" />
                              <span className="text-[11px] sm:text-[13px] font-bold text-slate-800">{info.booking?.time || (info.order as any)?.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals & Sheets */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col max-h-[80vh] rounded-t-[32px]">
          <form onSubmit={handleSaveTable} className="flex flex-col">
            <SheetHeader className="p-6 border-b">
              <SheetTitle>{editingTable ? "Edit Table" : "Add New Table"}</SheetTitle>
              <SheetDescription>Provide details for the table configuration.</SheetDescription>
            </SheetHeader>
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Table Name */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Table Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., T1"
                  className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))}
                  placeholder="e.g., 4"
                  className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Table Type
                </label>
                <div className="relative">
                  <select
                    value={formData.tableTypeId}
                    onChange={(e) => {
                      const v = e.target.value;
                      const selected = tableTypes.find(t => t.id === v);
                      setFormData(p => ({ ...p, tableTypeId: v, type: selected?.name || "Normal" }));
                    }}
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none cursor-pointer"
                  >
                    {tableTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Floor Select */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Floor
                </label>
                <div className="relative">
                  <select
                    value={formData.floor}
                    onChange={(e) => setFormData(p => ({ ...p, floor: e.target.value }))}
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none cursor-pointer"
                  >
                    {floors.map((floor) => (
                      <option key={floor.floorId} value={floor.name}>
                        {floor.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-[#E5E7EB] flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all bg-[#2563EB] text-white active:scale-[0.98]"
              >
                Save Table
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isSeriesFormOpen} onOpenChange={setIsSeriesFormOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col max-h-[90vh] rounded-t-[32px]">
          <form onSubmit={handleSaveTableSeries} className="p-6 space-y-4">
            <SheetHeader className="mb-4">
              <SheetTitle>Add Table Series</SheetTitle>
              <SheetDescription>Efficiently create multiple tables at once.</SheetDescription>
            </SheetHeader>
            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Prefix Input */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Series Name
                </label>
                <input
                  type="text"
                  value={seriesFormData.prefix}
                  onChange={(e) => setSeriesFormData(p => ({ ...p, prefix: e.target.value }))}
                  placeholder="e.g., S"
                  className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              {/* Start & End Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">
                    Start Number
                  </label>
                  <input
                    type="number"
                    value={seriesFormData.start}
                    onChange={(e) => setSeriesFormData(p => ({ ...p, start: e.target.value }))}
                    placeholder="e.g., 1"
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#6B7280] mb-1.5">
                    End Number
                  </label>
                  <input
                    type="number"
                    value={seriesFormData.end}
                    onChange={(e) => setSeriesFormData(p => ({ ...p, end: e.target.value }))}
                    placeholder="e.g., 10"
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Table Type
                </label>
                <div className="relative">
                  <select
                    value={seriesFormData.tableTypeId}
                    onChange={(e) => {
                      const v = e.target.value;
                      const selected = tableTypes.find(t => t.id === v);
                      setSeriesFormData(p => ({ ...p, tableTypeId: v, type: selected?.name || "Normal" }));
                    }}
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none cursor-pointer"
                  >
                    {tableTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Floor Select */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Floor
                </label>
                <div className="relative">
                  <select
                    value={seriesFormData.floor}
                    onChange={(e) => setSeriesFormData(p => ({ ...p, floor: e.target.value }))}
                    className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none cursor-pointer"
                  >
                    {floors.map((floor) => (
                      <option key={floor.floorId} value={floor.name}>
                        {floor.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Capacity Input */}
              <div>
                <label className="block text-[13px] text-[#6B7280] mb-1.5">
                  Capacity per Table
                </label>
                <input
                  type="number"
                  value={seriesFormData.capacity}
                  onChange={(e) => setSeriesFormData(p => ({ ...p, capacity: e.target.value }))}
                  placeholder="e.g., 4"
                  className="w-full h-[48px] bg-white border border-[#E5E7EB] rounded-[12px] px-[14px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-[#E5E7EB] flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsSeriesFormOpen(false)}
                className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all bg-[#2563EB] text-white active:scale-[0.98]"
              >
                Create Series
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>


      <Sheet open={isBookingSettingsOpen} onOpenChange={setIsBookingSettingsOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col max-h-[90vh] rounded-t-[32px]">
          <SheetHeader className="p-6 border-b shrink-0">
            <SheetTitle>Booking Settings</SheetTitle>
          </SheetHeader>
          <div className="p-6 overflow-y-auto flex-1 space-y-6 no-scrollbar">
            {/* Toggle Section */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-slate-100">
              <div>
                <h4 className="text-[14px] font-medium text-[#111827]">Enable Booking Fee</h4>
                <p className="text-[12px] text-[#6B7280] mt-0.5">Apply to normal bookings</p>
              </div>
              <Switch checked={chargeForBooking} onCheckedChange={setChargeForBooking} />
            </div>

            {/* Amount Input */}
            <div className={cn("transition-opacity duration-300", chargeForBooking ? "opacity-100" : "opacity-40 pointer-events-none")}>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setBookingFeeType("flat")} className={cn("flex-1 py-2 text-[13px] font-medium rounded-[8px] border transition-all", bookingFeeType === "flat" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-[#E5E7EB] text-[#6B7280]")}>Flat Charge</button>
                <button onClick={() => setBookingFeeType("per_type")} className={cn("flex-1 py-2 text-[13px] font-medium rounded-[8px] border transition-all", bookingFeeType === "per_type" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-[#E5E7EB] text-[#6B7280]")}>Per Table Type</button>
              </div>

              {bookingFeeType === "flat" ? (
                <>
                  <Label className="block text-[13px] text-[#6B7280] mb-1.5">Default Fee Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                    <Input type="number" value={bookingFee} onChange={e => setBookingFee(e.target.value)} placeholder="e.g., 500" className="pl-10 h-[48px] rounded-[12px]" />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {tableTypes.map(type => (
                    <div key={type.id} className="flex items-center gap-3">
                      <span className="w-24 text-[13px] font-medium text-[#4B5563] truncate">{type.name}</span>
                      <div className="relative flex-1">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={14} />
                        <Input type="number" value={bookingFeePerType[type.name] || ""} onChange={e => setBookingFeePerType({ ...bookingFeePerType, [type.name]: e.target.value })} placeholder="Amount" className="pl-9 h-[40px] rounded-[10px]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[12px] text-[#6B7280] mt-3">This amount will be pre-authorized at the time of table booking.</p>
            </div>

            {/* Custom Terms & Conditions */}
            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-[14px] font-medium text-[#111827]">Custom Terms & Conditions</h4>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">Add specific rules for bookings</p>
                </div>
                <Switch checked={bookingTermsEnabled} onCheckedChange={setBookingTermsEnabled} />
              </div>
              {bookingTermsEnabled && (
                <textarea value={bookingTerms} onChange={e => setBookingTerms(e.target.value)} placeholder="Enter your custom terms and conditions here..." className="w-full h-24 bg-white border border-[#E5E7EB] rounded-[12px] p-3 text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] resize-none mt-2" />
              )}
            </div>
          </div>
          <SheetFooter className="p-6 border-t shrink-0 flex gap-3">
            <Button variant="ghost" onClick={() => setIsBookingSettingsOpen(false)} className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] bg-slate-100 text-slate-700 active:scale-[0.98] border-none">Cancel</Button>
            <Button onClick={() => { toast({ title: "Settings Saved" }); setIsBookingSettingsOpen(false); }} className="flex-1 bg-[#1E90FF] h-[52px] rounded-[16px] font-bold text-[16px]">Save Settings</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isCreatePackageOpen} onOpenChange={setIsCreatePackageOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col max-h-[90vh] rounded-t-[32px]">
          <SheetHeader className="p-6 border-b shrink-0">
            <SheetTitle>{editingPackageId ? "Edit Package" : "Create Package"}</SheetTitle>
            <SheetDescription>Define pricing and inclusions.</SheetDescription>
          </SheetHeader>
          <div className="p-6 overflow-y-auto flex-1 space-y-6 no-scrollbar">
            <div className="space-y-1.5"><Label>Package Name/Title</Label><Input value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })} placeholder="e.g., Birthday Package" className="h-[48px] rounded-xl" /></div>
            <div className="space-y-1.5">
              <Label>Package Price (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input type="number" value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })} className="pl-9 h-[48px] rounded-xl" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Whats Included?</Label><Button variant="ghost" size="sm" onClick={() => setPackageForm({ ...packageForm, included: [...(packageForm.included || []), ""] })} className="text-[#1E90FF] text-xs">+ Add Item</Button></div>
              {packageForm.included?.map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input value={item} onChange={e => { const list = [...packageForm.included]; list[idx] = e.target.value; setPackageForm({ ...packageForm, included: list }); }} className="rounded-xl" />
                  <Button variant="ghost" onClick={() => { const list = [...packageForm.included]; list.splice(idx, 1); setPackageForm({ ...packageForm, included: list }); }} className="text-red-400"><MinusCircle size={18} /></Button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between"><Label>Excluded Items</Label><Button variant="ghost" size="sm" onClick={() => setPackageForm({ ...packageForm, excluded: [...(packageForm.excluded || []), ""] })} className="text-[#1E90FF] text-xs">+ Add Item</Button></div>
              {packageForm.excluded?.map((item: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input value={item} onChange={e => { const list = [...packageForm.excluded]; list[idx] = e.target.value; setPackageForm({ ...packageForm, excluded: list }); }} className="rounded-xl" />
                  <Button variant="ghost" onClick={() => { const list = [...packageForm.excluded]; list.splice(idx, 1); setPackageForm({ ...packageForm, excluded: list }); }} className="text-red-400"><MinusCircle size={18} /></Button>
                </div>
              ))}
            </div>
          </div>
          <SheetFooter className="p-6 border-t shrink-0">
            <Button onClick={handleSavePackage} className="w-full bg-[#1E90FF] h-[52px] rounded-xl font-bold">Save Package</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isManagePackagesOpen} onOpenChange={setIsManagePackagesOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col max-h-[90vh] rounded-t-[32px]">
          <SheetHeader className="p-6 border-b shrink-0 flex flex-row items-center justify-between">
            <SheetTitle className="text-[20px] font-bold">Manage Packages</SheetTitle>
          </SheetHeader>
          <div className="p-6 overflow-y-auto flex-1 space-y-4 no-scrollbar">
            {packages.length === 0 ? (
              <div className="py-20 text-center">
                <Gift size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">No packages created yet.</p>
              </div>
            ) : packages.map(pkg => (
              <div key={pkg.id} className={cn("rounded-[20px] border border-slate-100 transition-all overflow-hidden", pkg.status === "paused" ? "bg-slate-50 grayscale opacity-75" : "bg-white shadow-sm hover:shadow-md")}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", pkg.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-500")}>
                          {pkg.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                        </span>
                        <h4 className="text-[16px] font-bold text-[#111827]">{pkg.name}</h4>
                      </div>
                      <p className="text-[18px] font-bold text-[#1E90FF]">₹{pkg.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePackageStatus(pkg.id)}
                        className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-all", pkg.status === 'active' ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100")}
                      >
                        {pkg.status === 'active' ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                      </button>
                      <button
                        onClick={() => { setPackageForm(pkg); setEditingPackageId(pkg.id); setIsManagePackagesOpen(false); setIsCreatePackageOpen(true); }}
                        className="w-9 h-9 bg-blue-50 text-[#1E90FF] rounded-full flex items-center justify-center hover:bg-blue-100 transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-50 my-4" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">INCLUDED</p>
                      <p className="text-[14px] font-bold text-slate-700">{pkg.included?.filter((i: any) => i.trim()).length || 0} Items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">EXCLUDED</p>
                      <p className="text-[14px] font-bold text-slate-700">{pkg.excluded?.filter((i: any) => i.trim()).length || 0} Items</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SheetFooter className="p-6 border-t shrink-0 flex gap-3">
            <Button variant="ghost" onClick={() => setIsManagePackagesOpen(false)} className="flex-1 h-[52px] rounded-[16px] font-bold text-[16px] bg-slate-100 text-slate-700 active:scale-[0.98] border-none">Cancel</Button>
            <Button onClick={() => setIsManagePackagesOpen(false)} className="flex-1 bg-[#1E90FF] h-[52px] rounded-[16px] font-bold text-[16px]">Done</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isTableTypeDialogOpen} onOpenChange={setIsTableTypeDialogOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 rounded-t-[32px]">
          <div className="p-8 space-y-6">
            <SheetHeader><SheetTitle>Table Types</SheetTitle></SheetHeader>
            <div className="flex gap-2">
              <Input value={newTableTypeName} onChange={e => setNewTableTypeName(e.target.value)} placeholder="e.g., VIP, Outdoor" className="rounded-xl h-[48px]" />
              <Button onClick={handleAddTableType} className="bg-[#1E90FF] rounded-xl h-[48px]">Add</Button>
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
                  className="w-full h-[52px] bg-slate-50 border-none rounded-xl px-4 text-[15px] focus:ring-2 focus:ring-[#1E90FF]/20 transition-all font-medium"
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
                className="flex-1 h-[52px] bg-[#1E90FF] text-white rounded-xl font-bold text-[14px] active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
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
