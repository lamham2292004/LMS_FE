import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, DollarSign, Star, TrendingUp, Edit, Eye, Plus } from "lucide-react"
import Link from "next/link"

const courseStats = {
  totalStudents: 234,
  activeStudents: 189,
  completedStudents: 45,
  revenue: "12.5M",
  rating: 4.8,
  reviews: 156,
}

const students = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    progress: 85,
    enrolledDate: "15/03/2025",
    lastActive: "2 giờ trước",
    avgQuizScore: 87,
    completedQuizzes: 3,
    totalQuizzes: 4,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    progress: 60,
    enrolledDate: "20/03/2025",
    lastActive: "1 ngày trước",
    avgQuizScore: 75,
    completedQuizzes: 2,
    totalQuizzes: 4,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    progress: 100,
    enrolledDate: "10/03/2025",
    lastActive: "3 ngày trước",
    avgQuizScore: 95,
    completedQuizzes: 4,
    totalQuizzes: 4,
  },
]

const lessons = [
  { id: 1, title: "Giới thiệu về Python", views: 234, avgCompletion: 95 },
  { id: 2, title: "Cài đặt môi trường", views: 220, avgCompletion: 88 },
  { id: 3, title: "Biến và kiểu dữ liệu", views: 198, avgCompletion: 75 },
]

const reviews = [
  {
    id: 1,
    student: "Nguyễn Văn A",
    rating: 5,
    comment: "Khóa học rất hay và dễ hiểu!",
    date: "2 ngày trước",
  },
  {
    id: 2,
    student: "Trần Thị B",
    rating: 4,
    comment: "Nội dung tốt nhưng cần thêm ví dụ thực tế.",
    date: "5 ngày trước",
  },
]

export default function CourseManagementPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Quản lý khóa học" />

      <div className="flex-1 p-6">
        {/* Course Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Lập trình Python cơ bản</h1>
            <div className="flex items-center gap-4">
              <Badge>Đã xuất bản</Badge>
              <span className="text-sm text-muted-foreground">Cập nhật: 2 ngày trước</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/student/courses/${params.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem trước
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/lecturer/courses/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng học viên</p>
                  <p className="mt-2 text-3xl font-bold">{courseStats.totalStudents}</p>
                  <p className="mt-1 text-xs text-success">+12 tuần này</p>
                </div>
                <Users className="h-12 w-12 text-primary opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="mt-2 text-3xl font-bold">{courseStats.revenue}đ</p>
                  <p className="mt-1 text-xs text-success">+8% tuần này</p>
                </div>
                <DollarSign className="h-12 w-12 text-success opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đánh giá</p>
                  <p className="mt-2 text-3xl font-bold">{courseStats.rating}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{courseStats.reviews} đánh giá</p>
                </div>
                <Star className="h-12 w-12 text-warning opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hoàn thành</p>
                  <p className="mt-2 text-3xl font-bold">{courseStats.completedStudents}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((courseStats.completedStudents / courseStats.totalStudents) * 100)}% tổng số
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-500 opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Học viên</TabsTrigger>
            <TabsTrigger value="lessons">Bài học</TabsTrigger>
            <TabsTrigger value="quizzes">Bài kiểm tra</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Danh sách học viên</CardTitle>
                  <Button variant="outline" size="sm">
                    Xuất Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Tiến độ</p>
                          <p className="font-semibold">{student.progress}%</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Điểm TB</p>
                          <p className="font-semibold">{student.avgQuizScore}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Bài kiểm tra</p>
                          <p className="font-semibold">
                            {student.completedQuizzes}/{student.totalQuizzes}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Hoạt động</p>
                          <p className="font-semibold">{student.lastActive}</p>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/lecturer/courses/${params.id}/students/${student.id}`}>Xem chi tiết</Link>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Hiệu suất bài học</CardTitle>
                  <Button asChild>
                    <Link href={`/lecturer/courses/${params.id}/lessons/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm bài học
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex-1">
                        <p className="font-semibold">{lesson.title}</p>
                        <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                          <span>
                            <Eye className="mr-1 inline h-4 w-4" />
                            {lesson.views} lượt xem
                          </span>
                          <span>
                            <TrendingUp className="mr-1 inline h-4 w-4" />
                            {lesson.avgCompletion}% hoàn thành TB
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Thống kê
                        </Button>
                        <Button variant="outline" size="sm">
                          Chỉnh sửa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bài kiểm tra</CardTitle>
                  <Button asChild>
                    <Link href={`/lecturer/courses/${params.id}/quizzes/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo bài kiểm tra mới
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <p className="font-semibold">Kiểm tra cuối chương 1</p>
                      <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                        <span>10 câu hỏi</span>
                        <span>156 lượt làm</span>
                        <span>Điểm TB: 8.5/10</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lecturer/courses/${params.id}/quizzes/1/results`}>Kết quả</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lecturer/courses/${params.id}/quizzes/1/edit`}>Chỉnh sửa</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <p className="font-semibold">Bài tập thực hành Python</p>
                      <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                        <span>5 câu hỏi</span>
                        <span>142 lượt làm</span>
                        <span>Điểm TB: 7.8/10</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lecturer/courses/${params.id}/quizzes/2/results`}>Kết quả</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/lecturer/courses/${params.id}/quizzes/2/edit`}>Chỉnh sửa</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá từ học viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>{review.student.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{review.student}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-semibold">Tỷ lệ hoàn thành theo thời gian</h3>
                    <div className="h-64 rounded-lg bg-muted/50 flex items-center justify-center">
                      <p className="text-muted-foreground">Biểu đồ thống kê sẽ hiển thị ở đây</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold">Doanh thu theo tháng</h3>
                    <div className="h-64 rounded-lg bg-muted/50 flex items-center justify-center">
                      <p className="text-muted-foreground">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
