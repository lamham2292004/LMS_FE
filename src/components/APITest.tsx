'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
}

export default function APITest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoints = [
    { name: 'Health Check', endpoint: '/health', method: 'GET' },
    { name: 'Login Test', endpoint: '/v1/login', method: 'POST', data: { username: 'test', password: 'test' } },
    { name: 'Get Profile', endpoint: '/v1/me', method: 'GET' },
    { name: 'Get Students', endpoint: '/v1/students', method: 'GET' },
    { name: 'Get Classes', endpoint: '/v1/classes', method: 'GET' },
    { name: 'Get Departments', endpoint: '/v1/departments', method: 'GET' },
  ];

  const runTest = async (test: typeof testEndpoints[0]) => {
    setResults(prev => [...prev, {
      endpoint: test.name,
      status: 'loading',
      message: 'Testing...'
    }]);

    try {
      let response;
      if (test.method === 'GET') {
        response = await apiClient.get(test.endpoint);
      } else if (test.method === 'POST') {
        response = await apiClient.post(test.endpoint, test.data);
      }

      setResults(prev => prev.map(r => 
        r.endpoint === test.name 
          ? { 
              endpoint: test.name, 
              status: 'success', 
              message: 'Success!', 
              data: response 
            }
          : r
      ));
    } catch (error: any) {
      setResults(prev => prev.map(r => 
        r.endpoint === test.name 
          ? { 
              endpoint: test.name, 
              status: 'error', 
              message: error.message || 'Error occurred' 
            }
          : r
      ));
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setResults([]);
    
    for (const test of testEndpoints) {
      await runTest(test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-800 mb-2">API Configuration:</h3>
          <p className="text-sm text-blue-700">
            Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg"
          >
            {isLoading ? 'Testing...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              result.status === 'success' 
                ? 'border-green-200 bg-green-50' 
                : result.status === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{result.endpoint}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                result.status === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : result.status === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {result.status}
              </span>
            </div>
            
            <p className="text-sm mb-2">{result.message}</p>
            
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600">
                  View Response Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Click "Run All Tests" to test API connectivity
        </div>
      )}
    </div>
  );
}