"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { User, DollarSign, Bell, Lock } from "lucide-react"

export default function LecturerSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý hồ sơ giảng viên và tùy chọn</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="payout">
            <DollarSign className="mr-2 h-4 w-4" />
            Thanh toán
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ giảng viên</CardTitle>
              <CardDescription>Thông tin hiển thị công khai</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Tên hiển thị</Label>
                <Input id="displayName" defaultValue="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea id="bio" rows={4} placeholder="Giới thiệu về bản thân..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expertise">Chuyên môn</Label>
                <Input id="expertise" placeholder="VD: Web Development, Python, AI" />
              </div>
              <Button>Cập nhật hồ sơ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
              <CardDescription>Cấu hình tài khoản nhận tiền</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Ngân hàng</Label>
                <Input id="bankName" placeholder="Tên ngân hàng" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Số tài khoản</Label>
                <Input id="accountNumber" placeholder="Số tài khoản" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Tên tài khoản</Label>
                <Input id="accountName" placeholder="Tên chủ tài khoản" />
              </div>
              <Button>Lưu thông tin</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Tùy chọn thông báo</CardTitle>
              <CardDescription>Quản lý thông báo về khóa học và học viên</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cài đặt thông báo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Đổi mật khẩu và cài đặt bảo mật</CardDescription>
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
              <Button>Đổi mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
