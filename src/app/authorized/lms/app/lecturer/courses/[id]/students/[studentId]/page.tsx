import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Calendar, TrendingUp, Award, Clock } from "lucide-react"
import Link from "next/link"

const studentData = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  enrolledDate: "15/03/2025",
  lastActive: "2 giờ trước",
  progress: 85,
  completedLessons: 17,
  totalLessons: 20,
  timeSpent: "24 giờ 30 phút",
}

const quizResults = [
  {
    id: 1,
    title: "Bài kiểm tra Module 1",
    score: 85,
    maxScore: 100,
    attempts: 2,
    lastAttempt: "20/03/2025",
    timeSpent: "25 phút",
    status: "passed",
  },
  {
    id: 2,
    title: "Bài kiểm tra Module 2",
    score: 92,
    maxScore: 100,
    attempts: 1,
    lastAttempt: "25/03/2025",
    timeSpent: "28 phút",
    status: "passed",
  },
  {
    id: 3,
    title: "Bài kiểm tra Module 3",
    score: 65,
    maxScore: 100,
    attempts: 3,
    lastAttempt: "28/03/2025",
    timeSpent: "32 phút",
    status: "failed",
  },
]

const lessonProgress = [
  { id: 1, title: "Giới thiệu về Python", completed: true, timeSpent: "45 phút", completedDate: "16/03/2025" },
  { id: 2, title: "Cài đặt môi trường", completed: true, timeSpent: "30 phút", completedDate: "17/03/2025" },
  { id: 3, title: "Biến và kiểu dữ liệu", completed: true, timeSpent: "1 giờ 15 phút", completedDate: "18/03/2025" },
  { id: 4, title: "Vòng lặp và điều kiện", completed: false, timeSpent: "20 phút", completedDate: null },
]

export default function StudentDetailPage({ params }: { params: { id: string; studentId: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Chi tiết học viên" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href={`/lecturer/courses/${params.id}`}>
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
                    <AvatarFallback className="text-2xl">{studentData.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-2xl font-bold">{studentData.name}</h1>
                    <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {studentData.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Đăng ký: {studentData.enrolledDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Hoạt động: {studentData.lastActive}
                      </div>
                    </div>
                  </div>
                </div>

                <Button>Gửi tin nhắn</Button>
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
                    <p className="mt-2 text-3xl font-bold">{studentData.progress}%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-primary opacity-40" />
                </div>
                <Progress value={studentData.progress} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bài học</p>
                    <p className="mt-2 text-3xl font-bold">
                      {studentData.completedLessons}/{studentData.totalLessons}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-success opacity-40" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian học</p>
                    <p className="mt-2 text-2xl font-bold">{studentData.timeSpent}</p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-500 opacity-40" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm TB</p>
                    <p className="mt-2 text-3xl font-bold">
                      {(quizResults.reduce((acc, q) => acc + q.score, 0) / quizResults.length).toFixed(0)}
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-warning opacity-40" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="quizzes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="quizzes">Kết quả bài kiểm tra</TabsTrigger>
              <TabsTrigger value="lessons">Tiến độ bài học</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả bài kiểm tra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizResults.map((quiz) => (
                      <div key={quiz.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{quiz.title}</h3>
                              <Badge variant={quiz.status === "passed" ? "default" : "destructive"}>
                                {quiz.status === "passed" ? "Đạt" : "Chưa đạt"}
                              </Badge>
                            </div>

                            <div className="mt-3 grid gap-4 md:grid-cols-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Điểm số</p>
                                <p className="text-lg font-bold">
                                  {quiz.score}/{quiz.maxScore}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Số lần làm</p>
                                <p className="text-lg font-bold">{quiz.attempts}</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Thời gian</p>
                                <p className="text-lg font-bold">{quiz.timeSpent}</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Lần cuối</p>
                                <p className="text-lg font-bold">{quiz.lastAttempt}</p>
                              </div>
                            </div>

                            <Progress value={(quiz.score / quiz.maxScore) * 100} className="mt-4" />
                          </div>

                          <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lessons">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ bài học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lessonProgress.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${lesson.completed ? "bg-success text-white" : "bg-muted"}`}
                          >
                            {lesson.completed ? "✓" : lesson.id}
                          </div>

                          <div>
                            <p className="font-semibold">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">Thời gian: {lesson.timeSpent}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {lesson.completed ? (
                            <>
                              <Badge>Hoàn thành</Badge>
                              <p className="mt-1 text-sm text-muted-foreground">{lesson.completedDate}</p>
                            </>
                          ) : (
                            <Badge variant="secondary">Đang học</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
