
"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  PlusCircle,
  Pencil,
  Trash2,
  QrCode,
  MoreHorizontal,
  Settings,
  IndianRupee,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/AppContext"
import type { Table } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

const initialFormState = {
  name: "",
  capacity: "",
}

export default function TableManagementPage() {
  const { tables, addTable, updateTable, deleteTable } = useAppContext()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null)
  const [formData, setFormData] = useState(initialFormState)

  const [isBookingSettingsOpen, setIsBookingSettingsOpen] = useState(false)
  const [chargeForBooking, setChargeForBooking] = useState(true)
  const [bookingFee, setBookingFee] = useState("100")

  useEffect(() => {
    if (isFormOpen && editingTable) {
      setFormData({
        name: editingTable.name,
        capacity: editingTable.capacity.toString(),
      })
    } else {
      setFormData(initialFormState)
    }
  }, [isFormOpen, editingTable])

  const handleEditClick = (table: Table) => {
    setEditingTable(table)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (table: Table) => {
    setTableToDelete(table)
    setIsDeleteAlertOpen(true)
  }

  const confirmDelete = () => {
    if (tableToDelete) {
      deleteTable(tableToDelete.id)
      setIsDeleteAlertOpen(false)
      setTableToDelete(null)
    }
  }

  const handlePrintQR = (tableName: string) => {
    toast({
      title: `Printing QR for ${tableName}`,
      description: "Your QR code is being generated for printing.",
    })
  }

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.capacity) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and capacity for the table.",
        variant: "destructive",
      })
      return
    }

    const capacity = parseInt(formData.capacity, 10)
    if (isNaN(capacity) || capacity <= 0) {
      toast({
        title: "Invalid Capacity",
        description: "Please enter a valid number for capacity.",
        variant: "destructive",
      })
      return
    }

    if (editingTable) {
      updateTable({
        ...editingTable,
        name: formData.name,
        capacity,
      })
    } else {
      addTable(formData.name, capacity)
    }

    setIsFormOpen(false)
    setEditingTable(null)
  }

  const handleSaveBookingSettings = () => {
    toast({
        title: "Booking Settings Saved",
        description: `Advance booking fee has been ${chargeForBooking ? `set to ₹${bookingFee}` : 'disabled'}.`
    });
    setIsBookingSettingsOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
          <Users className="h-6 w-6" /> Table Management
        </h1>
        <div className="flex flex-col items-stretch sm:items-end gap-2">
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Table
            </Button>
            <Button variant="outline" onClick={() => setIsBookingSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" /> Booking Settings
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map(table => (
          <Card key={table.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">{table.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5"><Users className="h-4 w-4"/> Capacity: {table.capacity}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClick(table)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteClick(table)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
                <Badge variant={table.status === 'Available' ? 'secondary' : 'outline'} className={cn('capitalize text-sm', table.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300')}>
                    {table.status}
                </Badge>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handlePrintQR(table.name)}>
                <QrCode className="mr-2 h-4 w-4" /> Print QR Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveTable}>
            <DialogHeader>
              <DialogTitle>{editingTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
              <DialogDescription>
                {editingTable ? 'Update the details for this table.' : 'Provide a name and capacity for the new table.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="table-name" className="text-right">Name</Label>
                <Input
                  id="table-name"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., T1, P2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData(p => ({ ...p, capacity: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 4"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingTable ? 'Save Changes' : 'Add Table'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitleComponent>Are you absolutely sure?</AlertDialogTitleComponent>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the table
              "{tableToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <Dialog open={isBookingSettingsOpen} onOpenChange={setIsBookingSettingsOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Settings</DialogTitle>
              <DialogDescription>
                Manage settings for your online table bookings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="charge-booking-fee">Charge for Advance Bookings</Label>
                        <p className="text-xs text-muted-foreground">Enable to charge a small fee for reservations.</p>
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
                                onChange={e => setBookingFee(e.target.value)}
                                className="pl-9"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveBookingSettings}>Save Settings</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
