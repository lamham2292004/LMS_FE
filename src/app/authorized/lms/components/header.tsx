// File: src/app/authorized/lms/components/header.tsx (NỘI DUNG MỚI)

"use client"

// Import icon và các component UI từ chính module LMS (dùng alias @lms)
import { Bell, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lms/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { ThemeToggle } from "@lms/components/theme-toggle"

// Import hook useAuth từ hệ thống FE_LMS gốc (dùng alias @)
import { useAuth } from "@/features/auth";

import Link from "next/link"

interface HeaderProps {
  title: string
  showCart?: boolean
}

export function Header({ title, showCart = false }: HeaderProps) {
  // Lấy thông tin user và hàm logout từ AuthContext
  const { user, logout } = useAuth();

  // Sử dụng hàm logout từ context
  const handleLogout = () => {
    logout();
    // Router sẽ tự động điều hướng về trang login do ProtectedRoute
  }

  const userName = user?.full_name || "Người dùng";
  const userEmail = user?.email || "email@example.com";
  // Giả sử user có trường avatar, nếu không thì dùng ảnh placeholder
  const userAvatar = user?.avatar || "";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {showCart && (
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">2</Badge>
            </Link>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive p-0 text-xs">3</Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/student/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}