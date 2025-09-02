
"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialOperatingHours = [
    { day: "Monday", opening: "11:00", closing: "23:00", open: true },
    { day: "Tuesday", opening: "11:00", closing: "23:00", open: true },
    { day: "Wednesday", opening: "11:00", closing: "23:00", open: true },
    { day: "Thursday", opening: "11:00", closing: "23:00", open: true },
    { day: "Friday", opening: "11:00", closing: "23:30", open: true },
    { day: "Saturday", opening: "11:00", closing: "23:30", open: true },
    { day: "Sunday", opening: "11:00", closing: "23:00", open: false },
];

export default function OperatingHoursPage() {
    const { toast } = useToast();
    const [operatingHours, setOperatingHours] = useState(initialOperatingHours);

    const handleHoursChange = (index: number, field: 'opening' | 'closing', value: string) => {
        const newHours = [...operatingHours];
        newHours[index][field] = value;
        setOperatingHours(newHours);
    };
    
    const handleOpenChange = (index: number, open: boolean) => {
        const newHours = [...operatingHours];
        newHours[index].open = open;
        setOperatingHours(newHours);
    };

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your operating hours have been updated successfully.",
        });
    }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Operating Hours</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Weekly Schedule</CardTitle>
                <CardDescription>Set your restaurant's opening and closing times for each day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                 <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-x-4 px-2 text-sm font-medium text-muted-foreground">
                    <span>Day</span>
                    <span>Opening Time</span>
                    <span>Closing Time</span>
                 </div>
                 {operatingHours.map((item, index) => (
                    <div key={item.day} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-2 p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                            <Label className="font-semibold text-base col-span-1">{item.day}</Label>
                            <Switch
                                id={`open-${item.day}`}
                                checked={item.open}
                                onCheckedChange={(checked) => handleOpenChange(index, checked)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`opening-${item.day}`} className="text-xs text-muted-foreground sm:hidden">Opening</Label>
                            <Input
                                id={`opening-${item.day}`}
                                type="time"
                                className="w-full sm:w-32"
                                value={item.opening}
                                onChange={(e) => handleHoursChange(index, 'opening', e.target.value)}
                                disabled={!item.open}
                            />
                        </div>
                        <div className="space-y-1">
                             <Label htmlFor={`closing-${item.day}`} className="text-xs text-muted-foreground sm:hidden">Closing</Label>
                            <Input
                                id={`closing-${item.day}`}
                                type="time"
                                className="w-full sm:w-32"
                                value={item.closing}
                                onChange={(e) => handleHoursChange(index, 'closing', e.target.value)}
                                disabled={!item.open}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

