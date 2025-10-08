"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Progress } from "@lms/components/ui/progress"
import { Trophy, Clock, CheckCircle2, XCircle, Eye, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data - trong thực tế sẽ fetch từ API
const quizResults = [
  {
    id: 1,
    courseId: 1,
    courseName: "Lập trình Web với React & Next.js",
    quizTitle: "Kiểm tra giữa khóa - React Hooks",
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    timeSpent: "25 phút",
    completedAt: "2024-01-15T10:30:00",
    status: "passed",
    passingScore: 70,
  },
  {
    id: 2,
    courseId: 1,
    courseName: "Lập trình Web với React & Next.js",
    quizTitle: "Bài kiểm tra cuối khóa",
    score: 92,
    totalQuestions: 30,
    correctAnswers: 28,
    timeSpent: "40 phút",
    completedAt: "2024-01-20T14:15:00",
    status: "passed",
    passingScore: 80,
  },
  {
    id: 3,
    courseId: 2,
    courseName: "Python cho Data Science",
    quizTitle: "Quiz 1: Python Basics",
    score: 65,
    totalQuestions: 15,
    correctAnswers: 10,
    timeSpent: "18 phút",
    completedAt: "2024-01-18T09:20:00",
    status: "failed",
    passingScore: 70,
  },
  {
    id: 4,
    courseId: 3,
    courseName: "Machine Learning cơ bản",
    quizTitle: "Kiểm tra chương 1",
    score: 78,
    totalQuestions: 25,
    correctAnswers: 20,
    timeSpent: "35 phút",
    completedAt: "2024-01-22T16:45:00",
    status: "passed",
    passingScore: 75,
  },
]

export default function TestsPage() {
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all")

  const filteredResults = quizResults.filter((result) => {
    if (filter === "all") return true
    return result.status === filter
  })

  const stats = {
    total: quizResults.length,
    passed: quizResults.filter((r) => r.status === "passed").length,
    failed: quizResults.filter((r) => r.status === "failed").length,
    avgScore: Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bài kiểm tra</h1>
        <p className="text-muted-foreground">Xem lại kết quả các bài kiểm tra đã hoàn thành</p>
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
                        <span>{result.courseName}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={result.status === "passed" ? "default" : "destructive"} className="ml-2">
                      {result.status === "passed" ? "Đạt" : "Chưa đạt"}
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
                      <p className="text-xs text-muted-foreground">Điểm đạt: {result.passingScore}% trở lên</p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{result.timeSpent}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(result.completedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/authorized/lms/app/student/tests/${result.id}/review`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </Button>
                      {result.status === "failed" && (
                        <Button size="sm" asChild>
                          <Link href={`/authorized/lms/app/student/courses/${result.courseId}/learn`}>Làm lại</Link>
                        </Button>
                      )}
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
