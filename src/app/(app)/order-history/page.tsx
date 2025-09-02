
"use client"

import { useMemo, useState } from "react"
import { History, IndianRupee, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AppContext"
import type { Order, OrderStatus } from "@/context/AppContext"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { OrderDetailsDialog } from "@/components/order-details-dialog"

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300",
  Rejected: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
};

export default function OrderHistoryPage() {
  const { orders } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Delivery" | "Takeaway" | "Dine-in">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pastOrders = useMemo(() => {
    return orders
      .filter(order => ["Delivered", "Cancelled", "Rejected"].includes(order.status))
      .filter(order => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        const matchesType = typeFilter === "All" || order.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2"><History className="h-6 w-6"/> Order History</h1>
      </div>
      
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Order ID or Customer" 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by Status"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by Type"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Takeaway">Takeaway</SelectItem>
                    <SelectItem value="Dine-in">Dine-in</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pastOrders.map(order => (
          <Card key={order.id} className="shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <Badge variant="outline" className={cn("capitalize", statusStyles[order.status])}>{order.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {order.time}</p>
                <p>{order.type}</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                  <p className="font-bold text-xl text-primary flex items-center"><IndianRupee className="h-5 w-5"/>{order.total.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pastOrders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <History className="h-12 w-12 mx-auto mb-2"/>
            <p>No past orders found that match your criteria.</p>
          </div>
        )}
      </div>

       <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md p-0">
          {selectedOrder && <OrderDetailsDialog order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
