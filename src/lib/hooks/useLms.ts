// React Hooks for LMS API
import { useState, useCallback } from 'react';
import { 
  lmsApiClient, 
  LmsApiResponse,
  CourseResponse,
  LessonResponse,
  LessonSummaryResponse,
  QuizResponse,
  EnrollmentResponse,
  QuizResultResponse,
  CategoryResponse,
  QuestionResponse,
} from '../lms-api-client';

interface UseLmsQueryOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Generic hook for LMS API calls
export function useLmsQuery<T>(
  queryFn: () => Promise<LmsApiResponse<T>>,
  options?: UseLmsQueryOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await queryFn();
      setData(response.result || null);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryFn, options]);

  return { data, loading, error, execute, refetch: execute };
}

// ============= CATEGORY HOOKS =============
export function useCategories(options?: UseLmsQueryOptions) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getAllCategories();
      setCategories(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { categories, loading, error, fetchCategories, refetch: fetchCategories };
}

export function useCategory(categoryId: number, options?: UseLmsQueryOptions) {
  return useLmsQuery<CategoryResponse>(
    () => lmsApiClient.getCategory(categoryId),
    options
  );
}

export function useCreateCategory(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createCategory = useCallback(async (data: { name: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.createCategory(data);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { createCategory, loading, error };
}

export function useUpdateCategory(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateCategory = useCallback(async (categoryId: number, data: { name?: string; description?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.updateCategory(categoryId, data);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { updateCategory, loading, error };
}

export function useDeleteCategory(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.deleteCategory(categoryId);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { deleteCategory, loading, error };
}

// ============= COURSE HOOKS =============
export function useCourses(options?: UseLmsQueryOptions) {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getAllCourses();
      setCourses(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { courses, loading, error, fetchCourses, refetch: fetchCourses };
}

// LECTURER - Get my courses (includes PENDING, APPROVED, REJECTED)
export function useLecturerCourses(options?: UseLmsQueryOptions) {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getLecturerCourses();
      setCourses(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { courses, loading, error, fetchCourses, refetch: fetchCourses };
}

// ADMIN - Get all courses (includes ALL status)
export function useAdminCourses(options?: UseLmsQueryOptions) {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getAllCoursesForAdmin();
      setCourses(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { courses, loading, error, fetchCourses, refetch: fetchCourses };
}

// ADMIN - Approve or Reject course
export function useApproveCourse(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const approveCourse = useCallback(async (courseId: number, approvalData: import('@/lib/lms-api-client').ApprovalRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.approveCourse(courseId, approvalData);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { approveCourse, loading, error };
}

// ADMIN - Delete course
export function useDeleteCourse(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const deleteCourse = useCallback(async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.deleteCourse(courseId);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { deleteCourse, loading, error };
}

export function useCourse(courseId: number, options?: UseLmsQueryOptions) {
  return useLmsQuery<CourseResponse>(
    () => lmsApiClient.getCourse(courseId),
    options
  );
}

export function useCreateCourse(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createCourse = useCallback(async (courseData: any, imageFile: File) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.createCourse(courseData, imageFile);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { createCourse, loading, error };
}

export function useUpdateCourse(courseId: number, options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateCourse = useCallback(async (courseData: any, imageFile?: File) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.updateCourse(courseId, courseData, imageFile);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId, options]);

  return { updateCourse, loading, error };
}

// ============= LESSON HOOKS =============
export function useLesson(lessonId: number, options?: UseLmsQueryOptions) {
  return useLmsQuery<LessonResponse>(
    () => lmsApiClient.getLesson(lessonId),
    options
  );
}

export function useLessonsByCourse(courseId: number, options?: UseLmsQueryOptions) {
  const [lessons, setLessons] = useState<LessonSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchLessons = useCallback(async () => {
    if (!courseId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getLessonsByCourse(courseId);
      setLessons(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId, options]);

  return { lessons, loading, error, fetchLessons, refetch: fetchLessons };
}

export function useCreateLesson(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createLesson = useCallback(async (lessonData: any, videoFile?: File) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.createLesson(lessonData, videoFile);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { createLesson, loading, error };
}

// ============= QUIZ HOOKS =============
export function useQuiz(quizId: number, options?: UseLmsQueryOptions) {
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getQuiz(quizId);
      setQuiz(response.result || null);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quizId, options]);

  return { quiz, loading, error, fetchQuiz, refetch: fetchQuiz };
}

export function useQuizzesByLesson(lessonId: number, options?: UseLmsQueryOptions) {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchQuizzes = useCallback(async () => {
    if (!lessonId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getQuizzesByLesson(lessonId);
      setQuizzes(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lessonId, options]);

  return { quizzes, loading, error, fetchQuizzes, refetch: fetchQuizzes };
}

export function useQuizzesByCourse(courseId: number, options?: UseLmsQueryOptions) {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchQuizzes = useCallback(async () => {
    if (!courseId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getQuizzesByCourse(courseId);
      setQuizzes(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId, options]);

  return { quizzes, loading, error, fetchQuizzes, refetch: fetchQuizzes };
}

export function useCreateQuiz(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const createQuiz = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.createQuiz(data);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { createQuiz, loading, error };
}

// ============= QUESTION HOOKS =============
export function useQuestionsByQuiz(quizId: number, options?: UseLmsQueryOptions) {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchQuestions = useCallback(async () => {
    if (!quizId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getQuestionsByQuiz(quizId);
      setQuestions(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quizId, options]);

  return { questions, loading, error, fetchQuestions, refetch: fetchQuestions };
}

// ============= ENROLLMENT HOOKS =============
// Get all enrollments (LECTURER/ADMIN)
export function useEnrollments(options?: UseLmsQueryOptions) {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getAllEnrollments();
      setEnrollments(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { enrollments, loading, error, fetchEnrollments, refetch: fetchEnrollments };
}

// Get my enrollments (STUDENT)
export function useMyEnrollments(options?: UseLmsQueryOptions) {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getMyEnrollments();
      setEnrollments(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { enrollments, loading, error, fetchEnrollments, refetch: fetchEnrollments };
}

export function useEnrollCourse(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const enrollCourse = useCallback(async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.enrollCourse(courseId);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { enrollCourse, loading, error };
}

export function useCheckEnrollment(courseId: number, options?: UseLmsQueryOptions) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const checkEnrollment = useCallback(async () => {
    if (!courseId) return false;
    
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.checkEnrollment(courseId);
      setIsEnrolled(response.result || false);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      setIsEnrolled(false);
      options?.onError?.(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [courseId, options]);

  return { isEnrolled, loading, error, checkEnrollment, refetch: checkEnrollment };
}

// ============= QUIZ RESULT HOOKS (STUDENT) =============
export function useSubmitQuiz(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const submitQuiz = useCallback(async (data: {
    quizId: number;
    answers: Record<number, string>;
    timeTaken: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.submitQuiz(data);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { submitQuiz, loading, error };
}

export function useMyQuizResults(quizId: number, options?: UseLmsQueryOptions) {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getMyQuizResults(quizId);
      setResults(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quizId, options]);

  return { results, loading, error, fetchResults, refetch: fetchResults };
}

// Get all quiz results for current student
export function useMyAllQuizResults(options?: UseLmsQueryOptions) {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getMyAllQuizResults();
      setResults(response.result || []);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { results, loading, error, fetchResults, refetch: fetchResults };
}

// Get detailed quiz result by ID
export function useQuizResultDetail(resultId: number, options?: UseLmsQueryOptions) {
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchResult = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.getQuizResultDetail(resultId);
      setResult(response.result || null);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [resultId, options]);

  return { result, loading, error, fetchResult, refetch: fetchResult };
}

// ============= HEALTH CHECK =============
export function useHealthCheck(options?: UseLmsQueryOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lmsApiClient.healthCheck();
      setStatus(response.result);
      options?.onSuccess?.(response.result);
      return response.result;
    } catch (err) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { status, loading, error, checkHealth };
}

