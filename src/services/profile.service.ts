import { apiClient } from '@/lib/api-client'

// Student Profile Types
export interface StudentProfile {
  id: number
  full_name: string
  student_code: string
  email: string
  phone?: string
  department?: string
  class?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  birth_date?: string
}

export interface UpdateStudentProfile {
  full_name?: string
  phone?: string
  address?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other'
}

// Lecturer Profile Types
export interface LecturerProfile {
  id: number
  full_name: string
  lecturer_code: string
  email: string
  phone?: string
  department?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  birth_date?: string
  experience_number?: number
}

export interface UpdateLecturerProfile {
  full_name?: string
  phone?: string
  address?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other'
}

// Profile Service
export const profileService = {
  // Student Profile
  async getStudentProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<StudentProfile>('/v1/student/profile')
    return response.data!
  },

  async updateStudentProfile(data: UpdateStudentProfile): Promise<StudentProfile> {
    const response = await apiClient.put<StudentProfile>('/v1/student/profile', data)
    return response.data!
  },

  // Lecturer Profile
  async getLecturerProfile(): Promise<LecturerProfile> {
    const response = await apiClient.get<LecturerProfile>('/v1/lecturer/profile')
    return response.data!
  },

  async updateLecturerProfile(data: UpdateLecturerProfile): Promise<LecturerProfile> {
    const response = await apiClient.put<LecturerProfile>('/v1/lecturer/profile', data)
    return response.data!
  },
}
