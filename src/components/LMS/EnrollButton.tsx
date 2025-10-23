'use client';

import { useState, useEffect } from 'react';
import { useEnrollCourse, useCheckEnrollment } from '@/lib/hooks/useLms';
import { CourseStatus } from '@/lib/lms-api-client';

interface EnrollButtonProps {
  courseId: number;
  courseName?: string;
  courseStatus?: CourseStatus | string;
  startTime?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function EnrollButton({ 
  courseId, 
  courseName,
  courseStatus = 'OPEN',
  startTime,
  onSuccess,
  className = ''
}: EnrollButtonProps) {
  const [enrolled, setEnrolled] = useState(false);

  // Check enrollment status when component mounts
  const { isEnrolled, loading: checkingEnrollment, checkEnrollment } = useCheckEnrollment(courseId, {
    onSuccess: (result) => {
      setEnrolled(result || false);
    },
    onError: (err) => {
      console.error('Error checking enrollment:', err);
      // If error checking (e.g. not logged in), assume not enrolled
      setEnrolled(false);
    }
  });

  // Enroll course handler
  const { enrollCourse, loading: enrolling, error } = useEnrollCourse({
    onSuccess: () => {
      setEnrolled(true);
      alert(`✅ Đã đăng ký khóa học "${courseName || courseId}" thành công!`);
      onSuccess?.();
    },
    onError: (err) => {
      if (err.code === 2108) {
        alert('⚠️ Bạn đã đăng ký khóa học này rồi!');
        setEnrolled(true);
      } else if (err.code === 2103) {
        alert('❌ Chức năng này chỉ dành cho sinh viên');
      } else if (err.code === 2001 || err.code === 2002 || err.code === 2003) {
        alert('🔐 Vui lòng đăng nhập để đăng ký khóa học');
      } else {
        alert('❌ Lỗi: ' + (err.message || 'Không thể đăng ký khóa học'));
      }
    }
  });

  // Check enrollment status on mount
  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  // Update local state when isEnrolled changes
  useEffect(() => {
    setEnrolled(isEnrolled);
  }, [isEnrolled]);

  const handleEnroll = async () => {
    if (!confirm(`Bạn có chắc chắn muốn đăng ký khóa học "${courseName || courseId}"?`)) {
      return;
    }
    
    await enrollCourse(courseId);
  };

  // Format start time
  const formatStartTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Chưa xác định';
    }
  };

  // Show loading while checking enrollment
  if (checkingEnrollment) {
    return (
      <button 
        disabled
        className={`px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-wait text-sm ${className}`}
      >
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Kiểm tra...
        </span>
      </button>
    );
  }

  // If course is UPCOMING
  if (courseStatus === 'UPCOMING') {
    return (
      <div className="text-center">
        <button 
          disabled
          className={`px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-not-allowed text-sm ${className}`}
          title={startTime ? `Mở vào: ${formatStartTime(startTime)}` : 'Sắp mở'}
        >
          <span className="flex items-center justify-center gap-1">
            🔵 Sắp mở
          </span>
        </button>
        {startTime && (
          <p className="text-xs text-muted-foreground mt-1">
            📅 {formatStartTime(startTime)}
          </p>
        )}
      </div>
    );
  }

  // If course is CLOSED
  if (courseStatus === 'CLOSED') {
    return (
      <button 
        disabled
        className={`px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed text-sm ${className}`}
      >
        <span className="flex items-center justify-center gap-1">
          🔴 Đã đóng
        </span>
      </button>
    );
  }

  // If already enrolled (and course is OPEN)
  if (enrolled) {
    return (
      <button 
        disabled
        className={`px-4 py-2 bg-green-500 text-white rounded-lg cursor-not-allowed opacity-75 text-sm ${className}`}
      >
        ✓ Đã đăng ký
      </button>
    );
  }

  // Enroll button (only for OPEN courses)
  return (
    <div>
      <button 
        onClick={handleEnroll}
        disabled={enrolling || courseStatus !== 'OPEN'}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm ${className}`}
      >
        {enrolling ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang đăng ký...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1">
            📚 Đăng ký
          </span>
        )}
      </button>
      
      {error && !enrolled && (
        <p className="text-red-600 text-xs mt-1">
          {error.message || 'Đã có lỗi xảy ra'}
        </p>
      )}
    </div>
  );
}
