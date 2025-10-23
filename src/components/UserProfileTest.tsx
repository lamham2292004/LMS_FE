"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card";
import { Button } from "@lms/components/ui/button";

export default function UserProfileTest() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testProfileFetch = async () => {
    try {
      addTestResult("Testing profile fetch...");
      await refreshUser();
      addTestResult("Profile fetch completed successfully");
    } catch (error) {
      addTestResult(`Profile fetch failed: ${error}`);
    }
  };

  const testDirectApiCall = async () => {
    try {
      addTestResult("Testing direct API call...");
      const userType = localStorage.getItem("user_type") as "student" | "lecturer";
      addTestResult(`User type from localStorage: ${userType}`);
      
      const response = await fetch(`/api/v1/${userType}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      addTestResult(`Direct API response: ${JSON.stringify(data, null, 2)}`);
      
      if (data.data && data.data.birth_date) {
        addTestResult(`Birth date found: ${data.data.birth_date}`);
      } else {
        addTestResult("No birth_date in response");
      }
    } catch (error) {
      addTestResult(`Direct API call failed: ${error}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      addTestResult(`User loaded: ${user.full_name} (${user.user_type})`);
    } else if (!isLoading && !isAuthenticated) {
      addTestResult("User not authenticated");
    }
  }, [user, isLoading, isAuthenticated]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile Test</CardTitle>
          <CardDescription>Testing user profile fetching functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              <p>Loading: {isLoading ? "Yes" : "No"}</p>
              <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
              <p>User Type: {user?.user_type || "N/A"}</p>
              <p>Full Name: {user?.full_name || "N/A"}</p>
              <p>Email: {user?.email || "N/A"}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Actions</h3>
              <Button onClick={testProfileFetch} className="mb-2">
                Test Profile Fetch
              </Button>
              <Button onClick={testDirectApiCall} className="mb-2" variant="outline">
                Test Direct API
              </Button>
              <Button onClick={() => setTestResults([])} variant="outline">
                Clear Logs
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Test Results</h3>
            <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Raw User Data</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
