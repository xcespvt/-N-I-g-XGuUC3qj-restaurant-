
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Coffee, PlusCircle, QrCode, ShoppingBag, Download, Trash2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const qrCodes = [
    { id: "T-01", name: "Table 1", uses: 42, active: true },
    { id: "T-02", name: "Table 2", uses: 31, active: true },
    { id: "T-03", name: "Table 3", uses: 18, active: true },
    { id: "T-04", name: "Table 4", uses: 25, active: false },
    { id: "P-01", name: "Patio 1", uses: 12, active: true },
]


export default function DineInTakeawayPage() {
  const { toast } = useToast();
  
  const showToast = (message: string) => {
    toast({
        title: "Action Required",
        description: message,
    })
  }
  
  const showComingSoonToast = () => {
    toast({
        title: "Feature coming soon!",
        description: "This feature will be available in a future update.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
        <Coffee className="h-6 w-6" /> Dine-In & Takeaway
      </h1>

      <Tabs defaultValue="dine-in" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
          <TabsTrigger value="dine-in">
            <QrCode className="mr-2 h-4 w-4" /> Dine-In (QR Orders)
          </TabsTrigger>
          <TabsTrigger value="takeaway">
            <ShoppingBag className="mr-2 h-4 w-4" /> Takeaway
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dine-in" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Table QR Codes</CardTitle>
                                <CardDescription>Manage QR codes for your tables.</CardDescription>
                            </div>
                            <Button onClick={showComingSoonToast}><PlusCircle className="mr-2 h-4 w-4"/> Generate New</Button>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                             {qrCodes.map(qr => (
                                <div key={qr.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <QrCode className="h-8 w-8 text-primary"/>
                                        <div>
                                            <p className="font-semibold">{qr.name} ({qr.id})</p>
                                            <p className="text-sm text-muted-foreground">{qr.uses} uses today</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Switch defaultChecked={qr.active}/>
                                        <div className="flex items-center gap-1">
                                            <Button variant="outline" size="icon" onClick={showComingSoonToast}><Download className="h-4 w-4"/></Button>
                                            <Button variant="outline" size="icon" onClick={showComingSoonToast}><Pencil className="h-4 w-4"/></Button>
                                            <Button variant="destructive" size="icon" onClick={() => showToast(`QR code ${qr.id} deleted.`)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    </div>
                                </div>
                             ))}
                           </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dine-In Settings</CardTitle>
                            <CardDescription>Customize the dine-in experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dine-in-status">Accepting Dine-In Orders</Label>
                                <Switch id="dine-in-status" defaultChecked/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="service-charge">Service Charge (%)</Label>
                                <Input id="service-charge" type="number" defaultValue="10"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="dine-in-message">Custom Welcome Message</Label>
                                <Input id="dine-in-message" placeholder="Welcome to Spice Garden!"/>
                            </div>
                            <Button className="w-full" onClick={() => showToast("Dine-in settings saved.")}>Save Settings</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="takeaway" className="mt-6">
           <Card>
                <CardHeader>
                    <CardTitle>Takeaway Settings</CardTitle>
                    <CardDescription>Configure options for takeaway orders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="takeaway-status" className="text-base font-medium">Accepting Takeaway Orders</Label>
                        <Switch id="takeaway-status" defaultChecked/>
                    </div>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="prep-time">Average Prep Time (mins)</Label>
                            <Input id="prep-time" type="number" defaultValue="15"/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="packing-charge">Packaging Charge (₹)</Label>
                            <Input id="packing-charge" type="number" defaultValue="20"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="takeaway-instructions">Instructions for Customers</Label>
                        <Input id="takeaway-instructions" placeholder="Please show your order confirmation at the counter."/>
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="contactless-pickup">Enable Contactless Pickup</Label>
                        <Switch id="contactless-pickup" />
                    </div>
                    <Button size="lg" className="w-full" onClick={() => showToast("Takeaway settings saved.")}>Save Takeaway Settings</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
