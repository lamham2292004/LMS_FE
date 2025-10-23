// LMS API Client for Spring Boot Backend Integration
// Base URL: http://localhost:8083/api

import { tokenManager } from './token-manager';

const LMS_API_BASE_URL = process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8083/api';

// LMS API Response Format from Spring Boot
export interface LmsApiResponse<T = any> {
  code: number;
  result?: T;
  message?: string;
}

// Error Codes from Backend
export enum LmsErrorCode {
  SUCCESS = 1000,
  TOKEN_NOT_EXIST = 2001,
  TOKEN_INVALID = 2002,
  TOKEN_EXPIRED = 2003,
  UNAUTHORIZED = 2101,
  STUDENT_ONLY = 2103,
  COURSE_NOT_FOUND = 1004,
  ALREADY_ENROLLED = 2108,
  NOT_ENROLLED = 2106,
  QUIZ_MAX_ATTEMPTS = 1017,
}

class LmsApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    
    // Check if token is expired
    if (token && tokenManager.isTokenExpired(token)) {
      console.error('❌ Token đã hết hạn! Vui lòng đăng nhập lại.');
      // Clear expired token
      tokenManager.clearExpiredToken();
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        const shouldRedirect = confirm('Token đã hết hạn. Bạn có muốn đăng nhập lại không?');
        if (shouldRedirect) {
          window.location.href = '/auth/login';
        }
      }
      return null;
    }
    
    // Warn if token will expire soon
    if (token && tokenManager.willExpireSoon(token, 10)) {
      console.warn('⚠️ Token sẽ hết hạn trong 10 phút. Vui lòng chuẩn bị đăng nhập lại.');
    }
    
    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<LmsApiResponse<T>> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data: LmsApiResponse<T> = await response.json();

      if (!response.ok || (data.code && data.code !== LmsErrorCode.SUCCESS)) {
        throw {
          status: response.status,
          code: data.code,
          message: data.message || 'An error occurred',
        };
      }

      return data;
    } catch (error: any) {
      console.error('LMS API Error:', error);
      throw error;
    }
  }

  // Generic HTTP Methods
  async get<T>(endpoint: string): Promise<LmsApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<LmsApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<LmsApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<LmsApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File Upload (multipart/form-data)
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<LmsApiResponse<T>> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data: LmsApiResponse<T> = await response.json();

      if (!response.ok || (data.code && data.code !== LmsErrorCode.SUCCESS)) {
        throw {
          status: response.status,
          code: data.code,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error: any) {
      console.error('LMS Upload Error:', error);
      throw error;
    }
  }

  // ============= CATEGORY APIs =============
  async getAllCategories() {
    return this.get<CategoryResponse[]>('/category');
  }

  async getCategory(categoryId: number) {
    return this.get<CategoryResponse>(`/category/${categoryId}`);
  }

  async createCategory(data: CategoryCreateRequest) {
    return this.post<CategoryResponse>('/category/createCategory', data);
  }

  async updateCategory(categoryId: number, data: CategoryUpdateRequest) {
    return this.put<CategoryResponse>(`/category/${categoryId}`, data);
  }

  async deleteCategory(categoryId: number) {
    return this.delete<string>(`/category/${categoryId}`);
  }

  // ============= COURSE APIs =============
  async getAllCourses() {
    return this.get<CourseResponse[]>('/course');
  }

  async getCourse(courseId: number) {
    return this.get<CourseResponse>(`/course/${courseId}`);
  }

  // LECTURER - Get my courses (includes PENDING courses)
  async getLecturerCourses() {
    return this.get<CourseResponse[]>('/course/lecturer/my-courses');
  }

  // ADMIN - Get all courses (includes PENDING, REJECTED)
  async getAllCoursesForAdmin() {
    return this.get<CourseResponse[]>('/course/admin/all');
  }

  // ADMIN - Get pending courses for approval
  async getPendingCourses() {
    return this.get<CourseResponse[]>('/course/admin/pending');
  }

  // ADMIN - Approve or reject course
  async approveCourse(courseId: number, approvalData: ApprovalRequest) {
    return this.post<CourseResponse>(`/course/${courseId}/approve`, approvalData);
  }

  async createCourse(courseData: CourseCreateRequest, imageFile: File) {
    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));
    formData.append('file', imageFile);
    return this.uploadFile<CourseResponse>('/course/createCourse', formData);
  }

  async updateCourse(courseId: number, courseData: CourseUpdateRequest, imageFile?: File) {
    const token = this.getToken();
    
    const formData = new FormData();
    formData.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('file', imageFile);
    }
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/course/updateCourse/${courseId}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const data: LmsApiResponse<CourseResponse> = await response.json();

      if (!response.ok || (data.code && data.code !== LmsErrorCode.SUCCESS)) {
        throw {
          status: response.status,
          code: data.code,
          message: data.message || 'Update failed',
        };
      }

      return data;
    } catch (error: any) {
      console.error('LMS Update Course Error:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: number) {
    return this.delete<string>(`/course/${courseId}`);
  }

  // ============= LESSON APIs =============
  async getLesson(lessonId: number) {
    return this.get<LessonResponse>(`/lesson/${lessonId}`);
  }

  async getLessonsByCourse(courseId: number) {
    // This endpoint doesn't exist in backend yet, but we can get from course details
    const course = await this.getCourse(courseId);
    return { code: LmsErrorCode.SUCCESS, result: course.result?.lessons || [] };
  }

  async createLesson(lessonData: LessonCreateRequest, videoFile?: File) {
    const formData = new FormData();
    // Backend expects @RequestPart("lesson") as Blob with application/json type
    formData.append('lesson', new Blob([JSON.stringify(lessonData)], { type: 'application/json' }));
    if (videoFile) {
      formData.append('video', videoFile);
    }
    console.log('📝 Creating lesson:', lessonData);
    console.log('📹 Video file:', videoFile?.name);
    return this.uploadFile<LessonResponse>('/lesson/createLesson', formData);
  }

  async updateLesson(lessonId: number, lessonData: LessonUpdateRequest, videoFile?: File) {
    const token = this.getToken();
    
    const formData = new FormData();
    formData.append('lesson', new Blob([JSON.stringify(lessonData)], { type: 'application/json' }));
    if (videoFile) {
      formData.append('video', videoFile);
    }
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/lesson/updateLesson/${lessonId}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const data: LmsApiResponse<LessonResponse> = await response.json();

      if (!response.ok || (data.code && data.code !== LmsErrorCode.SUCCESS)) {
        throw {
          status: response.status,
          code: data.code,
          message: data.message || 'Update failed',
        };
      }

      return data;
    } catch (error: any) {
      console.error('LMS Update Lesson Error:', error);
      throw error;
    }
  }

  async deleteLesson(lessonId: number) {
    return this.delete<string>(`/lesson/${lessonId}`);
  }

  // ============= QUIZ APIs =============
  async getQuiz(quizId: number) {
    return this.get<QuizResponse>(`/quiz/${quizId}`);
  }

  async getQuizzesByLesson(lessonId: number) {
    return this.get<QuizResponse[]>(`/quiz/lesson/${lessonId}`);
  }

  async getQuizzesByCourse(courseId: number) {
    return this.get<QuizResponse[]>(`/quiz/course/${courseId}`);
  }

  async createQuiz(data: QuizCreateRequest) {
    return this.post<QuizResponse>('/quiz', data);
  }

  async updateQuiz(quizId: number, data: QuizUpdateRequest) {
    return this.put<QuizResponse>(`/quiz/${quizId}`, data);
  }

  async deleteQuiz(quizId: number) {
    return this.delete<string>(`/quiz/${quizId}`);
  }

  // ============= QUESTION APIs =============
  async getQuestionsByQuiz(quizId: number) {
    return this.get<QuestionResponse[]>(`/question/quiz/${quizId}`);
  }

  async createQuestion(data: QuestionCreateRequest) {
    return this.post<QuestionResponse>('/question', data);
  }

  async updateQuestion(questionId: number, data: QuestionUpdateRequest) {
    return this.put<QuestionResponse>(`/question/${questionId}`, data);
  }

  async deleteQuestion(questionId: number) {
    return this.delete<string>(`/question/${questionId}`);
  }

  // ============= ANSWER OPTION APIs =============
  async createAnswerOption(data: AnswerOptionCreateRequest) {
    return this.post<AnswerOptionResponse>('/answerOption', data);
  }

  async updateAnswerOption(optionId: number, data: AnswerOptionUpdateRequest) {
    return this.put<AnswerOptionResponse>(`/answerOption/${optionId}`, data);
  }

  async deleteAnswerOption(optionId: number) {
    return this.delete<string>(`/answerOption/${optionId}`);
  }

  // ============= ENROLLMENT APIs (STUDENT) =============
  async enrollCourse(courseId: number) {
    return this.post<EnrollmentResponse>('/enrollment/enroll', { courseId });
  }

  async getMyEnrollments() {
    return this.get<EnrollmentResponse[]>('/enrollment/my-enrollments');
  }

  async checkEnrollment(courseId: number) {
    return this.get<boolean>(`/enrollment/check/${courseId}`);
  }

  async updateEnrollment(enrollmentId: number, data: EnrollmentUpdateRequest) {
    return this.put<EnrollmentResponse>(`/enrollment/${enrollmentId}`, data);
  }

  // ============= ENROLLMENT APIs (LECTURER/ADMIN) =============
  async getAllEnrollments() {
    return this.get<EnrollmentResponse[]>('/enrollment');
  }

  async getEnrollmentById(enrollmentId: number) {
    return this.get<EnrollmentResponse>(`/enrollment/${enrollmentId}`);
  }

  async createEnrollment(data: { studentId: number; courseId: number }) {
    return this.post<EnrollmentResponse>('/enrollment/createEnrollment', data);
  }

  async deleteEnrollment(enrollmentId: number) {
    return this.delete<string>(`/enrollment/${enrollmentId}`);
  }

  // ============= QUIZ RESULT APIs (STUDENT) =============
  async submitQuiz(data: SubmitQuizRequest) {
    return this.post<QuizResultResponse>('/quiz-results/submit', data);
  }

  async getMyQuizResults(quizId: number) {
    return this.get<QuizResultResponse[]>(`/quiz-results/my-results/${quizId}`);
  }

  async getMyBestResult(quizId: number) {
    return this.get<QuizResultResponse>(`/quiz-results/my-best-result/${quizId}`);
  }

  async canTakeQuiz(quizId: number) {
    return this.get<boolean>(`/quiz-results/can-take/${quizId}`);
  }

  async getMyCourseResults(courseId: number) {
    return this.get<QuizResultResponse[]>(`/quiz-results/my-course-results/${courseId}`);
  }

  // Get all quiz results for current student (across all courses)
  async getMyAllQuizResults() {
    return this.get<QuizResultResponse[]>(`/quiz-results/my-all-results`);
  }

  // Get detailed quiz result by ID
  async getQuizResultDetail(resultId: number) {
    return this.get<QuizResultResponse>(`/quiz-results/detail/${resultId}`);
  }

  // ============= QUIZ RESULT APIs (LECTURER/ADMIN) =============
  async getAllQuizResults(quizId: number) {
    return this.get<QuizResultResponse[]>(`/quiz-results/quiz/${quizId}/all-results`);
  }

  // Get quiz results of a specific student in a course
  async getStudentCourseResults(courseId: number, studentId: number) {
    // Get all enrollments to verify student is enrolled
    const enrollments = await this.getCourseEnrollments(courseId);
    const enrollment = enrollments.result?.find((e: EnrollmentResponse) => e.studentId === studentId);
    
    if (!enrollment) {
      throw new Error('Student not enrolled in this course');
    }

    // Get all quiz results for quizzes in this course
    const quizzes = await this.getQuizzesByCourse(courseId);
    const allResults: QuizResultResponse[] = [];
    
    if (quizzes.result && Array.isArray(quizzes.result)) {
      for (const quiz of quizzes.result) {
        const results = await this.getAllQuizResults(quiz.id);
        if (results.result && Array.isArray(results.result)) {
          const studentResults = results.result.filter((r: QuizResultResponse) => r.studentId === studentId);
          allResults.push(...studentResults);
        }
      }
    }
    
    return {
      code: 1000,
      result: allResults
    };
  }

  // ============= LECTURER SPECIFIC APIs =============
  // Moved to COURSE APIs section above - use getLecturerCourses()

  async getCourseEnrollments(courseId: number) {
    // Get all enrollments and filter by courseId
    const enrollments = await this.getAllEnrollments();
    return {
      ...enrollments,
      result: enrollments.result?.filter((e: EnrollmentResponse) => e.courseId === courseId)
    };
  }

  async getCourseStudentStats(courseId: number) {
    // Get enrollments for a course to calculate stats
    const enrollments = await this.getCourseEnrollments(courseId);
    return enrollments;
  }

  // ============= USER APIs =============
  // TODO: Backend needs to implement these endpoints
  async getUserById(userId: number) {
    // This endpoint may not exist yet in backend
    // Expected endpoint: GET /user/{userId} or /api/user/{userId}
    return this.get<UserInfo>(`/user/${userId}`);
  }

  async getStudentById(studentId: number) {
    // Alternative: GET /student/{studentId}
    return this.get<StudentInfo>(`/student/${studentId}`);
  }

  // ============= TEST/HEALTH APIs =============
  async healthCheck() {
    return this.get<HealthCheckResponse>('/health');
  }

  async testAuth() {
    return this.get<UserTokenInfo>('/test/me');
  }
}

