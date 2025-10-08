"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Settings, Database, Mail, Shield } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cấu hình nền tảng</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Chung
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Cơ sở dữ liệu
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Cấu hình cơ bản của nền tảng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Tên website</Label>
                <Input id="siteName" defaultValue="IT Learning Platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL</Label>
                <Input id="siteUrl" defaultValue="https://itlearning.vn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email hỗ trợ</Label>
                <Input id="supportEmail" type="email" defaultValue="support@itlearning.vn" />
              </div>
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Cơ sở dữ liệu</CardTitle>
              <CardDescription>Quản lý và sao lưu dữ liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Sao lưu dữ liệu</Button>
              <Button variant="outline">Khôi phục từ bản sao lưu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Email</CardTitle>
              <CardDescription>Thiết lập SMTP và email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cấu hình email server...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Cài đặt bảo mật hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cài đặt bảo mật...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
