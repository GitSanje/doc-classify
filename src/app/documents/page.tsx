"use client"

import { useState } from "react"
import { Download, Eye, Filter, MoreHorizontal, Search, Share } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DocumentViewer } from "@/components/document-viewer"

// Sample document data
const documents = [
  {
    id: "DOC-123456",
    name: "Passport - John Doe",
    type: "Passport",
    owner: "John Doe",
    dateUploaded: new Date("2023-05-15"),
    status: "Approved",
    preview: "/placeholder.svg",
  },
  {
    id: "DOC-789012",
    name: "Driver's License - Jane Smith",
    type: "Driver's License",
    owner: "Jane Smith",
    dateUploaded: new Date("2023-06-22"),
    status: "Pending",
    preview: "/placeholder.svg",
  },
  {
    id: "DOC-345678",
    name: "Bank Statement - Q1 2023",
    type: "Bank Statement",
    owner: "John Doe",
    dateUploaded: new Date("2023-04-10"),
    status: "Approved",
    preview: "/placeholder.svg",
  },
  {
    id: "DOC-901234",
    name: "Utility Bill - March 2023",
    type: "Utility Bill",
    owner: "Jane Smith",
    dateUploaded: new Date("2023-03-28"),
    status: "Approved",
    preview: "/placeholder.svg",
  },
  {
    id: "DOC-567890",
    name: "ID Card - Michael Johnson",
    type: "ID Card",
    owner: "Michael Johnson",
    dateUploaded: new Date("2023-07-05"),
    status: "Pending",
    preview: "/placeholder.svg",
  },
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<(typeof documents)[0] | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase()
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query) ||
      doc.owner.toLowerCase().includes(query) ||
      doc.id.toLowerCase().includes(query)
    )
  })

  const handleViewDocument = (document: (typeof documents)[0]) => {
    setSelectedDocument(document)
    setIsViewerOpen(true)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground">View, search, and manage all your documents</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Document Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">All Types</option>
                  <option value="Passport">Passport</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Bank Statement">Bank Statement</option>
                  <option value="Utility Bill">Utility Bill</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder="From" className="text-sm" />
                  <Input type="date" placeholder="To" className="text-sm" />
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>

        <div className="md:w-3/4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>{document.owner}</TableCell>
                      <TableCell>{format(document.dateUploaded, "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            document.status === "Approved"
                              ? "secondary"
                              : document.status === "Pending"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>Document ID: {selectedDocument?.id}</DialogDescription>
          </DialogHeader>
          {selectedDocument && <DocumentViewer document={selectedDocument} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

