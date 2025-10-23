'use client';

import { useEffect } from 'react';
import { useMyEnrollments } from '@/lib/hooks/useLms';

export default function MyEnrollments() {
  const { enrollments, loading, error, fetchEnrollments } = useMyEnrollments({
    onSuccess: (data) => {
      console.log('Enrollments loaded:', data?.length);
    },
    onError: (err) => {
      console.error('Failed to load enrollments:', err);
      if (err.code === 2103) {
        alert('Chức năng này chỉ dành cho sinh viên');
      }
    }
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học của bạn...</p>
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
          onClick={fetchEnrollments}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Chưa có khóa học nào
        </h3>
        <p className="text-gray-500 mb-4">
          Bạn chưa đăng ký khóa học nào. Hãy khám phá và đăng ký các khóa học mới!
        </p>
        <a 
          href="/authorized/lms/app/student/browse"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Khám phá khóa học
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Khóa học của tôi ({enrollments.length})
        </h2>
        <button 
          onClick={fetchEnrollments}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          🔄 Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <div 
            key={enrollment.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-5">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  enrollment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {enrollment.status === 'ACTIVE' ? '✅ Đang học' :
                   enrollment.status === 'COMPLETED' ? '🎓 Hoàn thành' :
                   '❌ Đã hủy'}
                </span>
                {enrollment.progress !== undefined && (
                  <span className="text-xs text-gray-500">
                    {enrollment.progress}%
                  </span>
                )}
              </div>

              {/* Course Name */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {enrollment.courseName}
              </h3>

              {/* Enrolled Date */}
              <p className="text-sm text-gray-500 mb-4">
                📅 Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>

              {/* Progress Bar */}
              {enrollment.progress !== undefined && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-2">
                <a 
                  href={`/authorized/lms/app/student/courses/${enrollment.courseId}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Vào học
                </a>
                {enrollment.status === 'ACTIVE' && (
                  <button 
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title="Xem chi tiết"
                  >
                    ℹ️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

