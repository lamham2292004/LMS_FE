'use client';

import { useEffect, useState } from 'react';
import { tokenManager, getTokenInfo } from '@/lib/token-manager';

export default function DebugTokenPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rawToken, setRawToken] = useState<string>('');
  const [decoded, setDecoded] = useState<any>(null);

  useEffect(() => {
    updateTokenInfo();
  }, []);

  const updateTokenInfo = () => {
    const token = tokenManager.getToken();
    setRawToken(token || 'No token found');

    if (token) {
      const info = getTokenInfo();
      const decodedToken = tokenManager.decodeToken(token);
      setTokenInfo(info);
      setDecoded(decodedToken);
    } else {
      setTokenInfo(null);
      setDecoded(null);
    }
  };

  const handleClearToken = () => {
    if (confirm('Xóa token?')) {
      localStorage.removeItem('auth_token');
      updateTokenInfo();
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔐 Token Debug Page</h1>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={updateTokenInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleClearToken}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Clear Token
          </button>
          <button
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🔑 Login Page
          </button>
        </div>

        {/* Token Status */}
        {tokenInfo && (
          <div className={`p-6 rounded-lg mb-6 ${
            tokenInfo.isValid ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
          }`}>
            <h2 className="text-xl font-semibold mb-4">
              {tokenInfo.isValid ? '✅ Token Valid' : '❌ Token Expired'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status:</p>
                <p className="font-semibold">
                  {tokenInfo.isValid ? '✅ Valid' : '❌ Expired'}
                </p>
              </div>
              
              {tokenInfo.expiresAt && (
                <div>
                  <p className="text-sm text-gray-600">Expires At:</p>
                  <p className="font-semibold">
                    {new Date(tokenInfo.expiresAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}
              
              {tokenInfo.timeRemaining && (
                <div>
                  <p className="text-sm text-gray-600">Time Remaining:</p>
                  <p className="font-semibold text-green-600">
                    {tokenInfo.timeRemaining}
                  </p>
                </div>
              )}
            </div>

            {!tokenInfo.isValid && (
              <div className="mt-4 p-4 bg-red-100 rounded">
                <p className="font-semibold text-red-800">⚠️ Action Required:</p>
                <p className="text-sm text-red-700 mt-1">
                  Your token has expired. Please login again to get a new token.
                </p>
                <button
                  onClick={handleLoginRedirect}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Login Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Decoded Token */}
        {decoded && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">📋 Decoded Token</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">User ID:</p>
                <p className="font-mono">{decoded.userId || decoded.sub}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-mono">{decoded.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User Type:</p>
                <p className="font-mono">{decoded.user_type || decoded.userType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issued At:</p>
                <p className="font-mono">
                  {decoded.iat ? new Date(decoded.iat * 1000).toLocaleString('vi-VN') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expires At:</p>
                <p className="font-mono">
                  {decoded.exp ? new Date(decoded.exp * 1000).toLocaleString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Raw Token */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔑 Raw Token</h2>
          <textarea
            value={rawToken}
            readOnly
            className="w-full h-32 p-3 border rounded font-mono text-xs bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-2">
            Stored in: localStorage['auth_token']
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-300 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>If token is expired, click "Login Page" to get a new token</li>
            <li>After login, come back to this page to verify new token</li>
            <li>Token should be valid for several hours/days (check backend settings)</li>
            <li>If token keeps expiring quickly, check JWT settings in backend</li>
          </ol>
        </div>

        {/* Backend Check */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🔧 Backend Settings:</h3>
          <p className="text-sm text-yellow-700 mb-2">
            Check your Identity Service (Laravel) JWT expiration time:
          </p>
          <pre className="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
{`// In Laravel .env or config
JWT_TTL=10080  // 7 days in minutes
JWT_REFRESH_TTL=20160  // 14 days in minutes`}
          </pre>
          <p className="text-xs text-yellow-600 mt-2">
            Current token expired on: {decoded?.exp ? new Date(decoded.exp * 1000).toLocaleString('vi-VN') : 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}

