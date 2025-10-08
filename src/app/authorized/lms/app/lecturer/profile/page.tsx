"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lms/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@lms/components/ui/alert-dialog"
import { Camera, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@lms/components/ui/tooltip"
import { useAuth } from "@/features/auth"
export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    countryCode: "+84",
    country: "Vietnam",
    province: "",
    occupation: "Giáo viên",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        email: user.email || "",
        dateOfBirth: user.birth_date || "",
        phone: user.phone || "",
        countryCode: "+84",
        country: "Vietnam",
        province: user.address || "",
        occupation: "Giáo viên",
      })
    }
  }, [user])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/friendly-robot-mascot-studying-dUauSDW2Hc3LDjrkR94kEcqWaKe5Ak.jpg"
          alt="Mascot"
          className="absolute bottom-0 right-8 h-40 w-auto object-contain"
        />
      </div>

      {/* Profile Content */}
      <div className="mx-auto max-w-4xl px-6 pb-12">
        {/* Avatar */}
        <div className="relative -mt-20 mb-8">
          <div className="relative inline-block">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src="/public/images/course-1.png" />
              <AvatarFallback className="text-2xl">{user?.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Họ và tên <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email được sử dụng để đăng nhập và nhận thông báo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Ngày sinh <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(v) => setFormData({ ...formData, countryCode: v })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+84">+84</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+86">+86</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Quốc gia <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                    <SelectTrigger id="country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vietnam">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🇻🇳</span>
                          <span>Vietnam</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="USA">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🇺🇸</span>
                          <span>United States</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="UK">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🇬🇧</span>
                          <span>United Kingdom</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh thành</Label>
                  <Select value={formData.province} onValueChange={(v) => setFormData({ ...formData, province: v })}>
                    <SelectTrigger id="province">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                      <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                      <SelectItem value="Hưng Yên">Hưng Yên</SelectItem>
                      <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                      <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Occupation */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="occupation">Nghề nghiệp</Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(v) => setFormData({ ...formData, occupation: v })}
                  >
                    <SelectTrigger id="occupation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sinh viên">Sinh viên</SelectItem>
                      <SelectItem value="Lập trình viên">Lập trình viên</SelectItem>
                      <SelectItem value="Kỹ sư">Kỹ sư</SelectItem>
                      <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                {/* <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="text-destructive hover:text-destructive">
                      Xóa tài khoản
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Tài khoản và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Xóa tài khoản
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}

                <Button type="submit" size="lg">
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
