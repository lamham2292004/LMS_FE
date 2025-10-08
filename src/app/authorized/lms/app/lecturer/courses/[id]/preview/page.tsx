import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Clock, Users, Star, BookOpen, Award, Play, FileText, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LecturerCoursePreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Xem trước khóa học" />

      <div className="flex-1 p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/edit`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại chỉnh sửa
            </Link>
          </Button>
        </div>

        {/* Preview Banner */}
        <div className="mb-6 rounded-lg bg-warning/10 border border-warning p-4">
          <p className="text-sm font-semibold text-warning">
            🔍 Chế độ xem trước - Đây là cách học viên sẽ nhìn thấy khóa học của bạn
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
              </div>

              <h1 className="mb-4 text-4xl font-bold">Lập trình Python cơ bản</h1>

              <p className="mb-6 text-lg text-muted-foreground">
                Khóa học Python toàn diện dành cho người mới bắt đầu. Học từ cú pháp cơ bản đến lập trình hướng đối
                tượng.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(156 đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>234 học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>12 giờ</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>45 bài học</span>
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

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList>
                <TabsTrigger value="curriculum">Chương trình học</TabsTrigger>
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
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

                      <h4 className="mt-6 font-semibold">Yêu cầu</h4>
                      <ul>
                        <li>Không cần kiến thức lập trình trước đó</li>
                        <li>Máy tính có kết nối internet</li>
                        <li>Tinh thần học hỏi và thực hành</li>
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

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-6 text-xl font-semibold">Đánh giá từ học viên</h3>

                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>NVA</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">Nguyễn Văn A</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Khóa học rất hay và dễ hiểu! Giảng viên giải thích rất chi tiết và có nhiều ví dụ thực tế.
                        </p>
                      </div>

                      <div className="border-b pb-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>TTB</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">Trần Thị B</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                              ))}
                              <Star className="h-4 w-4 text-muted" />
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Nội dung tốt nhưng cần thêm ví dụ thực tế. Nhìn chung là khóa học đáng giá.
                        </p>
                      </div>
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

                <div className="space-y-3">
                  <Button className="w-full" size="lg" disabled>
                    Chế độ xem trước
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Thêm vào giỏ hàng
                  </Button>
                </div>

                <div className="mt-6 space-y-3 text-sm">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
