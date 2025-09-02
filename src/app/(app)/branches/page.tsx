
"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Info, MapPin, User, Clock, Package, Pencil, Trash2, Plus, GitFork, Phone, ArrowLeft, Mail, Building, UtensilsCrossed, PiggyBank, FileText, Check, ChevronRight, Upload, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Branch } from "@/context/AppContext"
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

type BranchStatusFilter = "All Branches" | "Active" | "Inactive"

const STEPS = [
    { title: "Restaurant Details", icon: Building },
    { title: "Service & Facility Info", icon: UtensilsCrossed },
    { title: "Bank Information", icon: PiggyBank },
    { title: "Menu Setup", icon: FileText },
    { title: "Final Submission", icon: Check },
];

const initialBranchFormData = {
    // Step 1
    restaurantName: "",
    ownershipType: "",
    restaurantType: "",
    legalStatus: "",
    legalName: "",
    address1: "",
    restaurantPhone: "",
    restaurantEmail: "",
    fssai: "",
    gst: "",
    cin: "",
    // Step 2
    offerings: [] as string[],
    cuisines: "",
    openingHours: [
        { day: "Monday", opening: "11:00", closing: "23:00", open: true },
        { day: "Tuesday", opening: "11:00", closing: "23:00", open: true },
        { day: "Wednesday", opening: "11:00", closing: "23:00", open: true },
        { day: "Thursday", opening: "11:00", closing: "23:00", open: true },
        { day: "Friday", opening: "11:00", closing: "23:00", open: true },
        { day: "Saturday", opening: "11:00", closing: "23:00", open: true },
        { day: "Sunday", opening: "11:00", closing: "23:00", open: true },
    ],
    facilities: [] as string[],
    // Step 3
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    reAccountNumber: "",
    ifsc: "",
    // Step 4
    copyFromBranch: "",
    status: "Active" as "Active" | "Inactive",
    manager: "",
    managerPhone: "",
    managerEmail: "",
};


