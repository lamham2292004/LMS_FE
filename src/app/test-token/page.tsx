"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"

export default function TestTokenPage() {
  const [tokenInfo, setTokenInfo] = useState<any>({})

  const checkToken = () => {
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('user_type')
    
    console.log("=== TOKEN CHECK ===")
    console.log("Raw token:", token)
    console.log("Token length:", token?.length)
    console.log("Token parts:", token?.split('.').length)
    console.log("User type:", userType)
    
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          console.log("Decoded payload:", payload)
          setTokenInfo({
            valid: true,
            token: token.substring(0, 50) + "...",
            parts: parts.length,
            payload: payload,
            userType: userType,
            exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
            isExpired: payload.exp ? Date.now() > payload.exp * 1000 : false
          })
        } else {
          setTokenInfo({
            valid: false,
            error: `Token has ${parts.length} parts, expected 3`,
            token: token.substring(0, 50) + "..."
          })
        }
      } catch (error) {
        console.error("Token decode error:", error)
        setTokenInfo({
          valid: false,
          error: String(error),
          token: token.substring(0, 50) + "..."
        })
      }
    } else {
      setTokenInfo({
        valid: false,
        error: "No token found in localStorage"
      })
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  const clearStorage = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_type')
    alert('Cleared! Please login again')
    window.location.href = '/auth/login'
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold">Token Status:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(tokenInfo, null, 2)}
            </pre>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={checkToken}>Refresh Check</Button>
            <Button onClick={clearStorage} variant="destructive">
              Clear & Re-login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

