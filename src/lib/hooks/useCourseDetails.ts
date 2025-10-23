'use client';

import { useState, useEffect } from 'react';
import { 
  lmsApiClient, 
  CourseResponse, 
  EnrollmentResponse, 
  QuizResponse,
  QuizResultResponse 
} from '../lms-api-client';

export interface CourseDetails extends CourseResponse {
  enrollments: EnrollmentResponse[];
  quizzes: QuizResponse[];
  studentCount: number;
  activeStudentCount: number;
  completedStudentCount: number;
}

export function useCourseDetails(courseId: number) {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseResponse = await lmsApiClient.getCourse(courseId);
      const courseData = courseResponse.result;

      if (!courseData) {
        throw new Error('Course not found');
      }

      // Fetch enrollments for this course
      const enrollmentsResponse = await lmsApiClient.getCourseEnrollments(courseId);
      const enrollments = enrollmentsResponse.result || [];

      // Fetch quizzes for this course
      const quizzesResponse = await lmsApiClient.getQuizzesByCourse(courseId);
      const quizzes = quizzesResponse.result || [];

      // Calculate stats
      const activeEnrollments = enrollments.filter(
        (e: EnrollmentResponse) => e.status === 'ACTIVE'
      );
      const completedEnrollments = enrollments.filter(
        (e: EnrollmentResponse) => e.status === 'COMPLETED'
      );

      setCourse({
        ...courseData,
        enrollments,
        quizzes,
        studentCount: enrollments.length,
        activeStudentCount: activeEnrollments.length,
        completedStudentCount: completedEnrollments.length,
      });
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(err.message || 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const getQuizResults = async (quizId: number) => {
    try {
      const response = await lmsApiClient.getAllQuizResults(quizId);
      return response.result || [];
    } catch (err: any) {
      console.error('Error fetching quiz results:', err);
      return [];
    }
  };

  const createLesson = async (lessonData: any, videoFile?: File) => {
    try {
      setError(null);
      const response = await lmsApiClient.createLesson(lessonData, videoFile);
      await fetchCourseDetails(); // Refresh
      return response;
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      setError(err.message || 'Failed to create lesson');
      throw err;
    }
  };

  const createQuiz = async (quizData: any) => {
    try {
      setError(null);
      const response = await lmsApiClient.createQuiz(quizData);
      await fetchCourseDetails(); // Refresh
      return response;
    } catch (err: any) {
      console.error('Error creating quiz:', err);
      setError(err.message || 'Failed to create quiz');
      throw err;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourseDetails,
    getQuizResults,
    createLesson,
    createQuiz,
  };
}

