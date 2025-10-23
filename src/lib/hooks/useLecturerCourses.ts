'use client';

import { useState, useEffect } from 'react';
import { lmsApiClient, CourseResponse, EnrollmentResponse } from '../lms-api-client';
import { tokenManager } from '../token-manager';

export interface LecturerCourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

export interface CourseWithStats extends CourseResponse {
  studentCount: number;
  revenue: number;
  rating: number;
  reviews: number;
}

export function useLecturerCourses() {
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [stats, setStats] = useState<LecturerCourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📖 Fetching lecturer courses...');

      // Use new backend endpoint that returns only lecturer's courses (including PENDING)
      const coursesResponse = await lmsApiClient.getLecturerCourses();
      const lecturerCourses = coursesResponse.result || [];
      
      console.log('✅ Lecturer courses loaded:', lecturerCourses.length);

      // Fetch enrollments to get student counts
      const enrollmentsResponse = await lmsApiClient.getAllEnrollments();
      const allEnrollments = enrollmentsResponse.result || [];

      // Calculate stats for each course
      const coursesWithStats: CourseWithStats[] = lecturerCourses.map((course) => {
        const courseEnrollments = allEnrollments.filter(
          (e: EnrollmentResponse) => e.courseId === course.id
        );

        return {
          ...course,
          studentCount: courseEnrollments.length,
          revenue: courseEnrollments.length * course.price,
          rating: 4.5, // TODO: Get from backend when available
          reviews: Math.floor(courseEnrollments.length * 0.7), // Mock data
        };
      });

      setCourses(coursesWithStats);

      // Calculate overall stats
      const totalStudents = coursesWithStats.reduce((sum, c) => sum + c.studentCount, 0);
      const totalRevenue = coursesWithStats.reduce((sum, c) => sum + c.revenue, 0);
      const publishedCourses = coursesWithStats.filter((c) => c.status === 'OPEN');
      const draftCourses = coursesWithStats.filter(
        (c) => c.status === 'UPCOMING' || c.status === 'CLOSED'
      );

      setStats({
        totalCourses: coursesWithStats.length,
        publishedCourses: publishedCourses.length,
        draftCourses: draftCourses.length,
        totalStudents,
        totalRevenue,
        averageRating: 4.5, // TODO: Calculate from actual ratings
      });
    } catch (err: any) {
      console.error('Error fetching lecturer courses:', err);
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: any, imageFile: File) => {
    try {
      setError(null);
      console.log('🚀 useLecturerCourses - Creating course...');
      console.log('📦 Course data:', JSON.stringify(courseData, null, 2));
      console.log('🖼️ Image:', imageFile?.name);
      
      const response = await lmsApiClient.createCourse(courseData, imageFile);
      
      console.log('✅ Course created! Response:', response);
      
      await fetchCourses(); // Refresh the list
      return response;
    } catch (err: any) {
      console.error('❌ Error creating course:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        data: err.response?.data
      });
      setError(err.message || 'Failed to create course');
      throw err;
    }
  };

  const updateCourse = async (courseId: number, courseData: any, imageFile?: File) => {
    try {
      setError(null);
      console.log('📝 Updating course:', courseId);
      const response = await lmsApiClient.updateCourse(courseId, courseData, imageFile);
      await fetchCourses(); // Refresh the list
      return response;
    } catch (err: any) {
      console.error('Error updating course:', err);
      setError(err.message || 'Failed to update course');
      throw err;
    }
  };

  const deleteCourse = async (courseId: number) => {
    try {
      setError(null);
      await lmsApiClient.deleteCourse(courseId);
      await fetchCourses(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting course:', err);
      setError(err.message || 'Failed to delete course');
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    stats,
    loading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}

