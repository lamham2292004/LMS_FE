// File: src/app/authorized/lms/app/layout.tsx

"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import "../../../globals.css";

// Import components từ chính module LMS bằng alias @lms
import { Header } from '@lms/components/header';
import { Sidebar } from '@lms/components/sidebar';

// Import AuthContext từ hệ thống FE_LMS gốc bằng alias @
// Import AuthContext từ hệ thống FE_LMS gốc bằng alias @
import { useAuth } from '@/features/auth';

interface LMSLayoutProps {
  children: React.ReactNode;
}

export default function LMSLayout({ children }: LMSLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Tự động xác định vai trò dựa trên URL để hiển thị sidebar chính xác
  const role = useMemo(() => {
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/lecturer')) return 'lecturer';
    return 'student';
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar của FE_DEMO, nhận vai trò để hiển thị menu tương ứng */}
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header của FE_DEMO */}
        <Header />

        {/* Nội dung của các trang con (student, admin...) sẽ được hiển thị ở đây */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
