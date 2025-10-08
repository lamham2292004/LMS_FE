import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Plus, Edit, Trash2, Users, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"

const quizzes = [
  {
    id: 1,
    title: "Bài kiểm tra Module 1",
    questions: 10,
    duration: 30,
    passingScore: 70,
    attempts: 156,
    avgScore: 82,
    status: "published",
  },
  {
    id: 2,
    title: "Bài kiểm tra giữa khóa",
    questions: 20,
    duration: 45,
    passingScore: 75,
    attempts: 89,
    avgScore: 78,
    status: "published",
  },
  {
    id: 3,
    title: "Bài kiểm tra cuối khóa",
    questions: 30,
    duration: 60,
    passingScore: 80,
    attempts: 0,
    avgScore: 0,
    status: "draft",
  },
]

export default function QuizzesManagementPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Quản lý bài kiểm tra" />

      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bài kiểm tra</h1>
            <p className="text-muted-foreground">Quản lý các bài kiểm tra trong khóa học</p>
          </div>

          <Button asChild>
            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài kiểm tra
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng bài kiểm tra</p>
                  <p className="mt-2 text-3xl font-bold">{quizzes.length}</p>
                </div>
                <FileText className="h-12 w-12 text-primary opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng lượt làm</p>
                  <p className="mt-2 text-3xl font-bold">{quizzes.reduce((sum, q) => sum + q.attempts, 0)}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Điểm TB</p>
                  <p className="mt-2 text-3xl font-bold">
                    {Math.round(
                      quizzes.filter((q) => q.attempts > 0).reduce((sum, q) => sum + q.avgScore, 0) /
                        quizzes.filter((q) => q.attempts > 0).length,
                    )}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-success opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes List */}
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{quiz.title}</h3>
                      <Badge variant={quiz.status === "published" ? "default" : "secondary"}>
                        {quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <span>{quiz.questions} câu hỏi</span>
                      <span>•</span>
                      <span>{quiz.duration} phút</span>
                      <span>•</span>
                      <span>Điểm đạt: {quiz.passingScore}%</span>
                      {quiz.attempts > 0 && (
                        <>
                          <span>•</span>
                          <span>{quiz.attempts} lượt làm</span>
                          <span>•</span>
                          <span>Điểm TB: {quiz.avgScore}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quiz.id}/results`}>Kết quả</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quiz.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
