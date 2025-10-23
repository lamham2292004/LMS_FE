// Application Configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "HPC Project",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Hệ Thống Quản Lý Giáo Dục",
  version: "1.0.0",
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10000, // 10 seconds
  endpoints: {
    auth: {
      login: "/v1/login",
      logout: "/v1/logout",
      refresh: "/v1/refresh",
      profile: "/v1/me",
    },
    students: {
      list: "/v1/students",
      profile: "/v1/student/profile",
    },
    lecturers: {
      list: "/v1/lecturers",
      profile: "/v1/lecturer/profile",
    },
    classes: {
      list: "/v1/classes",
    },
    departments: {
      list: "/v1/departments",
      tree: "/v1/departments/tree",
    },
  },
} as const;

// LMS API Configuration (Spring Boot Backend)
export const LMS_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_LMS_API_URL || "http://localhost:8083/api",
  uploadsUrl: process.env.NEXT_PUBLIC_LMS_UPLOADS_URL || "http://localhost:8083/uploads",
  timeout: 10000, // 10 seconds
  endpoints: {
    // Public endpoints
    health: "/health",
    category: "/category",
    course: "/course",
    // Auth test
    test: {
      me: "/test/me",
    },
    // Category management
    categories: {
      list: "/category",
      create: "/category/createCategory",
      get: (id: number) => `/category/${id}`,
      update: (id: number) => `/category/${id}`,
      delete: (id: number) => `/category/${id}`,
    },
    // Course management
    courses: {
      list: "/course",
      create: "/course/createCourse",
      get: (id: number) => `/course/${id}`,
      update: (id: number) => `/course/updateCourse/${id}/with-file`,
      delete: (id: number) => `/course/${id}`,
    },
    // Lesson management
    lessons: {
      create: "/lesson/createLesson",
      get: (id: number) => `/lesson/${id}`,
      update: (id: number) => `/lesson/updateLesson/${id}/with-file`,
      delete: (id: number) => `/lesson/${id}`,
    },
    // Quiz management
    quizzes: {
      create: "/quiz",
      get: (id: number) => `/quiz/${id}`,
      update: (id: number) => `/quiz/${id}`,
      delete: (id: number) => `/quiz/${id}`,
    },
    // Question management
    questions: {
      create: "/question",
      update: (id: number) => `/question/${id}`,
      delete: (id: number) => `/question/${id}`,
    },
    // Answer options
    answerOptions: {
      create: "/answerOption",
      update: (id: number) => `/answerOption/${id}`,
      delete: (id: number) => `/answerOption/${id}`,
    },
    // Enrollment (Student)
    enrollment: {
      enroll: "/enrollment/enroll",
      myEnrollments: "/enrollment/my-enrollments",
      update: (id: number) => `/enrollment/${id}`,
      check: (courseId: number) => `/enrollment/check/${courseId}`,
    },
    // Quiz results (Student)
    quizResults: {
      submit: "/quiz-results/submit",
      myResults: (quizId: number) => `/quiz-results/my-results/${quizId}`,
      myBest: (quizId: number) => `/quiz-results/my-best-result/${quizId}`,
      canTake: (quizId: number) => `/quiz-results/can-take/${quizId}`,
    },
  },
} as const;

// User Types
export const USER_TYPES = {
  STUDENT: "student",
  LECTURER: "lecturer",
  ADMIN: "admin",
} as const;

// Routes
export const ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dashboard: {
    main: "/authorized/dashboard",
    student: "/authorized/student/dashboard",
    lecturer: "/authorized/lecturer/dashboard",
    admin: "/authorized/admin/dashboard",
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
} as const;

// Helper function to build LMS image URL
export function getLmsImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/images/course-1.png"; // Default fallback image
  }
  
  // Nếu đã là URL đầy đủ, return luôn
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Backend trả về: "uploads/courses/abc.jpg" (đã có "uploads/")
  // Kết quả: "http://localhost:8083/uploads/courses/abc.jpg"
  const baseUrl = process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || "http://localhost:8083";
  
  // Nếu path đã bắt đầu bằng "uploads/", ghép trực tiếp với baseUrl
  if (imagePath.startsWith('uploads/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // Nếu không, ghép với uploadsUrl (có thể là path cũ như "courses/abc.jpg")
  return `${LMS_API_CONFIG.uploadsUrl}/${imagePath}`;
}
