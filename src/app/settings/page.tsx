"use client"

import { useState } from "react"
import { Bell, Key, Lock, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    documentUploaded: true,
    documentClassified: true,
    documentShared: false,
    weeklyDigest: true,
  })

  const handleProfileSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    })
  }

  const handlePasswordSave = () => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    })
  }

  const handleNotificationSave = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved",
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-9"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="role" className="pl-9" value={profileData.role} readOnly />
                </div>
                <p className="text-xs text-muted-foreground">Your role determines your permissions in the system</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to maintain account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="current-password" type="password" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="new-password" type="password" className="pl-9" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="confirm-password" type="password" className="pl-9" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordSave}>
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Document Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="document-uploaded" className="flex-1">
                      Document Uploaded
                    </Label>
                    <Switch
                      id="document-uploaded"
                      checked={notificationSettings.documentUploaded}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, documentUploaded: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="document-classified" className="flex-1">
                      Document Classified
                    </Label>
                    <Switch
                      id="document-classified"
                      checked={notificationSettings.documentClassified}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, documentClassified: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="document-shared" className="flex-1">
                      Document Shared
                    </Label>
                    <Switch
                      id="document-shared"
                      checked={notificationSettings.documentShared}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, documentShared: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of document activity</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationSave}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

