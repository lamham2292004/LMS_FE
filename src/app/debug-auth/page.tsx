"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card";
import { Button } from "@lms/components/ui/button";

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev]);
    console.log(`[DEBUG] ${msg}`);
  };

  useEffect(() => {
    addLog("Component mounted");
    
    // Check localStorage
    const token = localStorage.getItem("auth_token");
    const userType = localStorage.getItem("user_type");
    
    addLog(`Token in localStorage: ${token ? "YES (length: " + token.length + ")" : "NO"}`);
    addLog(`User type in localStorage: ${userType || "NO"}`);
    addLog(`isAuthenticated: ${isAuthenticated}`);
    addLog(`isLoading: ${isLoading}`);
    addLog(`user: ${user ? JSON.stringify(user.email) : "null"}`);

    // Check token expiry
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const exp = new Date(payload.exp * 1000);
          const isExpired = Date.now() > payload.exp * 1000;
          addLog(`Token expires: ${exp.toLocaleString()}`);
          addLog(`Token expired: ${isExpired ? "YES ❌" : "NO ✅"}`);
        }
      } catch (e) {
        addLog(`Token decode error: ${e}`);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  const forceReload = () => {
    window.location.reload();
  };

  const checkAgain = () => {
    setLogs([]);
    const token = localStorage.getItem("auth_token");
    addLog(`Manual check - Token: ${token ? "EXISTS" : "MISSING"}`);
    addLog(`Manual check - isAuthenticated: ${isAuthenticated}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Auth Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded">
            <div>
              <p className="font-semibold">Loading:</p>
              <p>{isLoading ? "🔄 YES" : "✅ NO"}</p>
            </div>
            <div>
              <p className="font-semibold">Authenticated:</p>
              <p>{isAuthenticated ? "✅ YES" : "❌ NO"}</p>
            </div>
            <div>
              <p className="font-semibold">User:</p>
              <p>{user ? `✅ ${user.email}` : "❌ null"}</p>
            </div>
            <div>
              <p className="font-semibold">Token:</p>
              <p>
                {typeof window !== "undefined" && localStorage.getItem("auth_token")
                  ? "✅ EXISTS"
                  : "❌ MISSING"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={checkAgain}>🔄 Check Again</Button>
            <Button onClick={forceReload} variant="outline">
              ↻ Force Reload
            </Button>
            <Button
              onClick={() => {
                localStorage.clear();
                addLog("Cleared localStorage!");
              }}
              variant="destructive"
            >
              🗑️ Clear Storage
            </Button>
          </div>

          {/* Logs */}
          <div className="border rounded p-4 bg-white">
            <h3 className="font-semibold mb-2">Debug Logs:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-400">No logs yet...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-sm font-mono text-gray-700">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Raw Data */}
          <details className="border rounded p-4">
            <summary className="font-semibold cursor-pointer">
              Show Raw User Data
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}

