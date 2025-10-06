"use client";

import { useState } from "react";
import { usePathname, redirect } from "next/navigation";
import { Sidebar, Navbar } from "@/features/layout";
import { useAuth } from "@/features/auth";

// Component con này chứa toàn bộ logic và sẽ được render bên trong AuthProvider
function AuthorizedLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một component loading spinner
  }

  // Logic xác thực người dùng
  if (!user) {
    return redirect("/auth/login");
  }

  // Logic ẩn layout chung khi vào LMS
  const isLmsAppRoute = pathname.startsWith('/authorized/lms/app');
  if (isLmsAppRoute) {
    return <>{children}</>;
  }

  // Hiển thị layout chung cho các trang còn lại
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

// Layout chính bây giờ chỉ có nhiệm vụ render component con ở trên
export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  return <AuthorizedLayoutClient>{children}</AuthorizedLayoutClient>;
}