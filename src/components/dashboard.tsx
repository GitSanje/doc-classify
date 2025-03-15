"use client"
import Link from "next/link"
import { BarChart, Calendar, Clock, FileText, FolderOpen, MoreHorizontal, Upload } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuditChart } from "@/components/audit-chart"

// Sample recent documents
const recentDocuments = [
  {
    id: "DOC-123456",
    name: "Passport - John Doe",
    type: "Passport",
    dateUploaded: new Date("2023-07-15"),
    status: "Approved",
  },
  {
    id: "DOC-789012",
    name: "Driver's License - Jane Smith",
    type: "Driver's License",
    dateUploaded: new Date("2023-07-14"),
    status: "Pending",
  },
  {
    id: "DOC-345678",
    name: "Bank Statement - Q1 2023",
    type: "Bank Statement",
    dateUploaded: new Date("2023-07-13"),
    status: "Approved",
  },
  {
    id: "DOC-901234",
    name: "Utility Bill - March 2023",
    type: "Utility Bill",
    dateUploaded: new Date("2023-07-12"),
    status: "Approved",
  },
]

// Sample recent activity
const recentActivity = [
  {
    id: "ACT-123456",
    action: "Document Uploaded",
    documentName: "Passport - John Doe",
    timestamp: new Date("2023-07-15T10:30:00"),
    user: "jane.smith@example.com",
  },
  {
    id: "ACT-789012",
    action: "Document Classified",
    documentName: "Driver's License - Jane Smith",
    timestamp: new Date("2023-07-14T11:45:00"),
    user: "john.doe@example.com",
  },
  {
    id: "ACT-345678",
    action: "Document Downloaded",
    documentName: "Bank Statement - Q1 2023",
    timestamp: new Date("2023-07-13T14:20:00"),
    user: "admin@example.com",
  },
]

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John Doe</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-muted-foreground">+15 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Classification</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">14% of total documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classification Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: "84%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Recently uploaded and processed documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.name}</TableCell>
                    <TableCell>{document.type}</TableCell>
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
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/documents">
                <FolderOpen className="mr-2 h-4 w-4" />
                View All Documents
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    {activity.action.includes("Uploaded") ? (
                      <Upload className="h-4 w-4 text-primary" />
                    ) : activity.action.includes("Classified") ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <FolderOpen className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.documentName}</p>
                    <div className="flex items-center pt-1">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(activity.timestamp, "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/audit">
                <BarChart className="mr-2 h-4 w-4" />
                View All Activity
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Classification Trends</CardTitle>
          <CardDescription>Classification status over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditChart />
        </CardContent>
      </Card>
    </div>
  )
}

