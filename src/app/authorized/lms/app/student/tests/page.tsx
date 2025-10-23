"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Progress } from "@lms/components/ui/progress"
import { Trophy, Clock, CheckCircle2, XCircle, Eye, Calendar, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useMyAllQuizResults } from "@/lib/hooks/useLms"
import { Header } from "@lms/components/header"

export default function TestsPage() {
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all")
  const { results, loading, error, fetchResults } = useMyAllQuizResults()

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const filteredResults = results.filter((result) => {
    if (filter === "all") return true
    if (filter === "passed") return result.isPassed
    if (filter === "failed") return !result.isPassed
    return true
  })

  const stats = {
    total: results.length,
    passed: results.filter((r) => r.isPassed).length,
    failed: results.filter((r) => !r.isPassed).length,
    avgScore: results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0,
  }

  // Loading state
  if (loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải kết quả...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-medium mb-2">Không thể tải kết quả bài kiểm tra</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message || 'Đã có lỗi xảy ra'}</p>
        <Button onClick={() => fetchResults()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bài kiểm tra</h1>
          <p className="text-muted-foreground">Xem lại kết quả các bài kiểm tra đã hoàn thành</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchResults()} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bài</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Bài kiểm tra đã làm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đạt yêu cầu</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <p className="text-xs text-muted-foreground">Bài đạt điểm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa đạt</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Cần làm lại</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
            <p className="text-xs text-muted-foreground">Trung bình tất cả bài</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
          <TabsTrigger value="passed">Đạt ({stats.passed})</TabsTrigger>
          <TabsTrigger value="failed">Chưa đạt ({stats.failed})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6 space-y-4">
          {filteredResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">Chưa có bài kiểm tra nào</p>
              </CardContent>
            </Card>
          ) : (
            filteredResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{result.quizTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>Lần thử {result.attemptNumber}</span>
                        {result.studentName && <span>• {result.studentName}</span>}
                      </CardDescription>
                    </div>
                    <Badge variant={result.isPassed ? "default" : "destructive"} className="ml-2">
                      {result.isPassed ? "Đạt" : "Chưa đạt"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Điểm số</span>
                        <span className="font-semibold">
                          {result.score}% ({result.correctAnswers}/{result.totalQuestions} câu đúng)
                        </span>
                      </div>
                      <Progress value={result.score} className="h-2" />
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{result.timeTaken} phút</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(result.takenAt).toLocaleDateString("vi-VN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    {result.feedback && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">{result.feedback}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/authorized/lms/app/student/tests/${result.id}/review`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

