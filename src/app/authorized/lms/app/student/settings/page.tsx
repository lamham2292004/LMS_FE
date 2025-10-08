"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Switch } from "@lms/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Bell, Lock, User, CreditCard } from "lucide-react"

export default function StudentSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và tùy chọn của bạn</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Tài khoản
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="student@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ</Label>
                <select id="language" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chọn thông báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo email</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo đẩy</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <Button>Lưu tùy chọn</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Đổi mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
              <CardDescription>Xem các giao dịch và hóa đơn của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
