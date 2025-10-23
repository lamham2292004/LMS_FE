'use client';

import { useEffect } from 'react';
import { useCourses } from '@/lib/hooks/useLms';
import { CourseResponse } from '@/lib/lms-api-client';

interface CourseListProps {
  onCourseClick?: (course: CourseResponse) => void;
}

export default function CourseList({ onCourseClick }: CourseListProps) {
  const { courses, loading, error, fetchCourses } = useCourses({
    onSuccess: (data) => {
      console.log('Courses loaded successfully:', data?.length);
    },
    onError: (err) => {
      console.error('Failed to load courses:', err);
    }
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <h3 className="text-red-800 font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
        <p className="text-red-600">{error.message || 'Không thể kết nối đến server'}</p>
        <button 
          onClick={fetchCourses}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p className="text-xl mb-2">📚</p>
        <p>Chưa có khóa học nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div 
          key={course.id}
          onClick={() => onCourseClick?.(course)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
          {/* Course Image */}
          {course.img && (
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img 
                src={course.img} 
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/course-1.png'; // fallback image
                }}
              />
            </div>
          )}
          
          {/* Course Info */}
          <div className="p-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                course.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                course.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {course.status === 'OPEN' ? '🟢 Đang mở' :
                 course.status === 'UPCOMING' ? '🔵 Sắp mở' :
                 '🔴 Đã đóng'}
              </span>
              <span className="text-xs text-gray-500">{course.categoryName}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {course.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-xl font-bold text-blue-600">
                {course.price.toLocaleString('vi-VN')} đ
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

