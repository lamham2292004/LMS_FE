// src/app/authorized/lms/app/layout.tsx (Code đã sửa)

"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import "../../../globals.css";

// Import components từ chính module LMS bằng alias @lms
// Header không cần ở đây nữa
import { Sidebar } from '@lms/components/sidebar';

// Import AuthContext từ hệ thống FE_LMS gốc bằng alias @
import { useAuth } from '@/features/auth';

interface LMSLayoutProps {
  children: React.ReactNode;
}

export default function LMSLayout({ children }: LMSLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const role = useMemo(() => {
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/lecturer')) return 'lecturer';
    return 'student';
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Dòng <Header /> đã được xóa bỏ */}

        <main className="flex-1 overflow-y-auto bg-muted/40">
          {/* Sửa lại padding ở đây để không bị mất khoảng đệm */}
          {children}
        </main>
      </div>
    </div>
  );
}