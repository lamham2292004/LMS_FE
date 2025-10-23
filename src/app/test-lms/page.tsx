'use client';

import { useEffect, useState } from 'react';
import { lmsApiClient } from '@/lib/lms-api-client';
import { useCourses, useCategories, useHealthCheck } from '@/lib/hooks/useLms';

export default function TestLMSPage() {
  const [rawHealthData, setRawHealthData] = useState<any>(null);
  const [rawCoursesData, setRawCoursesData] = useState<any>(null);
  const [authTestData, setAuthTestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Using hooks
  const { status, loading: healthLoading, checkHealth } = useHealthCheck();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories();
  const { courses, loading: coursesLoading, fetchCourses } = useCourses();

  useEffect(() => {
    // Test with hooks
    checkHealth();
    fetchCategories();
    fetchCourses();

    // Test with raw API client
    testRawApiClient();
  }, []);

  const testRawApiClient = async () => {
    try {
      // Test health check
      const healthResponse = await lmsApiClient.healthCheck();
      setRawHealthData(healthResponse);
      console.log('Health Check Response:', healthResponse);

      // Test courses
      const coursesResponse = await lmsApiClient.getAllCourses();
      setRawCoursesData(coursesResponse);
      console.log('Courses Response:', coursesResponse);

      // Test auth (if logged in)
      try {
        const authResponse = await lmsApiClient.testAuth();
        setAuthTestData(authResponse);
        console.log('Auth Test Response:', authResponse);
      } catch (authError) {
        console.log('Not authenticated or auth test failed:', authError);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to LMS backend');
      console.error('Error testing LMS API:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧪 LMS Backend Integration Test</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Health Check Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2>1. Health Check (Public API)</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
          <h3>Using Hook:</h3>
          {healthLoading ? (
            <p>Loading...</p>
          ) : (
            <pre>{JSON.stringify(status, null, 2)}</pre>
          )}

          <h3 style={{ marginTop: '20px' }}>Using Raw API Client:</h3>
          <pre>{JSON.stringify(rawHealthData, null, 2)}</pre>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2>2. Categories (Public API)</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
          {categoriesLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p><strong>Total Categories:</strong> {categories.length}</p>
              <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
                {JSON.stringify(categories, null, 2)}
              </pre>
            </>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2>3. Courses (Public API)</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
          <h3>Using Hook:</h3>
          {coursesLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p><strong>Total Courses:</strong> {courses.length}</p>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {courses.map(course => (
                  <div key={course.id} style={{ 
                    border: '1px solid #ddd', 
                    padding: '10px', 
                    marginBottom: '10px',
                    borderRadius: '4px',
                    backgroundColor: 'white'
                  }}>
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <p><strong>Price:</strong> ${course.price}</p>
                    <p><strong>Category:</strong> {course.categoryName}</p>
                    <p><strong>Status:</strong> {course.status}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 style={{ marginTop: '20px' }}>Using Raw API Client:</h3>
          <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(rawCoursesData, null, 2)}
          </pre>
        </div>
      </section>

      {/* Auth Test Section */}
      <section style={{ marginBottom: '30px' }}>
        <h2>4. Authentication Test (Requires Login)</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
          {authTestData ? (
            <>
              <p style={{ color: 'green' }}>✅ Authenticated</p>
              <pre>{JSON.stringify(authTestData, null, 2)}</pre>
            </>
          ) : (
            <p style={{ color: 'orange' }}>⚠️ Not authenticated or auth test failed</p>
          )}
        </div>
      </section>

      {/* Connection Info */}
      <section style={{ marginBottom: '30px' }}>
        <h2>5. Connection Info</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
          <p><strong>LMS API URL:</strong> {process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8083/api'}</p>
          <p><strong>Identity API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</p>
          <p><strong>JWT Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</p>
        </div>
      </section>

      {/* Instructions */}
      <section style={{ marginBottom: '30px' }}>
        <h2>📋 Test Instructions</h2>
        <div style={{ backgroundColor: '#e7f3ff', padding: '15px', borderRadius: '4px' }}>
          <ol>
            <li>✅ Đảm bảo backend Spring Boot đang chạy tại port 8083</li>
            <li>✅ Public APIs (Health, Categories, Courses) sẽ hoạt động mà không cần login</li>
            <li>⚠️ Auth Test cần login trước (qua Identity Service)</li>
            <li>📝 Kiểm tra Console để xem detailed logs</li>
          </ol>
        </div>
      </section>
    </div>
  );
}

