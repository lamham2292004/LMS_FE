'use client';

import { useState, useEffect } from 'react';
import { lmsApiClient, CourseResponse, EnrollmentResponse } from '../lms-api-client';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  pendingCoursesCount: number;
  approvedCoursesCount: number;
  rejectedCoursesCount: number;
  totalRevenue: number;
}

export interface RecentEnrollment {
  id: number;
  studentId: number;
  studentName?: string;
  courseId: number;
  courseName: string;
  coursePrice: number;
  status: string;
  enrolledAt: string;
}

export interface PendingCourse {
  id: number;
  title: string;
  teacherId: number;
  approvalStatus: string;
  createdAt: string;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    pendingCoursesCount: 0,
    approvedCoursesCount: 0,
    rejectedCoursesCount: 0,
    totalRevenue: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [pendingCourses, setPendingCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Fetching admin dashboard data...');

      // 1. Get all courses
      const coursesResponse = await lmsApiClient.getAllCoursesForAdmin();
      const allCourses = coursesResponse.result || [];

      // 2. Get all enrollments
      const enrollmentsResponse = await lmsApiClient.getAllEnrollments();
      const allEnrollments = enrollmentsResponse.result || [];

      // 3. Calculate stats
      const pendingCourses = allCourses.filter(c => c.approvalStatus === 'PENDING');
      const approvedCourses = allCourses.filter(c => c.approvalStatus === 'APPROVED');
      const rejectedCourses = allCourses.filter(c => c.approvalStatus === 'REJECTED');

      // Calculate total revenue from enrollments
      const totalRevenue = allEnrollments.reduce((sum, enrollment) => {
        const course = allCourses.find(c => c.id === enrollment.courseId);
        return sum + (course?.price || 0);
      }, 0);

      // Get unique students
      const uniqueStudents = new Set(allEnrollments.map(e => e.studentId));

      setStats({
        totalUsers: uniqueStudents.size, // Count unique students
        totalCourses: allCourses.length,
        totalStudents: uniqueStudents.size,
        totalEnrollments: allEnrollments.length,
        pendingCoursesCount: pendingCourses.length,
        approvedCoursesCount: approvedCourses.length,
        rejectedCoursesCount: rejectedCourses.length,
        totalRevenue,
      });

      // 4. Get recent enrollments (last 10)
      const sortedEnrollments = [...allEnrollments].sort((a, b) => 
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
      ).slice(0, 10);

      const recentEnrollmentsWithDetails = sortedEnrollments.map(enrollment => {
        const course = allCourses.find(c => c.id === enrollment.courseId);
        return {
          id: enrollment.id,
          studentId: enrollment.studentId,
          studentName: enrollment.studentName || `Học viên #${enrollment.studentId}`,
          courseId: enrollment.courseId,
          courseName: enrollment.courseName || course?.title || 'Unknown',
          coursePrice: course?.price || 0,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
        };
      });

      setRecentEnrollments(recentEnrollmentsWithDetails);

      // 5. Set pending courses (last 10)
      setPendingCourses(pendingCourses.slice(0, 10));

      console.log('✅ Admin dashboard data loaded:', {
        courses: allCourses.length,
        enrollments: allEnrollments.length,
        pendingCourses: pendingCourses.length,
      });
    } catch (err: any) {
      console.error('❌ Error fetching admin dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentEnrollments,
    pendingCourses,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}

