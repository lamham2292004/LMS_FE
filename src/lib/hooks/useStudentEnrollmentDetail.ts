'use client';

import { useState, useEffect } from 'react';
import { lmsApiClient, EnrollmentResponse, QuizResultResponse } from '../lms-api-client';

export interface StudentEnrollmentDetail {
  enrollment: EnrollmentResponse | null;
  quizResults: QuizResultResponse[];
  stats: {
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    passedQuizzes: number;
    failedQuizzes: number;
    totalAttempts: number;
  };
}

export function useStudentEnrollmentDetail(courseId: number, studentId: number) {
  const [data, setData] = useState<StudentEnrollmentDetail>({
    enrollment: null,
    quizResults: [],
    stats: {
      totalQuizzes: 0,
      completedQuizzes: 0,
      averageScore: 0,
      passedQuizzes: 0,
      failedQuizzes: 0,
      totalAttempts: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get course enrollments to find this student's enrollment
      const enrollmentsResponse = await lmsApiClient.getCourseEnrollments(courseId);
      const enrollment = enrollmentsResponse.result?.find(
        (e: EnrollmentResponse) => e.studentId === studentId
      );

      if (!enrollment) {
        throw new Error('Học viên chưa đăng ký khóa học này');
      }

      // 2. Get all quiz results for this student in this course
      const quizResultsResponse = await lmsApiClient.getStudentCourseResults(courseId, studentId);
      const quizResults = quizResultsResponse.result || [];

      // 3. Get all quizzes for this course to calculate stats
      const quizzesResponse = await lmsApiClient.getQuizzesByCourse(courseId);
      const allQuizzes = quizzesResponse.result || [];

      // 4. Calculate statistics
      const uniqueQuizzes = new Set(quizResults.map(r => r.quizId));
      const completedQuizzes = uniqueQuizzes.size;

      const averageScore = quizResults.length > 0
        ? quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length
        : 0;

      // Get best result for each quiz to count passed/failed
      const bestResults = Array.from(uniqueQuizzes).map(quizId => {
        const quizAttempts = quizResults.filter(r => r.quizId === quizId);
        return quizAttempts.reduce((best, current) => 
          current.score > best.score ? current : best
        );
      });

      const passedQuizzes = bestResults.filter(r => r.isPassed).length;
      const failedQuizzes = bestResults.filter(r => !r.isPassed).length;

      setData({
        enrollment,
        quizResults,
        stats: {
          totalQuizzes: allQuizzes.length,
          completedQuizzes,
          averageScore: Math.round(averageScore * 10) / 10,
          passedQuizzes,
          failedQuizzes,
          totalAttempts: quizResults.length,
        },
      });
    } catch (err: any) {
      console.error('Error fetching student enrollment detail:', err);
      setError(err.message || 'Không thể tải thông tin học viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId && studentId) {
      fetchStudentDetail();
    }
  }, [courseId, studentId]);

  return {
    data,
    loading,
    error,
    refetch: fetchStudentDetail,
  };
}

