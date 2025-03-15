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
import { JSOND } from "@/components/helpers/renderJson";
import { Eye } from "lucide-react";
import { toast } from "sonner";

type FileStatus = "idle" | "uploading" | "success" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  preview?: string;
  file: File;
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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, Set<string>>
  >({});
  const [editableFields, setEditableFields] = useState<
    Record<string, Set<string>>
  >({});


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
        formData.append("file", file.file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!
        );

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
                  // docUrl: res?.data?.imginfo.docUrl,
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

    // Clean up state for this file
    const newExpandedSections = { ...expandedSections };
    delete newExpandedSections[id];
    setExpandedSections(newExpandedSections);

    const newEditableFields = { ...editableFields };
    delete newEditableFields[id];
    setEditableFields(newEditableFields);
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

  const toggleSection = (fileId: string, path: string) => {
    setExpandedSections((prev) => {
      const fileSections = prev[fileId] || new Set();
      const newFileSections = new Set(fileSections);

      if (newFileSections.has(path)) {
        newFileSections.delete(path);
      } else {
        newFileSections.add(path);
      }

      return {
        ...prev,
        [fileId]: newFileSections,
      };
    });
  };

  const toggleEditable = (fileId: string, path: string) => {
    setEditableFields((prev) => {
      const fileFields = prev[fileId] || new Set();
      const newFileFields = new Set(fileFields);

      if (newFileFields.has(path)) {
        newFileFields.delete(path);
      } else {
        newFileFields.add(path);
      }

      return {
        ...prev,
        [fileId]: newFileFields,
      };
    });
  };

  const updateFieldValue = (fileId: string, path: string, value: any) => {
    setFiles((prev) => {
      return prev.map((file) => {
        if (file.id === fileId) {
          // Create a deep copy of the edited data
          const editedData = JSON.parse(JSON.stringify(file.editedData || {}));

          // Split the path into parts
          const pathParts = path.split(".");

          // Navigate to the correct object
          let current = editedData;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];

            // Handle array indices
            if (part.includes("[") && part.includes("]")) {
              const arrayName = part.substring(0, part.indexOf("["));
              const index = Number.parseInt(
                part.substring(part.indexOf("[") + 1, part.indexOf("]"))
              );

              if (!current[arrayName]) current[arrayName] = [];
              if (!current[arrayName][index]) current[arrayName][index] = {};

              current = current[arrayName][index];
            } else {
              if (!current[part]) current[part] = {};
              current = current[part];
            }
          }

          // Set the value
          const lastPart = pathParts[pathParts.length - 1];

          // Handle array indices in the last part
          if (lastPart.includes("[") && lastPart.includes("]")) {
            const arrayName = lastPart.substring(0, lastPart.indexOf("["));
            const index = Number.parseInt(
              lastPart.substring(
                lastPart.indexOf("[") + 1,
                lastPart.indexOf("]")
              )
            );

            if (!current[arrayName]) current[arrayName] = [];
            current[arrayName][index] = value;
          } else {
            current[lastPart] = value;
          }

          return {
            ...file,
            editedData,
          };
        }
        return file;
      });
    });
  };

  // Function to render extracted data with nested objects and arrays
  const renderExtractedData = (
    fileId: string,
    data: any,
    path = "",
    level = 0
  ) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-sm text-muted-foreground">No data extracted</p>;
    }

    const fileExpandedSections = expandedSections[fileId] || new Set();
    const fileEditableFields = editableFields[fileId] || new Set();

    return (
      <div
        className="space-y-2 text-sm"
        style={{ marginLeft: level > 0 ? `${level * 12}px` : "0" }}
      >
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering if value is null or undefined
          if (value === null || value === undefined) return null;

          const currentPath = path ? `${path}.${key}` : key;

          const isExpanded = fileExpandedSections.has(currentPath);
          const isEditable = fileEditableFields.has(currentPath);

          // Handle arrays
          if (Array.isArray(value)) {
            return (
              <div key={currentPath} className="space-y-1">
                <div
                  className="flex items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => toggleSection(fileId, currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  <span className="font-medium text-muted-foreground">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    [{value.length} items]
                  </span>
                </div>

                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {value.map((item, index) => {
                      const itemPath = `${currentPath}[${index}]`;

                      if (typeof item === "object" && item !== null) {
                        return (
                          <div key={itemPath} className="mt-1">
                            <div className="font-medium text-muted-foreground mb-1">
                              Item {index + 1}:
                            </div>
                            {renderExtractedData(
                              fileId,
                              item,
                              itemPath,
                              level + 1
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={itemPath}
                          className="grid grid-cols-2 gap-2 mt-1"
                        >
                          <span className="font-medium text-muted-foreground">
                            Item {index + 1}:
                          </span>
                          <div className="flex items-center">
                            {isEditable ? (
                              <Input
                                value={String(item)}
                                onChange={(e) =>
                                  updateFieldValue(
                                    fileId,
                                    itemPath,
                                    e.target.value
                                  )
                                }
                                className="h-7 py-1"
                                onBlur={() => toggleEditable(fileId, itemPath)}
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 p-1 rounded flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEditable(fileId, itemPath);
                                }}
                              >
                                {String(item)}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEditable(fileId, itemPath);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Handle nested objects
          if (typeof value === "object" && value !== null) {
            return (
              <div key={currentPath} className="space-y-1">
                <div
                  className="flex items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => toggleSection(fileId, currentPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  <span className="font-medium text-muted-foreground">
                    {key.replace(/_/g, " ")}
                  </span>
                </div>

                {isExpanded && (
                  <div className="pl-4 border-l-2 border-muted mt-1">
                    {renderExtractedData(fileId, value, currentPath, level + 1)}
                  </div>
                )}
              </div>
            );
          }

          // Handle primitive values (strings, numbers, booleans)
          return (
            <div
              key={currentPath}
              className="grid grid-cols-2 gap-2 items-center"
            >
              <span className="font-medium text-muted-foreground">
                {key.replace(/_/g, " ")}:
              </span>
              <div className="flex items-center">
                {isEditable ? (
                  <Input
                    value={String(value)}
                    onChange={(e) =>
                      updateFieldValue(fileId, currentPath, e.target.value)
                    }
                    className="h-7 py-1"
                    onBlur={() => toggleEditable(fileId, currentPath)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:bg-muted/50 p-1 rounded flex-1"
                    onClick={() => toggleEditable(fileId, currentPath)}
                  >
                    {String(value)}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1"
                  onClick={() => toggleEditable(fileId, currentPath)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
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
                                {(file.size / 1024).toFixed(2)} KB
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
                          {renderExtractedData(file.id, file.editedData)}
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
              <DocumentPreview file={selectedFile.file} />
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
