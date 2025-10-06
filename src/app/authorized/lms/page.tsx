// File: src/app/authorized/lms/page.tsx (ĐÃ SỬA LẠI)

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import hook useAuth từ hệ thống FE_LMS gốc
// Import hook useAuth từ hệ thống FE_LMS gốc
import { useAuth } from '@/features/auth';
import styles from './loading.module.css';

export default function LMSLandingPage() {
    // Lấy ra userRole thay vì user
    const { userRole, isLoading } = useAuth(); // <--- THAY ĐỔI Ở ĐÂY
    const router = useRouter();

    useEffect(() => {
        // Chờ cho đến khi AuthContext không còn loading nữa
        if (!isLoading && userRole) { // <--- THAY ĐỔI Ở ĐÂY

            // Bắt đầu điều hướng dựa trên userRole
            if (userRole === 'admin') {
                router.replace('/authorized/lms/app/admin');
            } else if (userRole === 'lecturer') {
                router.replace('/authorized/lms/app/lecturer');
            } else {
                // Mặc định là student
                router.replace('/authorized/lms/app/student');
            }
        }
        // Thêm isLoading và userRole vào dependencies
    }, [isLoading, userRole, router]); // <--- THAY ĐỔI Ở ĐÂY

    // Hiển thị giao diện loading trong khi chờ
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Đang tải hệ thống học tập...</p>
        </div>
    );
}
