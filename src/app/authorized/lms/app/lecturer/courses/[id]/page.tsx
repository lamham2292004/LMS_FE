"use client"

import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Users, DollarSign, Star, TrendingUp, Edit, Eye, Plus, Loader2, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCourseDetails } from "@/lib/hooks/useCourseDetails"
import { getLmsImageUrl } from "@/lib/config"

export default function CourseManagementPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id)
  const { course, loading, error } = useCourseDetails(courseId)

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý khóa học" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý khóa học" />
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">Lỗi: {error || "Không tìm thấy khóa học"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const revenue = course.price * course.studentCount
  const rating = 4.5 // TODO: Calculate from actual reviews
  return (
    <div className="flex flex-col">
      <Header title="Quản lý khóa học" />

      <div className="flex-1 p-6">
        {/* Course Header with Image */}
        <div className="mb-6">
          <div className="flex items-start gap-6">
            {/* Course Image */}
            <div className="flex-shrink-0">
              <div className="relative h-48 w-80 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={getLmsImageUrl(course.img)}
                  alt={course.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/course-1.png";
                  }}
                />
              </div>
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
              <div className="mb-4 flex items-center gap-4">
                <Badge variant={course.status === "OPEN" ? "default" : "secondary"}>
                  {course.status === "OPEN" ? "Đã xuất bản" : course.status === "UPCOMING" ? "Sắp mở" : "Đã đóng"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Cập nhật: {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              {course.description && (
                <p className="mb-4 text-muted-foreground line-clamp-3">{course.description}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/preview`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trước
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng học viên</p>
                  <p className="mt-2 text-3xl font-bold">{course.studentCount}</p>
                  <p className="mt-1 text-xs text-success">{course.activeStudentCount} đang học</p>
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
                  <p className="mt-2 text-3xl font-bold">{(revenue / 1000000).toFixed(1)}M đ</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.price.toLocaleString('vi-VN')} đ/người
                  </p>
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
                  <p className="mt-2 text-3xl font-bold">{rating}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Đánh giá trung bình</p>
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
                  <p className="mt-2 text-3xl font-bold">{course.completedStudentCount}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.studentCount > 0 
                      ? Math.round((course.completedStudentCount / course.studentCount) * 100) 
                      : 0}% tổng số
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
                  {course.enrollments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-3 opacity-40" />
                      <p>Chưa có học viên nào đăng ký khóa học này</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Table Header */}
                      <div className="rounded-lg border bg-muted/50 p-4 font-semibold text-sm">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-1 text-center">STT</div>
                          <div className="col-span-1 text-center">ID</div>
                          <div className="col-span-3">Tên học viên</div>
                          <div className="col-span-2">Email</div>
                          <div className="col-span-2 text-center">Trạng thái</div>
                          <div className="col-span-1 text-center">Tiến độ</div>
                          <div className="col-span-2 text-right">Thao tác</div>
                        </div>
                      </div>

                      {/* Student Rows */}
                      {course.enrollments.map((enrollment, index) => (
                        <div key={enrollment.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* STT */}
                            <div className="col-span-1 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                {index + 1}
                              </span>
                            </div>

                            {/* Student ID */}
                            <div className="col-span-1 text-center">
                              <span className="text-sm font-mono text-muted-foreground">
                                #{enrollment.studentId}
                              </span>
                            </div>

                            {/* Tên học viên */}
                            <div className="col-span-3 flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-xs">
                                  {enrollment.studentName 
                                    ? enrollment.studentName.split(' ').slice(-2).map(n => n[0]).join('').toUpperCase()
                                    : enrollment.studentId.toString().slice(0, 2)
                                  }
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0">
                                <p className="font-semibold truncate">
                                  {enrollment.studentName || `Học viên #${enrollment.studentId}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit', 
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                              <p className="text-sm truncate" title={enrollment.studentEmail}>
                                {enrollment.studentEmail || '-'}
                              </p>
                            </div>

                            {/* Trạng thái */}
                            <div className="col-span-2 text-center">
                              <Badge variant={enrollment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {enrollment.status === 'ACTIVE' ? 'Đang học' : 
                                enrollment.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                              </Badge>
                            </div>

                            {/* Tiến độ */}
                            <div className="col-span-1 text-center">
                              <div className="space-y-1">
                                <p className="font-semibold text-sm">{enrollment.progress || 0}%</p>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full transition-all" 
                                    style={{ width: `${enrollment.progress || 0}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Thao tác */}
                            <div className="col-span-2 text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/students/${enrollment.studentId}`}>
                                  Xem chi tiết
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
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
                    <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/lessons/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm bài học
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(!course.lessons || course.lessons.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="mx-auto h-12 w-12 mb-3 opacity-40" />
                      <p>Chưa có bài học nào</p>
                      <Button asChild className="mt-4">
                        <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/lessons/new`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm bài học đầu tiên
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    course.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <p className="font-semibold">{lesson.title}</p>
                          <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                            <span>Thứ tự: {lesson.orderIndex}</span>
                            {lesson.duration && <span>Thời lượng: {lesson.duration} phút</span>}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/lessons/${lesson.id}/edit`}>
                              Chỉnh sửa
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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
                    <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo bài kiểm tra mới
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(!course.quizzes || course.quizzes.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="mx-auto h-12 w-12 mb-3 opacity-40" />
                      <p>Chưa có bài kiểm tra nào</p>
                      <Button asChild className="mt-4">
                        <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/new`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Tạo bài kiểm tra đầu tiên
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    course.quizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <p className="font-semibold">{quiz.title}</p>
                          <div className="mt-2 flex gap-6 text-sm text-muted-foreground">
                            <span>{quiz.questions?.length || 0} câu hỏi</span>
                            {quiz.timeLimit && <span>Thời gian: {quiz.timeLimit} phút</span>}
                            {quiz.passScore && <span>Điểm đạt: {quiz.passScore}%</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quiz.id}/results`}>
                              Kết quả
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/${quiz.id}/edit`}>
                              Chỉnh sửa
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="mx-auto h-12 w-12 mb-3 opacity-40" />
                  <p>Tính năng đánh giá đang được phát triển</p>
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
