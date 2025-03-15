"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Download, Eye, Filter, MoreHorizontal, SearchIcon } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Sample document data
const documents = [
  {
    id: "DOC-123456",
    name: "Passport - John Doe",
    type: "Passport",
    owner: "John Doe",
    dateUploaded: new Date("2023-05-15"),
    status: "Approved",
  },
  {
    id: "DOC-789012",
    name: "Driver's License - Jane Smith",
    type: "Driver's License",
    owner: "Jane Smith",
    dateUploaded: new Date("2023-06-22"),
    status: "Pending",
  },
  {
    id: "DOC-345678",
    name: "Bank Statement - Q1 2023",
    type: "Bank Statement",
    owner: "John Doe",
    dateUploaded: new Date("2023-04-10"),
    status: "Approved",
  },
  {
    id: "DOC-901234",
    name: "Utility Bill - March 2023",
    type: "Utility Bill",
    owner: "Jane Smith",
    dateUploaded: new Date("2023-03-28"),
    status: "Approved",
  },
  {
    id: "DOC-567890",
    name: "ID Card - Michael Johnson",
    type: "ID Card",
    owner: "Michael Johnson",
    dateUploaded: new Date("2023-07-05"),
    status: "Pending",
  },
  {
    id: "DOC-234567",
    name: "Passport - Sarah Williams",
    type: "Passport",
    owner: "Sarah Williams",
    dateUploaded: new Date("2023-02-18"),
    status: "Approved",
  },
  {
    id: "DOC-890123",
    name: "Bank Statement - Q2 2023",
    type: "Bank Statement",
    owner: "Michael Johnson",
    dateUploaded: new Date("2023-07-02"),
    status: "Pending",
  },
  {
    id: "DOC-456789",
    name: "Utility Bill - June 2023",
    type: "Utility Bill",
    owner: "Sarah Williams",
    dateUploaded: new Date("2023-06-30"),
    status: "Approved",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const documentTypes = Array.from(new Set(documents.map((doc) => doc.type)))
  const documentStatuses = Array.from(new Set(documents.map((doc) => doc.status)))

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(doc.status)

    return matchesSearch && matchesType && matchesStatus
  })

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Search Documents</h1>
          <p className="text-muted-foreground">Find and filter documents by various criteria</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Document Type</h3>
                <div className="space-y-2">
                  {documentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeChange(type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-sm">Status</h3>
                <div className="space-y-2">
                  {documentStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => handleStatusChange(status)}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-sm">Date Range</h3>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="date-from" className="text-xs">
                      From
                    </Label>
                    <Input id="date-from" type="date" className="text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="date-to" className="text-xs">
                      To
                    </Label>
                    <Input id="date-to" type="date" className="text-sm" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, owner, or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
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
                        <TableCell className="font-medium">
                          <div>{document.name}</div>
                          <div className="text-xs text-muted-foreground">{document.id}</div>
                        </TableCell>
                        <TableCell>{document.type}</TableCell>
                        <TableCell>{document.owner}</TableCell>
                        <TableCell>{format(document.dateUploaded, "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              document.status === "Approved"
                                ? "success"
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredDocuments.length}</span> of{" "}
              <span className="font-medium">{documents.length}</span> documents
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

