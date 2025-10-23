'use client';

import { useEffect, useState } from 'react';
import { lmsApiClient } from '@/lib/lms-api-client';
import { useCourses, useCategories } from '@/lib/hooks/useLms';
import EnrollButton from '@/components/LMS/EnrollButton';
import { Badge } from 'react-bootstrap';

export default function CoursesDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { courses, loading: coursesLoading, error: coursesError, fetchCourses } = useCourses();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học từ backend...</p>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold text-xl mb-2">❌ Lỗi Kết Nối</h2>
            <p className="text-red-600 mb-4">{coursesError.message}</p>
            
            <div className="bg-white p-4 rounded mb-4">
              <h3 className="font-semibold mb-2">Kiểm tra:</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Backend đang chạy? <code>http://localhost:8083</code></li>
                <li>Token còn hạn? <a href="/debug-token" className="text-blue-600 underline">Check token</a></li>
                <li>CORS configured? Check <code>application.yaml</code></li>
              </ol>
            </div>

            <button 
              onClick={fetchCourses}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Khóa Học Từ LMS Backend
          </h1>
          <p className="text-gray-600">
            Dữ liệu real-time từ Spring Boot API
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">Tổng Khóa Học</p>
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">Danh Mục</p>
            <p className="text-3xl font-bold text-green-600">{categories.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">Khóa Miễn Phí</p>
            <p className="text-3xl font-bold text-purple-600">
              {courses.filter(c => c.price === 0).length}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({courses.length})
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({courses.filter(c => c.categoryName === category.name).length})
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Tìm thấy <strong>{filteredCourses.length}</strong> khóa học
          </p>
          <button
            onClick={fetchCourses}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            🔄 Làm mới
          </button>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-6xl mb-4">📚</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy khóa học nào
            </p>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map(course => (
              <div 
                key={course.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={course.img || '/images/course-1.png'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/images/course-1.png';
                    }}
                  />
                  <div className="absolute right-2 top-2">
                    <Badge
                      variant="secondary"
                      className={
                        course.status === 'OPEN' ? 'bg-green-500 text-white' :
                        course.status === 'UPCOMING' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }
                    >
                      {course.status === 'OPEN' ? '🟢 Đang mở' :
                      course.status === 'UPCOMING' ? '🔵 Sắp mở' :
                      '🔴 Đã đóng'}
                    </Badge>
                  </div>
                  {course.price === 0 && (
                    <div className="absolute left-2 top-2">
                      <Badge className="bg-success text-white">Miễn phí</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category */}
                  <div className="mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {course.categoryName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Lessons Count */}
                  {course.lessons && course.lessons.length > 0 && (
                    <p className="text-sm text-gray-500 mb-3">
                      📖 {course.lessons.length} bài học
                    </p>
                  )}

                  {/* Footer */}
                  <div className="border-t pt-4 mt-4 flex items-center justify-between">
                    <div>
                      {course.price === 0 ? (
                        <span className="text-xl font-bold text-green-600">
                          Miễn phí
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-blue-600">
                          {course.price.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>
                    <EnrollButton 
                      courseId={course.id}
                      courseName={course.title}
                      className="px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Backend Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Thông tin:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Backend: <code>http://localhost:8083/api</code></li>
            <li>✅ Endpoint: <code>/api/course</code></li>
            <li>✅ Total courses: {courses.length}</li>
            <li>✅ Categories: {categories.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

