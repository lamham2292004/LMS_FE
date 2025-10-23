'use client';

import { useEffect, useState } from 'react';
import { getTokenInfo, clearExpiredToken } from '@/lib/token-manager';

export default function TokenStatus() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const updateTokenInfo = () => {
      const info = getTokenInfo();
      setTokenInfo(info);
    };

    updateTokenInfo();
    
    // Update every 10 seconds
    const interval = setInterval(updateTokenInfo, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!tokenInfo) return null;

  const handleClearToken = () => {
    if (confirm('Bạn có chắc muốn xóa token?')) {
      clearExpiredToken();
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
  };

  const handleLoginAgain = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border-2 max-w-sm ${
      tokenInfo.isValid 
        ? 'bg-green-50 border-green-300' 
        : 'bg-red-50 border-red-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">
          {tokenInfo.isValid ? '✅ Token hợp lệ' : '❌ Token hết hạn'}
        </h3>
        <button
          onClick={() => setTokenInfo(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1 text-xs">
        {tokenInfo.isValid ? (
          <>
            <p className="text-green-700">
              <strong>Thời gian còn lại:</strong> {tokenInfo.timeRemaining}
            </p>
            <p className="text-green-600">
              <strong>Hết hạn lúc:</strong><br />
              {new Date(tokenInfo.expiresAt).toLocaleString('vi-VN')}
            </p>
          </>
        ) : (
          <>
            <p className="text-red-700 font-semibold">
              Token đã hết hạn!
            </p>
            {tokenInfo.expiresAt && (
              <p className="text-red-600">
                <strong>Hết hạn từ:</strong><br />
                {new Date(tokenInfo.expiresAt).toLocaleString('vi-VN')}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleLoginAgain}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                Đăng nhập lại
              </button>
              <button
                onClick={handleClearToken}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              >
                Xóa token
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

