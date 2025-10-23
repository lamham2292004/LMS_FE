"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { lmsApiClient } from "@/lib/lms-api-client"
import Link from "next/link"

export default function QuizResultsPage() {
  const params = useParams()
  const courseId = params.id as string
  const quizId = parseInt(params.quizId as string)

  const [quiz, setQuiz] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch quiz info
        const quizResponse = await lmsApiClient.getQuiz(quizId)
        setQuiz(quizResponse.result)

        // Fetch quiz results
        const resultsResponse = await lmsApiClient.getAllQuizResults(quizId)
        setResults(resultsResponse.result || [])
      } catch (err: any) {
        console.error('Error fetching quiz results:', err)
        setError(err.message || 'Không thể tải kết quả bài kiểm tra')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchData()
    }
  }, [quizId])

  // Calculate stats
  const totalAttempts = results.length
  const avgScore = totalAttempts > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts) 
    : 0
  const passedResults = results.filter(r => r.isPassed)
  const passRate = totalAttempts > 0 
    ? Math.round((passedResults.length / totalAttempts) * 100) 
    : 0
  const avgTime = totalAttempts > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / totalAttempts) 
    : 0

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Đang tải kết quả..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col">
        <Header title="Lỗi" />
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold text-destructive mb-2">
                {error || "Không tìm thấy bài kiểm tra"}
              </h2>
              <Button asChild className="mt-4">
                <Link href={`/authorized/lms/app/lecturer/courses/${courseId}`}>
                  Quay lại quản lý khóa học
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Kết quả bài kiểm tra" />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description || "Thống kê và kết quả chi tiết"}</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng lượt làm</p>
                  <p className="mt-2 text-3xl font-bold">{totalAttempts}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Set(results.map(r => r.studentId)).size} học viên
                  </p>
                </div>
                <Users className="h-12 w-12 text-primary opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Điểm TB</p>
                  <p className="mt-2 text-3xl font-bold">{avgScore}%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-success opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tỷ lệ đạt</p>
                  <p className="mt-2 text-3xl font-bold">{passRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {passedResults.length}/{totalAttempts} lượt đạt
                  </p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-success opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian TB</p>
                  <p className="mt-2 text-3xl font-bold">{avgTime} phút</p>
                </div>
                <Clock className="h-12 w-12 text-blue-500 opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Kết quả học viên</TabsTrigger>
            <TabsTrigger value="questions">Phân tích câu hỏi</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kết quả của học viên ({results.length})</CardTitle>
                  <Button variant="outline" size="sm" disabled>
                    Xuất Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>Chưa có học viên nào làm bài kiểm tra này</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {result.studentName 
                                ? result.studentName.split(' ').slice(-2).map((n: string) => n[0]).join('').toUpperCase()
                                : result.studentId.toString().slice(0, 2)
                              }
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold">{result.studentName || `Học viên #${result.studentId}`}</p>
                            <p className="text-sm text-muted-foreground">ID: {result.studentId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Điểm</p>
                            <div className="flex items-center gap-2">
                              <p className={`text-lg font-bold ${result.isPassed ? "text-success" : "text-destructive"}`}>
                                {result.score}%
                              </p>
                              {result.isPassed ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {result.correctAnswers}/{result.totalQuestions} đúng
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Thời gian</p>
                            <p className="font-semibold">{result.timeTaken} phút</p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Lần làm</p>
                            <p className="font-semibold">#{result.attemptNumber}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Ngày làm</p>
                            <p className="font-semibold text-xs">
                              {new Date(result.takenAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích theo câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>Tính năng phân tích chi tiết câu hỏi đang được phát triển</p>
                  <p className="text-sm mt-2">Backend cần cung cấp API thống kê chi tiết theo từng câu hỏi</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
