
"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Upload, CheckCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

type DocumentStatus = "Verified";

const documents = [
  {
    name: "FSSAI License",
    status: "Verified" as DocumentStatus,
    details: "Expires on: 12/2025",
    lastUpdated: "Jan 15, 2024",
  },
  {
    name: "GST Certificate",
    status: "Verified" as DocumentStatus,
    details: "GSTIN: 29ABCDE1234F1Z5",
    lastUpdated: "Jan 15, 2024",
  },
  {
    name: "PAN Card",
    status: "Verified" as DocumentStatus,
    details: "Verification successful via NSDL",
    lastUpdated: "June 05, 2024",
  },
  {
    name: "Aadhar Card",
    status: "Verified" as DocumentStatus,
    details: "Verification successful via UIDAI",
    lastUpdated: "June 06, 2024",
  },
  {
    name: "Cancelled Cheque",
    status: "Verified" as DocumentStatus,
    details: "Bank account details verified",
    lastUpdated: "June 01, 2024",
  },
];

const statusStyles: Record<DocumentStatus, { icon: React.ElementType, badgeClass: string, textClass: string }> = {
  Verified: { icon: CheckCircle, badgeClass: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700", textClass: "text-green-700 dark:text-green-300" },
};

export default function DocumentsPage() {
    const { toast } = useToast();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState("");

    const handleUploadClick = (docName: string) => {
        setUploadingDoc(docName);
        setIsUploadOpen(true);
    }
    
    const handleConfirmUpload = () => {
        toast({
            title: `Uploading ${uploadingDoc}`,
            description: `Your document has been submitted and is now pending verification.`,
        });
        setIsUploadOpen(false);
        setUploadingDoc("");
    }

  return (
    <div className="flex flex-col gap-6">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Documents & Verification</h1>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {documents.map((doc) => {
              const { icon: Icon, badgeClass, textClass } = statusStyles[doc.status];
              return (
                <div key={doc.name} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{doc.name}</p>
                      <p className={`text-sm ${textClass}`}>{doc.details}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Last Updated: {doc.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <Badge variant="outline" className={`capitalize ${badgeClass}`}>
                        <Icon className={`mr-1.5 h-3.5 w-3.5 ${textClass}`}/>
                        {doc.status}
                    </Badge>
                     {doc.name === 'Cancelled Cheque' && (
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleUploadClick(doc.name)}>
                            <Upload className="h-4 w-4"/> Re-upload
                        </Button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

       <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload {uploadingDoc}</DialogTitle>
                    <DialogDescription>
                        Please upload a clear, valid copy of your document.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="doc-file">Document File (PDF, JPG, PNG)</Label>
                        <Input id="doc-file" type="file" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmUpload}>Submit for Verification</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
