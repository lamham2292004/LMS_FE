"use client"

import {
  Bell,
  Home, // Thêm icon Home
  LogOut,
  Search,
  ShoppingCart,
  User,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/features/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Button } from "@lms/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lms/components/ui/dropdown-menu"
import { ThemeToggle } from "@lms/components/theme-toggle"

interface HeaderProps {
  title?: string
  showCart?: boolean
}

export function Header({ title, showCart = false }: HeaderProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const userName = user?.full_name || "Người dùng"
  const userEmail = user?.email || "email@example.com"
  const userAvatar = user?.avatar || ""

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background px-4 md:px-6">
      {/* Breadcrumbs / Title */}
      {title && <h1 className="text-lg font-semibold">{title}</h1>}

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* NÚT QUAY LẠI TRANG CHỦ MỚI */}
        <Link href="/authorized/dashboard" passHref>
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Trang chủ</span>
          </Button>
        </Link>

        {/* Search form */}
        <form className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="w-full rounded-lg bg-muted py-2 pl-8 pr-2 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </form>

        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Thông báo</span>
        </Button>

        {/* Cart */}
        {showCart && (
          <Link href="/authorized/lms/app/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Giỏ hàng</span>
            </Button>
          </Link>
        )}

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}