export default function BranchesPage() {
  const { branches, addBranch, updateBranch, deleteBranch, toggleBranchOnlineStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<BranchStatusFilter>("All Branches")
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState(initialBranchFormData);
  
  const { toast } = useToast();

  const filteredBranches = branches.filter(branch => {
    if (activeTab === "All Branches") return true
    if (activeTab === "Active") return branch.status === "Active"
    if (activeTab === "Inactive") return branch.status === "Inactive"
  })
  
   const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOpeningHoursChange = (index: number, field: 'opening' | 'closing' | 'open', value: string | boolean) => {
        const newOpeningHours = [...formData.openingHours];
        (newOpeningHours[index] as any)[field] = value;
        handleInputChange('openingHours', newOpeningHours);
    };

    const handleCheckboxChange = (field: 'offerings' | 'facilities', value: string, checked: boolean) => {
        setFormData(prev => {
            const currentValues = prev[field] as string[];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            return { ...prev, [field]: newValues };
        });
    }

  const resetForm = () => {
    setFormData(initialBranchFormData);
    setFormStep(1);
  }

  useEffect(() => {
    if (dialogOpen && !editingBranch) {
        resetForm();
    }
  }, [dialogOpen, editingBranch]);


  const handleSaveBranch = () => {
    if (!formData.restaurantName || !formData.address1 || !formData.manager) {
       toast({
            title: "Missing Information",
            description: "Please fill in all the required branch details.",
            variant: "destructive",
        });
        return;
    }
    
    const branchData = {
        name: formData.restaurantName,
        address: formData.address1,
        city: "Bangalore",
        pincode: "560034",
        manager: formData.manager,
        managerPhone: formData.managerPhone,
        hours: `${formData.openingHours[0].opening} - ${formData.openingHours[0].closing}`,
        gst: formData.gst,
        fssai: formData.fssai,
        status: formData.status,
    };

    if (editingBranch) {
       // updateBranch logic would go here
    } else {
        addBranch(branchData as any);
    }

    setFormStep(STEPS.length); // Go to final step
  };

  const handleNextStep = () => setFormStep(s => Math.min(s + 1, STEPS.length));
  const handlePrevStep = () => setFormStep(s => Math.max(s - 1, 1));

  const legalNameConfig = useMemo(() => {
    switch (formData.legalStatus) {
        case 'pvt-ltd':
            return { label: 'Legal Name', placeholder: 'e.g., XCES Pvt Ltd' };
        case 'sole-prop':
            return { label: 'Name as on GST Certificate', placeholder: 'Enter name' };
        case 'not-registered':
            return { label: 'Owner Name', placeholder: 'Enter owner full name' };
        default:
            return null;
    }
  }, [formData.legalStatus]);

  
  const renderStepContent = () => {
    switch (formStep) {
        case 1:
            return (
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant-name">Branch Name</Label>
                            <Input id="restaurant-name" placeholder="e.g., Spice Garden - Koramangala" value={formData.restaurantName} onChange={e => handleInputChange('restaurantName', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Branch Logo</Label>
                             <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground font-normal"><Upload className="mr-2 h-4 w-4" /> Choose File</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address-1">Address</Label>
                         <Input id="address-1" placeholder="Shop/Building No, Floor/Tower, Area/Locality" value={formData.address1} onChange={e => handleInputChange('address1', e.target.value)} required />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="contact-phone">Branch Phone</Label>
                            <Input id="contact-phone" type="tel" placeholder="Contact number" value={formData.restaurantPhone} onChange={e => handleInputChange('restaurantPhone', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-email">Branch Email</Label>
                            <Input id="contact-email" type="email" placeholder="Contact email" value={formData.restaurantEmail} onChange={e => handleInputChange('restaurantEmail', e.target.value)} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ownership Type</Label>
                            <Select value={formData.ownershipType} onValueChange={v => handleInputChange('ownershipType', v)}>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="franchise">Franchise</SelectItem>
                                    <SelectItem value="self-owned">Self-Owned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Restaurant Type</Label>
                            <Select value={formData.restaurantType} onValueChange={v => handleInputChange('restaurantType', v)}>
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                    <SelectItem value="cafe">Cafe</SelectItem>
                                    <SelectItem value="sweet-shop">Sweet Shop</SelectItem>
                                    <SelectItem value="bakery">Bakery</SelectItem>
                                    <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Legal Status</Label>
                        <Select value={formData.legalStatus} onValueChange={v => handleInputChange('legalStatus', v)}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pvt-ltd">Pvt Ltd</SelectItem>
                                <SelectItem value="sole-prop">Sole Proprietor</SelectItem>
                                <SelectItem value="not-registered">Not Registered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {legalNameConfig && (
                        <div className="space-y-2">
                            <Label htmlFor="legal-name">{legalNameConfig.label}</Label>
                            <Input id="legal-name" placeholder={legalNameConfig.placeholder} value={formData.legalName} onChange={e => handleInputChange('legalName', e.target.value)} required />
                        </div>
                    )}
                 </div>
            )
        case 2:
            return (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <Label className="text-base font-semibold">What does this branch offer?</Label>
                            <div className="space-y-2 mt-3">
                                {["Dine-in", "Takeaway", "Delivery"].map(offer => (
                                    <div key={offer} className="flex items-center space-x-2">
                                        <Checkbox id={`offer-${offer.toLowerCase()}`} checked={formData.offerings.includes(offer)} onCheckedChange={(checked) => handleCheckboxChange('offerings', offer, !!checked)} />
                                        <Label htmlFor={`offer-${offer.toLowerCase()}`} className="font-normal">{offer}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-base font-semibold">Facilities</Label>
                            <div className="grid grid-cols-2 gap-y-2 mt-3">
                                {["Washroom", "AC", "Parking", "Women Safety", "LGBTQ+ Friendly", "Family Friendly", "Wheelchair Access", "Drive-through"].map(facility => (
                                     <div key={facility} className="flex items-center space-x-2">
                                        <Checkbox id={`facility-${facility.toLowerCase().replace(/\s/g, '-')}`} checked={formData.facilities.includes(facility)} onCheckedChange={(checked) => handleCheckboxChange('facilities', facility, !!checked)} />
                                        <Label htmlFor={`facility-${facility.toLowerCase().replace(/\s/g, '-')}`} className="font-normal text-sm">{facility}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-semibold" htmlFor="cuisines">Cuisines (Max 4)</Label>
                        <Input id="cuisines" placeholder="e.g. North Indian, Chinese, Italian" value={formData.cuisines} onChange={e => handleInputChange('cuisines', e.target.value)} required />
                    </div>
                    <div>
                        <Label className="text-base font-semibold">Opening/Closing Timings</Label>
                        <div className="grid grid-cols-1 gap-y-2 mt-3">
                            <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 px-2 text-sm text-muted-foreground">
                                <span className="sr-only">Open/Closed</span>
                                <span className="sr-only">Day</span>
                                <Label>Opening Time</Label>
                                <Label>Closing Time</Label>
                            </div>
                            {formData.openingHours.map((item, index) => (
                                <div key={item.day} className="grid grid-cols-2 sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 gap-y-2 p-2 rounded-lg hover:bg-muted">
                                    <Switch id={`open-${item.day}`} checked={item.open} onCheckedChange={(v) => handleOpeningHoursChange(index, 'open', v)} />
                                    <Label htmlFor={`open-${item.day}`} className="font-medium col-span-2 sm:col-span-1">{item.day}</Label>
                                    <div>
                                        <Label htmlFor={`opening-time-${index}`} className="sm:hidden text-xs text-muted-foreground">Opening</Label>
                                        <Input id={`opening-time-${index}`} type="time" className="w-full sm:w-32" value={item.opening} onChange={(e) => handleOpeningHoursChange(index, 'opening', e.target.value)} disabled={!item.open} />
                                    </div>
                                    <div>
                                        <Label htmlFor={`closing-time-${index}`} className="sm:hidden text-xs text-muted-foreground">Closing</Label>
                                        <Input id={`closing-time-${index}`} type="time" className="w-full sm:w-32" value={item.closing} onChange={(e) => handleOpeningHoursChange(index, 'closing', e.target.value)} disabled={!item.open} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        case 3:
             return (
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input id="bank-name" placeholder="Enter bank name" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="account-holder">Account Holder Name</Label>
                        <Input id="account-holder" placeholder="As per bank records" value={formData.accountHolder} onChange={e => handleInputChange('accountHolder', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" placeholder="Enter account number" value={formData.accountNumber} onChange={e => handleInputChange('accountNumber', e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="re-account-number">Re-enter Account Number</Label>
                        <Input id="re-account-number" placeholder="Confirm account number" value={formData.reAccountNumber} onChange={e => handleInputChange('reAccountNumber', e.target.value)} required />
                        {formData.accountNumber && formData.reAccountNumber && formData.accountNumber !== formData.reAccountNumber && (
                            <p className="text-sm text-destructive">Account numbers do not match.</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code</Label>
                        <Input id="ifsc" placeholder="Enter IFSC code" value={formData.ifsc} onChange={e => handleInputChange('ifsc', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID (Optional)</Label>
                        <Input id="upi-id" placeholder="yourname@bank" />
                    </div>
                </div>
            )
        case 4:
            return (
                 <div className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="copy-menu">Copy Menu From</Label>
                        <Select value={formData.copyFromBranch} onValueChange={v => handleInputChange('copyFromBranch', v)}>
                            <SelectTrigger id="copy-menu">
                                <SelectValue placeholder="Select a branch or start fresh" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fresh">Start with a fresh menu</SelectItem>
                                {branches.filter(b => b.id !== editingBranch?.id).map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground">This will copy all menu items, categories, and pricing from the selected branch.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="manager-name">Branch Manager Name</Label>
                        <Input id="manager-name" value={formData.manager} onChange={(e) => handleInputChange('manager', e.target.value)} placeholder="Enter manager name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manager-phone">Manager Phone</Label>
                            <Input id="manager-phone" type="tel" value={formData.managerPhone} onChange={(e) => handleInputChange('managerPhone', e.target.value)} placeholder="Enter phone number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manager-email">Manager Email</Label>
                            <Input id="manager-email" type="email" value={formData.managerEmail} onChange={(e) => handleInputChange('managerEmail', e.target.value)} placeholder="Enter email address" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gst-number">GST Number (Optional)</Label>
                            <Input id="gst-number" value={formData.gst} onChange={(e) => handleInputChange('gst', e.target.value)} placeholder="Enter GST number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fssai-license">FSSAI License (Optional)</Label>
                            <Input id="fssai-license" value={formData.fssai} onChange={(e) => handleInputChange('fssai', e.target.value)} placeholder="Enter FSSAI license" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="branch-status">Branch Status</Label>
                        <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => handleInputChange('status', value)}>
                            <SelectTrigger id="branch-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
            )
        case 5:
            return (
                 <div className="space-y-6 text-center flex flex-col items-center justify-center h-full">
                     <div className="p-6 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
                     </div>
                     <h2 className="text-2xl font-bold">Branch Added Successfully!</h2>
                     <p className="text-muted-foreground max-w-md">
                        The new branch "{formData.restaurantName}" is now set up. You can manage its menu, staff, and operations from the dashboard.
                     </p>
                </div>
            )
        default:
            return null;
    }
  }

  const { title, icon: Icon } = STEPS[formStep - 1];
  
  const handleEditClick = (branch: Branch) => {
    setEditingBranch(branch);
    // This part would pre-fill the form, but since we're focusing on 'Add Branch', it's omitted for now.
    toast({ title: "Editing is not fully implemented in this prototype." });
    // setDialogOpen(true); 
  };

  const handleDeleteClick = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (branchToDelete) {
        deleteBranch(branchToDelete.id);
        setIsDeleteAlertOpen(false);
        setBranchToDelete(null);
    }
  };


  return (
    <ProFeatureWrapper
        featureName="Multi-Branch Management"
        featureDescription="manage all your restaurant locations from a single dashboard, track performance, and streamline operations."
    >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2"><GitFork className="h-6 w-6"/> My Branches</h1>
            <Dialog open={dialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) setEditingBranch(null); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Branch
                </Button>
              </DialogTrigger>
               <DialogContent className="sm:max-w-3xl p-0 flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 pb-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <div className="flex justify-start">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handlePrevStep}
                                className={cn("flex-shrink-0", formStep <= 1 || formStep === STEPS.length ? "invisible" : "visible")}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                                <Icon className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-xl mt-2">{editingBranch ? 'Edit Branch' : title}</DialogTitle>
                            <DialogDescription>
                                Step {formStep} of {STEPS.length - 1}
                            </DialogDescription>
                        </div>
                        <div className="flex justify-end">
                            {/* Placeholder for alignment */}
                        </div>
                    </div>
                    <Progress value={(formStep / (STEPS.length - 1)) * 100} className="w-full mt-4" />
                </DialogHeader>
                <div className="flex-grow overflow-y-auto px-6 py-4">
                   {renderStepContent()}
                </div>
                <DialogFooter className="p-6 bg-muted/50 border-t flex justify-center mt-auto">
                    {formStep < STEPS.length - 1 ? (
                        <Button type="button" onClick={handleNextStep}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : formStep === STEPS.length - 1 ? (
                        <Button type="button" onClick={handleSaveBranch}>
                            Add Branch & Finish
                        </Button>
                    ) : (
                        <DialogClose asChild>
                           <Button>Done</Button>
                        </DialogClose>
                    )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Pro Feature</AlertTitle>
            <AlertDescription className="text-primary/80">
              Multi-branch management is available with your Crevings Pro Partner subscription.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BranchStatusFilter)}>
            <div className="sm:hidden mb-4">
              <Select value={activeTab} onValueChange={(value) => setActiveTab(value as BranchStatusFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Branches">All Branches</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden sm:grid bg-muted p-1 rounded-lg w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="All Branches">All Branches</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredBranches.map((branch) => (
                  <Card key={branch.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                        <Badge variant="outline"
                          className={cn(
                            'capitalize',
                            branch.status === 'Active'
                              ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
                              : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                          )}
                        >
                          {branch.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{branch.address}, {branch.city}, {branch.pincode}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Manager</span>
                        </div>
                        <span className="font-medium">{branch.manager}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>Contact</span>
                        </div>
                        <span className="font-medium">{branch.managerPhone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Hours</span>
                        </div>
                        <span className="font-medium">{branch.hours}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>Orders Today</span>
                        </div>
                        <span className="font-medium">{branch.ordersToday}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Online</span>
                        <Switch 
                            checked={branch.isOnline} 
                            onCheckedChange={() => toggleBranchOnlineStatus(branch.id)}
                            disabled={branch.status === 'Inactive'}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(branch)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteClick(branch)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                {filteredBranches.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground col-span-full">
                        <p>No {activeTab === 'All Branches' ? '' : activeTab.toLowerCase()} branches to show.</p>
                    </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the branch
                        "{branchToDelete?.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </ProFeatureWrapper>
  )
}
