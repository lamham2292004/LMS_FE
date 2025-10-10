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
import "@/lib/api-test" // Import API test utility
export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    countryCode: "+84",
    country: "Vietnam",
    province: "",
    occupation: "",
  })

  // Test direct API call
  const testDirectAPI = async () => {
    const token = localStorage.getItem('auth_token');
    const userType = localStorage.getItem('user_type');
    console.log("=== DIRECT API TEST (LECTURER) ===");
    console.log("Token:", token?.substring(0, 50) + "...");
    console.log("User type:", userType);
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/${userType}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("Direct API Response:", data);
      console.log("Birth date from direct call:", data.data?.birth_date);
    } catch (error) {
      console.error("Direct API Error:", error);
    }
  };

  useEffect(() => {
    console.log("Profile page - User data:", user);
    console.log("Profile page - User type:", user?.user_type);
    console.log("Profile page - Is loading:", isLoading);
    
    // Check token for birth_date
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("Profile page - Token payload:", payload);
          console.log("Profile page - birth_date from token:", payload.birth_date);
        }
      } catch (error) {
        console.error("Profile page - Token decode error:", error);
      }
    }
    
    // Test direct API on mount
    if (!isLoading && user) {
      testDirectAPI();
    }
    
    if (user) {
      console.log("Profile page - Setting form data with user:", user);
      console.log("Profile page - birth_date raw:", user.birth_date);
      console.log("Profile page - address raw:", user.address);
      
      // Format birth_date from YYYY-MM-DD to DD/MM/YYYY
      let formattedBirthDate = "";
      if (user.birth_date) {
        try {
          const date = new Date(user.birth_date);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedBirthDate = `${day}/${month}/${year}`;
          }
        } catch (error) {
          console.error("Error formatting birth_date:", error);
          formattedBirthDate = user.birth_date;
        }
      }
      
      setFormData({
        fullName: user.full_name || "",
        email: user.email || "",
        dateOfBirth: formattedBirthDate,
        phone: user.phone || "",
        countryCode: "+84",
        country: "Vietnam",
        province: user.address || "",
        occupation: user.user_type === "lecturer" ? "Giáo viên" : "Sinh viên",
      })
      
      console.log("Profile page - Formatted birth_date:", formattedBirthDate);
      console.log("Profile page - Final form data:", {
        fullName: user.full_name || "",
        email: user.email || "",
        dateOfBirth: formattedBirthDate,
        phone: user.phone || "",
        countryCode: "+84",
        country: "Vietnam",
        province: user.address || "",
        occupation: user.user_type === "lecturer" ? "Giáo viên" : "Sinh viên",
      });
    } else {
      console.log("Profile page - No user data available");
    }
  }, [user, isLoading])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Không thể lấy thông tin người dùng</p>
          <p className="text-muted-foreground">Vui lòng đăng nhập lại</p>
        </div>
      </div>
    );
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
              <AvatarFallback className="text-2xl">{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
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

        {/* Debug Info */}
        {/* {user && (
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-sm text-purple-800">Debug Info (Lecturer)</CardTitle>
              <CardDescription>
                <button 
                  onClick={testDirectAPI}
                  className="text-xs bg-purple-500 text-white px-2 py-1 rounded"
                >
                  Test Direct API Call
                </button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p><strong>Raw birth_date:</strong> {user.birth_date || "null"}</p>
                  <p><strong>Raw address:</strong> {user.address || "null"}</p>
                  <p><strong>User type:</strong> {user.user_type || "null"}</p>
                  <p><strong>Lecturer code:</strong> {user.lecturer_code || "null"}</p>
                  <p><strong>Email:</strong> {user.email || "null"}</p>
                </div>
                <div>
                  <p><strong>Formatted birth_date:</strong> {formData.dateOfBirth || "empty"}</p>
                  <p><strong>Form province:</strong> {formData.province || "empty"}</p>
                  <p><strong>All user keys:</strong> {Object.keys(user).join(", ")}</p>
                  <p><strong>Token exists:</strong> {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Yes' : 'No'}</p>
                  <p><strong>Stored user_type:</strong> {typeof window !== 'undefined' ? localStorage.getItem('user_type') || 'null' : 'null'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

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
                  <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="flex-1"
                    />
                </div>

                {/* Occupation */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="occupation">Nghề nghiệp</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Actions */}
              {/* <div className="flex items-center gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => refreshUser()}
                >
                  Làm mới thông tin
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={testDirectAPI}
                >
                  Test API
                </Button>
              </div> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
