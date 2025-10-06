"use client"

import { Home, BookOpen, Users, Settings, BarChart3, GraduationCap, UserCheck, FileText, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@lms/lib/utils"

interface SidebarProps {
  role: "student" | "lecturer" | "admin"
}

const menuItems = {
  student: [
    { href: "/authorized/lms/app/student", label: "Tổng quan", icon: Home },
    { href: "/authorized/lms/app/student/courses", label: "Khóa học", icon: BookOpen },
    { href: "/authorized/lms/app/student/tests", label: "Bài kiểm tra", icon: FileText },
    { href: "/authorized/lms/app/student/profile", label: "Hồ sơ", icon: UserCheck },
  ],
  lecturer: [
    { href: "/authorized/lms/app/lecturer", label: "Tổng quan", icon: Home },
    { href: "/authorized/lms/app/lecturer/courses", label: "Khóa học", icon: BookOpen },
    { href: "/authorized/lms/app/lecturer/students", label: "Học viên", icon: Users },
    { href: "/authorized/lms/app/lecturer", label: "Báo cáo", icon: BarChart3 },
  ],
  admin: [
    { href: "/authorized/lms/app/admin", label: "Tổng quan", icon: Home },
    { href: "/authorized/lms/app/admin/users", label: "Người dùng", icon: Users },
    { href: "/authorized/lms/app/admin/courses", label: "Khóa học", icon: BookOpen },
    { href: "/authorized/lms/app/admin/categories", label: "Danh mục", icon: FileText },
    { href: "/authorized/lms/app/admin/transactions", label: "Giao dịch", icon: BarChart3 },
  ],
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const items = menuItems[role]

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-semibold">LMS Portal</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-border p-4">
        <Link
          href="/authorized/lms/app/settings"
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="mr-3 h-4 w-4" />
          Cài đặt
        </Link>
      </div>
    </div>
  )
}