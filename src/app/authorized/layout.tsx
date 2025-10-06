// src/app/authorized/layout.tsx (Code đã sửa)

"use client";

import { useState } from "react";
// 1. Import thêm hook `usePathname`
import { usePathname, redirect } from "next/navigation";
import { Sidebar, Navbar } from "@/features/layout";
import { useAuth } from "@/features/auth";

function AuthorizedLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  // 2. Lấy đường dẫn URL hiện tại
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một component loading spinner
  }

  if (!user) {
    return redirect("/auth/login");
  }

  // 3. Kiểm tra xem có phải là trang thuộc LMS hay không
  // Nếu đường dẫn bắt đầu bằng '/authorized/lms/app', đây là trang của LMS
  const isLmsAppRoute = pathname.startsWith('/authorized/lms/app');

  // 4. Nếu là trang của LMS, chỉ render nội dung trang (`children`)
  // mà không bao gồm Sidebar và Navbar chung.
  if (isLmsAppRoute) {
    return <>{children}</>;
  }

  // 5. Nếu không phải trang LMS, hiển thị layout chung như bình thường
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

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  return <AuthorizedLayoutClient>{children}</AuthorizedLayoutClient>;
}