"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Download, FileText, Filter, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AuditChart } from "@/components/audit-chart"

// Sample audit log data
const auditLogs = [
  {
    id: "LOG-123456",
    action: "Document Viewed",
    documentId: "DOC-123456",
    documentName: "Passport - John Doe",
    user: "jane.smith@example.com",
    timestamp: new Date("2023-07-15T10:30:00"),
    ipAddress: "192.168.1.1",
  },
  {
    id: "LOG-123457",
    action: "Document Classified",
    documentId: "DOC-789012",
    documentName: "Driver's License - Jane Smith",
    user: "john.doe@example.com",
    timestamp: new Date("2023-07-15T11:45:00"),
    ipAddress: "192.168.1.2",
  },
  {
    id: "LOG-123458",
    action: "Document Downloaded",
    documentId: "DOC-345678",
    documentName: "Bank Statement - Q1 2023",
    user: "admin@example.com",
    timestamp: new Date("2023-07-14T14:20:00"),
    ipAddress: "192.168.1.3",
  },
  {
    id: "LOG-123459",
    action: "Document Uploaded",
    documentId: "DOC-901234",
    documentName: "Utility Bill - March 2023",
    user: "jane.smith@example.com",
    timestamp: new Date("2023-07-14T09:15:00"),
    ipAddress: "192.168.1.1",
  },
  {
    id: "LOG-123460",
    action: "Document Shared",
    documentId: "DOC-567890",
    documentName: "ID Card - Michael Johnson",
    user: "john.doe@example.com",
    timestamp: new Date("2023-07-13T16:30:00"),
    ipAddress: "192.168.1.2",
  },
]

// Sample statistics data
const statistics = {
  totalDocuments: 250,
  classifiedDocuments: 210,
  pendingDocuments: 35,
  rejectedDocuments: 5,
  usersActive: 12,
  documentsToday: 15,
}

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = auditLogs.filter((log) => {
    const query = searchQuery.toLowerCase()
    return (
      log.action.toLowerCase().includes(query) ||
      log.documentId.toLowerCase().includes(query) ||
      log.documentName.toLowerCase().includes(query) ||
      log.user.toLowerCase().includes(query)
    )
  })

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit & Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and document processing</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">{statistics.documentsToday} new today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classified</CardTitle>
            <Badge variant="outline" className="ml-2">
              {Math.round((statistics.classifiedDocuments / statistics.totalDocuments) * 100)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.classifiedDocuments}</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${(statistics.classifiedDocuments / statistics.totalDocuments) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((statistics.pendingDocuments / statistics.totalDocuments) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.usersActive}</div>
            <p className="text-xs text-muted-foreground">Users with activity today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge
                          variant={
                            log.action.includes("Uploaded") || log.action.includes("Classified")
                              ? "destructive"
                              : log.action.includes("Viewed")
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.documentName}</div>
                        <div className="text-xs text-muted-foreground">{log.documentId}</div>
                      </TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{format(log.timestamp, "MMM d, yyyy h:mm a")}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="charts" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Classification</CardTitle>
                <CardDescription>Classification status over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <AuditChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Top users by document interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["jane.smith@example.com", "john.doe@example.com", "admin@example.com"].map((user, index) => (
                    <div key={user} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{user}</div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${100 - index * 20}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-2 text-sm font-medium">{30 - index * 5} docs</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

