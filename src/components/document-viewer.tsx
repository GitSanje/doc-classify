"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Download, Edit, Save, Share } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { UploadedFile } from "@/app/upload/page"
import RenderJson from "./helpers/renderJson"
import { metadata } from "@/app/layout"
import { DocumentPreview } from "./document-preview"

interface DocumentViewerProps {
  document: {
    id: string
    name: string
    type: string
    owner: string
    dateUploaded: Date
    status: string
    preview: string
  }
}

export function DocumentViewer({ document }: any) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [documentData, setDocumentData] = useState({
    type: document.type,
    owner: document.metadata.name,
    // status: document.status,
  })
  
  const [files, setFiles] = useState<UploadedFile[]>(() => [
    {
      id: document.id,
      name: document.filename,
      type: document.type,
      status: "success",
      extractedData: document.metadata,
      editedData: document.metadata,
      metadata: {
        documentType: document.type,
      },
    },
  ]);
  


  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Document updated",
      description: "Document classification has been updated",
    })
  }



  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-end">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="document">Original Document</TabsTrigger>
          <TabsTrigger value="extracted">Extracted Text</TabsTrigger>
        </TabsList>
        <TabsContent value="document" className="mt-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
            {/* <Image
              src={"/"+document.filename || "/placeholder.svg"}
              alt={document.name}
              width={800}
              height={600}
              className="h-full w-full object-contain"
            /> */}
            <DocumentPreview url={document.docUrl} />
          </div>
        </TabsContent>
        <TabsContent value="extracted" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Extracted Text</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono">{}</pre>
              
              */}
              <RenderJson fileID={document.id} Data={document.metadata} setFiles={setFiles}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Document Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="documentType">Document Type</Label>
              {isEditing ? (
                <Select
                  value={documentData.type}
                  onValueChange={(value) => setDocumentData({ ...documentData, type: value })}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="ID Card">ID Card</SelectItem>
                    <SelectItem value="Driver's License">Driver's License</SelectItem>
                    <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                    <SelectItem value="Utility Bill">Utility Bill</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="rounded-md border px-3 py-2 text-sm">{documentData.type}</div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentOwner">Document Owner</Label>
              {isEditing ? (
                <Input
                  id="documentOwner"
                  value={documentData.owner}
                  onChange={(e) => setDocumentData({ ...documentData, owner: e.target.value })}
                />
              ) : (
                <div className="rounded-md border px-3 py-2 text-sm">{documentData.owner}</div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentId">Document ID</Label>
              <div className="rounded-md border px-3 py-2 text-sm">{document.id}</div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentStatus">Status</Label>
              {isEditing ? (
                // <Select
                //   value={documentData.status}
                //   onValueChange={(value) => setDocumentData({ ...documentData, status: value })}
                // >
                //   <SelectTrigger id="documentStatus">
                //     <SelectValue placeholder="Select status" />
                //   </SelectTrigger>
                //   <SelectContent>
                //     <SelectItem value="Approved">Approved</SelectItem>
                //     <SelectItem value="Pending">Pending</SelectItem>
                //     <SelectItem value="Rejected">Rejected</SelectItem>
                //   </SelectContent>
                // </Select>
                ''
              ) : (
                // <div className="rounded-md border px-3 py-2 text-sm">
                //   <Badge
                //     variant={
                //       documentData.status === "Approved"
                //         ? "secondary"
                //         : documentData.status === "Pending"
                //           ? "outline"
                //           : "destructive"
                //     }
                //   >
                //     {documentData.status}
                //   </Badge>
                // </div>
                ''
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isEditing && (
            <Button className="w-full" onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save Classification
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