// ============= TYPE DEFINITIONS =============

// Enums
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CourseStatus {
  UPCOMING = 'UPCOMING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum LessonStatus {
  UPCOMING = 'UPCOMING',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum UserType {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

// Request Types
export interface ApprovalRequest {
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  teacherId?: number; // Optional, will be set from JWT for lecturers
  status?: CourseStatus;
  startTime?: string; // ISO 8601 format
  endTime?: string;
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  status?: CourseStatus;
  startTime?: string;
  endTime?: string;
}

export interface LessonCreateRequest {
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  duration?: number; // in minutes
  status?: LessonStatus;
}

export interface LessonUpdateRequest {
  title?: string;
  description?: string;
  orderIndex?: number;
  duration?: number;
  status?: LessonStatus;
}

export interface QuizCreateRequest {
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  passScore?: number; // percentage
}

export interface QuizUpdateRequest {
  title?: string;
  description?: string;
  timeLimit?: number;
  maxAttempts?: number;
  passScore?: number;
}

export interface QuestionCreateRequest {
  quizId: number;
  questionText: string;
  questionType: QuestionType;
  points: number;
  orderIndex: number;
}

export interface QuestionUpdateRequest {
  questionText?: string;
  questionType?: QuestionType;
  points?: number;
  orderIndex?: number;
}

export interface AnswerOptionCreateRequest {
  questionId: number;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface AnswerOptionUpdateRequest {
  answerText?: string;
  isCorrect?: boolean;
  orderIndex?: number;
}

export interface EnrollmentUpdateRequest {
  status?: EnrollmentStatus;
}

export interface SubmitQuizRequest {
  quizId: number;
  studentId?: number; // Will be set from JWT
  answers: Record<number, string>; // questionId -> answerOptionId
  timeTaken: number; // in minutes
}

// Response Types
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  courses?: CourseResponse[];
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  teacherId: number;
  status: CourseStatus;
  
  // Approval information
  approvalStatus?: ApprovalStatus;
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;
  
  startTime?: string;
  endTime?: string;
  img?: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  lessons?: LessonSummaryResponse[];
  enrollments?: EnrollmentResponse[];
}

export interface LessonResponse {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  status: LessonStatus;
  duration?: number;
  videoPath?: string;
  quizzes?: QuizResponse[];
}

export interface LessonSummaryResponse {
  id: number;
  title: string;
  orderIndex: number;
  duration?: number;
}

export interface QuizResponse {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  timeLimit?: number;
  maxAttempts?: number;
  passScore?: number;
  questions?: QuestionResponse[];
}

export interface QuestionResponse {
  id: number;
  quizId: number;
  questionText: string;
  questionType: QuestionType;
  points: number;
  orderIndex: number;
  answerOptions?: AnswerOptionResponse[];
}

export interface AnswerOptionResponse {
  id: number;
  questionId: number;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentName?: string; // TODO: Backend needs to return this field
  studentEmail?: string; // Optional: student email
  courseId: number;
  courseName: string;
  courseImg?: string; // Add course image field
  status: EnrollmentStatus;
  enrolledAt: string;
  progress?: number; // Add progress field
}

export interface QuizResultResponse {
  id: number;
  quizId: number;
  quizTitle: string;
  studentId: number;
  studentName: string;
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  attemptNumber: number;
  isPassed: boolean;
  takenAt: string;
  feedback?: string;
}

export interface UserTokenInfo {
  userId: number;
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  userType: UserType;
  studentCode?: string;
  lecturerCode?: string;
  classId?: number;
  departmentId?: number;
  isAdmin?: boolean;
}

// User Info Response (TODO: Backend needs to implement this)
export interface UserInfo {
  id: number;
  accountId: number;
  fullName: string;
  email: string;
  userType: UserType;
  studentCode?: string;
  lecturerCode?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
}

// Student Info Response (TODO: Backend needs to implement this)
export interface StudentInfo {
  id: number;
  accountId: number;
  fullName: string;
  email: string;
  studentCode: string;
  classId?: number;
  className?: string;
  departmentId?: number;
  departmentName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

// Export singleton instance
export const lmsApiClient = new LmsApiClient(LMS_API_BASE_URL);

