"use client"

import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Progress } from "@lms/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { ArrowLeft, Mail, Calendar, TrendingUp, Award, Clock, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useStudentEnrollmentDetail } from "@/lib/hooks/useStudentEnrollmentDetail"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function StudentDetailPage({ params }: { params: { id: string; studentId: string } }) {
  const courseId = parseInt(params.id)
  const studentId = parseInt(params.studentId)
  
  const { data, loading, error, refetch } = useStudentEnrollmentDetail(courseId, studentId)
  const { enrollment, quizResults, stats } = data

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Chi tiết học viên" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải thông tin học viên...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !enrollment) {
    return (
      <div className="flex flex-col">
        <Header title="Chi tiết học viên" />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
            <Button variant="ghost" className="mb-6" asChild>
              <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>

            <Card className="border-destructive">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-2">Lỗi tải dữ liệu</h3>
                  <p className="text-sm text-muted-foreground">{error || 'Không tìm thấy thông tin học viên'}</p>
                </div>
                <Button onClick={refetch} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Format dates
  const enrolledDate = enrollment.enrolledAt 
    ? format(new Date(enrollment.enrolledAt), "dd/MM/yyyy", { locale: vi })
    : "N/A"

  // Group quiz results by quizId to get best attempts
  const quizResultsByQuiz = quizResults.reduce((acc, result) => {
    if (!acc[result.quizId]) {
      acc[result.quizId] = []
    }
    acc[result.quizId].push(result)
    return acc
  }, {} as Record<number, typeof quizResults>)

  // Get best result for each quiz
  const bestQuizResults = Object.entries(quizResultsByQuiz).map(([quizId, attempts]) => {
    const bestAttempt = attempts.reduce((best, current) => 
      current.score > best.score ? current : best
    )
    const allAttempts = attempts.sort((a, b) => 
      new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    )
    return {
      ...bestAttempt,
      attempts: attempts.length,
      allAttempts,
    }
  })

  return (
    <div className="flex flex-col">
      <Header title="Chi tiết học viên" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>

          {/* Student Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="text-2xl">
                      {enrollment.studentName ? enrollment.studentName.charAt(0).toUpperCase() : 'S'}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-2xl font-bold">
                      {enrollment.studentName || `Học viên #${studentId}`}
                    </h1>
                    <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                      {enrollment.studentEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {enrollment.studentEmail}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Đăng ký: {enrolledDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={enrollment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {enrollment.status === 'ACTIVE' ? 'Đang học' : 
                           enrollment.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={refetch} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Làm mới
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tiến độ</p>
                    <p className="mt-2 text-3xl font-bold">{enrollment.progress || 0}%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-primary opacity-40" />
                </div>
                <Progress value={enrollment.progress || 0} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bài kiểm tra</p>
                    <p className="mt-2 text-3xl font-bold">
                      {stats.completedQuizzes}/{stats.totalQuizzes}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-success opacity-40" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Đã hoàn thành {stats.completedQuizzes} bài
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng lượt làm</p>
                    <p className="mt-2 text-3xl font-bold">{stats.totalAttempts}</p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-500 opacity-40" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Trung bình {stats.totalQuizzes > 0 ? (stats.totalAttempts / stats.totalQuizzes).toFixed(1) : 0} lần/bài
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm TB</p>
                    <p className="mt-2 text-3xl font-bold">
                      {stats.averageScore.toFixed(0)}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-warning opacity-40" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Đạt: {stats.passedQuizzes} | Chưa đạt: {stats.failedQuizzes}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="quizzes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="quizzes">Kết quả bài kiểm tra</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả bài kiểm tra ({bestQuizResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {bestQuizResults.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Học viên chưa làm bài kiểm tra nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bestQuizResults.map((quizResult) => {
                        const latestAttempt = quizResult.allAttempts[0]
                        const takenDate = latestAttempt.takenAt 
                          ? format(new Date(latestAttempt.takenAt), "dd/MM/yyyy HH:mm", { locale: vi })
                          : "N/A"

                        return (
                          <div key={quizResult.quizId} className="rounded-lg border p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold">{quizResult.quizTitle || `Bài kiểm tra #${quizResult.quizId}`}</h3>
                                  <Badge variant={quizResult.isPassed ? "default" : "destructive"}>
                                    {quizResult.isPassed ? "Đạt" : "Chưa đạt"}
                                  </Badge>
                                </div>

                                <div className="mt-3 grid gap-4 md:grid-cols-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Điểm cao nhất</p>
                                    <p className="text-lg font-bold">
                                      {quizResult.score.toFixed(1)}/100
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">Số lần làm</p>
                                    <p className="text-lg font-bold">{quizResult.attempts}</p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">Câu đúng</p>
                                    <p className="text-lg font-bold">
                                      {quizResult.correctAnswers}/{quizResult.totalQuestions}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">Lần cuối</p>
                                    <p className="text-sm font-bold">{takenDate}</p>
                                  </div>
                                </div>

                                <Progress value={quizResult.score} className="mt-4" />
                              </div>

                              <Button variant="outline" size="sm" className="ml-4 bg-transparent" asChild>
                                <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quizResult.quizId}/results`}>
                                  Xem chi tiết
                                </Link>
                              </Button>
                            </div>

                            {/* Show all attempts */}
                            {quizResult.allAttempts.length > 1 && (
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-sm font-semibold mb-2">Lịch sử làm bài:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {quizResult.allAttempts.map((attempt, idx) => (
                                    <div key={attempt.id} className="text-sm p-2 rounded bg-muted">
                                      <p className="text-xs text-muted-foreground">
                                        Lần {quizResult.allAttempts.length - idx}
                                      </p>
                                      <p className="font-semibold">{attempt.score.toFixed(1)} điểm</p>
                                      <p className="text-xs">
                                        {format(new Date(attempt.takenAt), "dd/MM HH:mm", { locale: vi })}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
