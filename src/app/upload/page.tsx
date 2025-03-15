"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  FileText,
  Upload,
  X,
  Loader2,
  Save,
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/file-uploader";
import { DocumentPreview } from "@/components/document-preview";
import { extractInfoImg, saveContentDB } from "@/actions/upload";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

import { Eye } from "lucide-react";
import { toast } from "sonner";
import RenderJson from "@/components/helpers/renderJson";
import AvatarUploadPage from "@/components/vercel-upload";
import { upload } from "@vercel/blob/client";
import { PutBlobResult } from "@vercel/blob";

type FileStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  id: string;
  name: string;
  size?: number;
  type: string;
  status: FileStatus;
  preview?: string;
  file?: File;
  docUrl?: string;
  extractedData?: any;
  editedData?: any;
  metadata?: {
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
    ownerName?: string;
    documentId?: string;
  };
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);


  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: "idle" as FileStatus,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.success("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);

    // Process each file
    for (const file of files) {
      if (file.status === "success") continue;

      // Update file status to uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", file.file!);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!
        );

        const newBlob = await upload(file.name, file.file!, {
          access: 'public',
          handleUploadUrl: '/api/avatar/upload',
        });
        setBlob(newBlob)


        //Extract info from image
        const res = await extractInfoImg(formData);

        // Create metadata from extracted info
        const metadata = {
          documentType: res?.data?.airesult?.document_type || "Unknown",
          ownerName: res?.data?.airesult.name || "",
          
          documentId: `DOC-${Math.floor(Math.random() * 1000000)}`,
        };

        // Update file with metadata, extracted data and success status
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: "success",
                  docUrl: newBlob?.url,
                  metadata,
                  extractedData: res?.data?.airesult || {},
                  editedData: JSON.parse(
                    JSON.stringify(res?.data?.airesult || {})
                  ), // Deep copy for editing
                }
              : f
          )
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f))
        );
      }
    }

    setIsUploading(false);

    const successCount = files.filter(
      (file) => file.status === "success"
    ).length;
    if (successCount > 0) {
      toast.success("Successfully uploaded ${successCount} document(s)");
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
    if (expandedFileId === id) {
      setExpandedFileId(null);
    }

    // // Clean up state for this file
    // const newExpandedSections = { ...expandedSections };
    // delete newExpandedSections[id];
    // setExpandedSections(newExpandedSections);

    // const newEditableFields = { ...editableFields };
    // delete newEditableFields[id];
    // setEditableFields(newEditableFields);
  };

 

  const handleSaveAll = (id: string) => {
    startTransition(async () => {
      try {
        const fileToSave = files.find((file) => file.id === id);
        if (!fileToSave) return;
  
        // Create FormData
        const formData = new FormData();
        formData.append("filename", fileToSave.name);
        formData.append("docUrl", fileToSave.docUrl ?? "none");
        formData.append("extractedData", JSON.stringify(fileToSave.editedData)); // Convert object to string
  
        // Send FormData to the backend
        const sendToDB = await saveContentDB(formData);
  
        if (sendToDB.success) {
          toast.success("Successfully added contents to DB!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error occurred!");
      }
    });
  };
  

  const toggleExpandFile = (id: string) => {
    setExpandedFileId(expandedFileId === id ? null : id);
  };

 
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Upload Documents
          </h1>
          <p className="text-muted-foreground">
            Upload documents for classification and processing
          </p>
        </div>
      </div>

     
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop files or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onDrop={onDrop} />

            {files.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Uploaded Files</h3>
                <div className="space-y-3">
                  {files.map((file) => (
                    <Collapsible
                      key={file.id}
                      open={expandedFileId === file.id}
                      onOpenChange={() =>
                        file.status === "success" && toggleExpandFile(file.id)
                      }
                      className="w-full"
                    >
                      <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {((file.size ?? 0) / 1024).toFixed(2)} KB
                              </p>
                              {file.status === "success" &&
                                file.metadata?.documentType && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.metadata.documentType}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "uploading" && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {file.status === "success" && (
                            <>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                >
                                  {expandedFileId === file.id
                                    ? "Hide details"
                                    : "Show details"}
                                </Button>
                              </CollapsibleTrigger>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedFile(file)}
                              >
                                <Eye className="h-4 w-4 text-green-500" />
                              </Button>
                            </>
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className="rounded-b-lg border border-t-0 p-4 text-sm bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Extracted Data</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7"
                              onClick={() => {
                                // Save edited data to extracted data
                                setFiles((prev) =>
                                  prev.map((f) =>
                                    f.id === file.id
                                      ? { ...f, extractedData: f.editedData }
                                      : f
                                  )
                                );

                                toast.success("Your edits have been saved");
                              }}
                            >
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Save Changes
                            </Button>
                          </div>
                          <RenderJson fileID={file.id} Data={file.editedData} setFiles={setFiles}/>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setFiles([])}>
              Clear All
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
            <CardDescription>
              Preview and classify uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {selectedFile ? (
              <DocumentPreview file={selectedFile.file!} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="space-y-2">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="font-medium">No document selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a document from the list to preview and classify
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleSaveAll(selectedFile?.id!)}
          disabled={!files.some((file) => file.status === "success") || isPending}
        >
          {isPending ? "Saving..." : "Confirm & Save All"}
        </Button>
      </CardFooter>

        </Card>
      </div>

      {files.some((file) => file.status === "success") && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertTitle>Documents Ready</AlertTitle>
          <AlertDescription>
            {files.filter((file) => file.status === "success").length}{" "}
            document(s) have been successfully processed and are ready to be
            saved.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
