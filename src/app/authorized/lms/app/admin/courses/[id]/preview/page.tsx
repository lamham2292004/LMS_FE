import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Play,
  FileText,
  CheckCircle2,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"

export default function AdminCoursePreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Xem trước khóa học" />

      <div className="flex-1 p-6">
        {/* Back Button & Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              Phê duyệt
            </Button>
          </div>
        </div>

        {/* Admin Review Banner */}
        <div className="mb-6 rounded-lg bg-blue-500/10 border border-blue-500 p-4">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            👨‍💼 Chế độ xem trước Admin - Kiểm tra khóa học trước khi phê duyệt
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <Badge>Lập trình</Badge>
                <Badge variant="outline">Cơ bản</Badge>
                <Badge variant="secondary">Chờ duyệt</Badge>
              </div>

              <h1 className="mb-4 text-4xl font-bold">Lập trình Python cơ bản</h1>

              <p className="mb-6 text-lg text-muted-foreground">
                Khóa học Python toàn diện dành cho người mới bắt đầu. Học từ cú pháp cơ bản đến lập trình hướng đối
                tượng.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Giảng viên: Nguyễn Văn B</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>12 giờ</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>45 bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>10 bài kiểm tra</span>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="mb-8 aspect-video overflow-hidden rounded-lg bg-muted">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">Video giới thiệu khóa học</p>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-semibold">Checklist kiểm duyệt</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Thông tin khóa học đầy đủ và rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Có ít nhất 5 bài học</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Video và tài liệu chất lượng tốt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Giá cả hợp lý</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>Nội dung phù hợp với chính sách</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList>
                <TabsTrigger value="curriculum">Chương trình học</TabsTrigger>
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                <TabsTrigger value="pricing">Giá & Chính sách</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Nội dung khóa học</h3>

                    <div className="space-y-4">
                      {/* Chapter 1 */}
                      <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b p-4">
                          <h4 className="font-semibold">Chương 1: Giới thiệu Python</h4>
                          <span className="text-sm text-muted-foreground">5 bài học • 1.5 giờ</span>
                        </div>
                        <div className="divide-y">
                          <div className="flex items-center gap-3 p-4">
                            <Play className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Giới thiệu về Python</span>
                            <span className="text-sm text-muted-foreground">15:30</span>
                          </div>
                          <div className="flex items-center gap-3 p-4">
                            <Play className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Cài đặt môi trường</span>
                            <span className="text-sm text-muted-foreground">20:45</span>
                          </div>
                          <div className="flex items-center gap-3 p-4">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Bài tập thực hành</span>
                            <span className="text-sm text-muted-foreground">Quiz</span>
                          </div>
                        </div>
                      </div>

                      {/* Chapter 2 */}
                      <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b p-4">
                          <h4 className="font-semibold">Chương 2: Cú pháp cơ bản</h4>
                          <span className="text-sm text-muted-foreground">8 bài học • 2.5 giờ</span>
                        </div>
                        <div className="divide-y">
                          <div className="flex items-center gap-3 p-4">
                            <Play className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Biến và kiểu dữ liệu</span>
                            <span className="text-sm text-muted-foreground">25:00</span>
                          </div>
                          <div className="flex items-center gap-3 p-4">
                            <Play className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1">Toán tử và biểu thức</span>
                            <span className="text-sm text-muted-foreground">18:30</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Về khóa học này</h3>
                    <div className="prose max-w-none">
                      <p>
                        Khóa học Python toàn diện dành cho người mới bắt đầu. Học từ cú pháp cơ bản đến lập trình hướng
                        đối tượng, xử lý file, và làm việc với thư viện phổ biến.
                      </p>

                      <h4 className="mt-6 font-semibold">Bạn sẽ học được gì?</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
                          <span>Nắm vững cú pháp Python và các khái niệm lập trình cơ bản</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
                          <span>Xây dựng ứng dụng console và làm việc với file</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
                          <span>Hiểu và áp dụng lập trình hướng đối tượng</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-success" />
                          <span>Sử dụng thư viện phổ biến như NumPy, Pandas</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback>NVB</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-semibold">Nguyễn Văn B</h3>
                        <p className="mb-4 text-muted-foreground">Senior Python Developer</p>

                        <div className="mb-4 flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-warning" />
                            <span>4.9 đánh giá giảng viên</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>5,234 học viên</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>12 khóa học</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Đã xác minh</Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground">
                          Với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm, tôi đã làm việc với nhiều dự án
                          lớn và giảng dạy Python cho hàng nghìn học viên.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-semibold">Thông tin giá</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <span className="text-muted-foreground">Giá gốc</span>
                        <span className="text-xl font-bold">2.000.000đ</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <span className="text-muted-foreground">Giá khuyến mãi</span>
                        <span className="text-xl font-bold text-primary">1.500.000đ</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <span className="text-muted-foreground">Hoa hồng nền tảng (20%)</span>
                        <span className="text-xl font-bold">300.000đ</span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                        <span className="font-semibold">Giảng viên nhận</span>
                        <span className="text-2xl font-bold text-success">1.200.000đ</span>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-blue-500/10 p-4">
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        💡 Giá khóa học nằm trong khoảng hợp lý so với thị trường và nội dung cung cấp.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-muted">
                  <img src="/course-1.jpg" alt="Course" className="h-full w-full object-cover" />
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">1.500.000đ</span>
                    <span className="text-lg text-muted-foreground line-through">2.000.000đ</span>
                  </div>
                  <Badge variant="destructive">Giảm 25%</Badge>
                </div>

                <div className="mb-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>12 giờ video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>45 bài học</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>10 bài kiểm tra</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Phê duyệt khóa học
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
