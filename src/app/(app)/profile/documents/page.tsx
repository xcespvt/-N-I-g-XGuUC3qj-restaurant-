
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
import Link from "next/link"
import { useAppStore } from "@/context/useAppStore"
import { usePut, useGet } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export type DocumentStatus = "Verified" | "Pending Verification";

const statusStyles: Record<DocumentStatus, { icon: React.ElementType, badgeClass: string, textClass: string }> = {
  "Verified": { icon: CheckCircle, badgeClass: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700", textClass: "text-green-700 dark:text-green-300" },
  "Pending Verification": { icon: Upload, badgeClass: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700", textClass: "text-yellow-700 dark:text-yellow-300" },
};

export default function DocumentsPage() {
  const { selectedBranch } = useAppStore();
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState("");

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const [documents, setDocuments] = useState<any[]>([]);

  // Update documents when data is loaded
  useEffect(() => {
    if (profileResponse?.data?.documents && profileResponse.data.documents.length > 0) {
      setDocuments(profileResponse.data.documents);
    }
  }, [profileResponse]);


  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  const handleUploadClick = (docName: string) => {
    setUploadingDoc(docName);
    setIsUploadOpen(true);
  }

  const handleConfirmUpload = () => {
    // Here we fake the document upload by hitting the profile update API endpoint
    updateProfile(
      {
        documents: documents.map((doc: any) =>
          doc.name === uploadingDoc ? { ...doc, status: "Pending Verification", lastUpdated: "Just now" } : doc
        )
      },
      {
        onSuccess: () => {
          toast({
            title: `Uploading ${uploadingDoc}`,
            description: `Your document has been submitted and is now pending verification.`,
          });
          setIsUploadOpen(false);
          setUploadingDoc("");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to upload document",
            variant: "destructive",
          });
        }
      }
    );
  }

  if (isLoading && documents.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Documents & Verification</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {documents.map((doc: any) => {
              const { icon: Icon, badgeClass, textClass } = statusStyles[doc.status as DocumentStatus] || statusStyles["Pending Verification"];
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
                      <Icon className={`mr-1.5 h-3.5 w-3.5 ${textClass}`} />
                      {doc.status}
                    </Badge>
                    {doc.name === 'Cancelled Cheque' && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => handleUploadClick(doc.name)}>
                        <Upload className="h-4 w-4" /> Re-upload
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {!isLoading && documents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No documents found.</p>
            )}
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
            <Button variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isPending}>Cancel</Button>
            <Button onClick={handleConfirmUpload} disabled={isPending}>
              {isPending ? "Uploading..." : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
