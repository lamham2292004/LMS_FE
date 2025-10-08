import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle2, XCircle } from "lucide-react"

const quizStats = {
  totalAttempts: 156,
  avgScore: 82,
  passRate: 78,
  avgTime: 24,
}

const studentResults = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    score: 90,
    time: 22,
    attempts: 1,
    date: "25/03/2025 14:30",
    passed: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    score: 85,
    time: 26,
    attempts: 2,
    date: "25/03/2025 15:45",
    passed: true,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    score: 65,
    time: 28,
    attempts: 3,
    date: "26/03/2025 10:20",
    passed: false,
  },
]

const questionStats = [
  {
    id: 1,
    question: "Python là ngôn ngữ lập trình gì?",
    correctRate: 95,
    totalAnswers: 156,
  },
  {
    id: 2,
    question: "Cú pháp nào sau đây đúng để khai báo biến trong Python?",
    correctRate: 88,
    totalAnswers: 156,
  },
  {
    id: 3,
    question: "Hàm nào dùng để in ra màn hình trong Python?",
    correctRate: 72,
    totalAnswers: 156,
  },
]

export default function QuizResultsPage({ params }: { params: { id: string; quizId: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Kết quả bài kiểm tra" />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Bài kiểm tra Module 1</h1>
          <p className="text-muted-foreground">Thống kê và kết quả chi tiết</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng lượt làm</p>
                  <p className="mt-2 text-3xl font-bold">{quizStats.totalAttempts}</p>
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
                  <p className="mt-2 text-3xl font-bold">{quizStats.avgScore}%</p>
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
                  <p className="mt-2 text-3xl font-bold">{quizStats.passRate}%</p>
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
                  <p className="mt-2 text-3xl font-bold">{quizStats.avgTime} phút</p>
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
                  <CardTitle>Kết quả của học viên</CardTitle>
                  <Button variant="outline" size="sm">
                    Xuất Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Điểm</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-lg font-bold ${result.passed ? "text-success" : "text-destructive"}`}>
                              {result.score}%
                            </p>
                            {result.passed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Thời gian</p>
                          <p className="font-semibold">{result.time} phút</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Lần làm</p>
                          <p className="font-semibold">{result.attempts}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Ngày làm</p>
                          <p className="font-semibold">{result.date}</p>
                        </div>

                        <Button variant="outline" size="sm">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích theo câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionStats.map((stat, index) => (
                    <div key={stat.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">Câu {index + 1}</Badge>
                            <Badge
                              variant={
                                stat.correctRate >= 80
                                  ? "default"
                                  : stat.correctRate >= 60
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {stat.correctRate >= 80 ? "Dễ" : stat.correctRate >= 60 ? "Trung bình" : "Khó"}
                            </Badge>
                          </div>
                          <p className="font-semibold">{stat.question}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Tỷ lệ đúng</p>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">{stat.correctRate}%</p>
                            {stat.correctRate >= 80 ? (
                              <TrendingUp className="h-5 w-5 text-success" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{stat.totalAnswers} lượt trả lời</span>
                        <span>•</span>
                        <span>
                          {Math.round((stat.correctRate / 100) * stat.totalAnswers)} trả lời đúng /{" "}
                          {stat.totalAnswers - Math.round((stat.correctRate / 100) * stat.totalAnswers)} trả lời sai
                        </span>
                      </div>

                      {stat.correctRate < 60 && (
                        <div className="mt-3 rounded-lg bg-warning/10 p-3">
                          <p className="text-sm text-warning">
                            Câu hỏi này có tỷ lệ đúng thấp. Bạn có thể cần xem xét lại độ khó hoặc cách diễn đạt.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
