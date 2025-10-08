"use client"

import { useParams } from "next/navigation"
import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Progress } from "@lms/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Lock,
  Star,
  Users,
  FileText,
  Video
} from "lucide-react"
import Link from "next/link"

// Mock data - trong thực tế sẽ fetch từ API dựa trên id
const courseData = {
  1: {
    id: 1,
    title: "Lập trình Python cơ bản",
    instructor: "Nguyễn Văn B",
    category: "Lập trình",
    level: "Cơ bản",
    rating: 4.8,
    students: 1234,
    duration: "40 giờ",
    progress: 65,
    completedLessons: 13,
    totalLessons: 20,
    description: "Khóa học Python cơ bản giúp bạn nắm vững các kiến thức nền tảng về lập trình Python. Từ cú pháp cơ bản đến các khái niệm lập trình hướng đối tượng.",
    enrolled: true,
  },
  2: {
    id: 2,
    title: "Web Development với React",
    instructor: "Trần Thị C",
    category: "Web Development",
    level: "Trung cấp",
    rating: 4.7,
    students: 856,
    duration: "35 giờ",
    progress: 40,
    completedLessons: 8,
    totalLessons: 20,
    description: "Học cách xây dựng ứng dụng web hiện đại với React. Từ components, hooks đến state management và routing.",
    enrolled: true,
  },
  3: {
    id: 3,
    title: "Cơ sở dữ liệu SQL",
    instructor: "Lê Văn D",
    category: "Database",
    level: "Cơ bản",
    rating: 4.6,
    students: 987,
    duration: "25 giờ",
    progress: 80,
    completedLessons: 16,
    totalLessons: 20,
    description: "Nắm vững SQL và quản lý cơ sở dữ liệu quan hệ. Học cách thiết kế, truy vấn và tối ưu hóa database.",
    enrolled: true,
  },
  4: {
    id: 4,
    title: "HTML & CSS Fundamentals",
    instructor: "Phạm Thị E",
    category: "Web Development",
    level: "Cơ bản",
    rating: 4.9,
    students: 2341,
    duration: "20 giờ",
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    description: "Khóa học HTML & CSS từ cơ bản đến nâng cao. Học cách xây dựng giao diện web responsive và đẹp mắt.",
    enrolled: true,
    completed: true,
    score: 9.2,
  },
  5: {
    id: 5,
    title: "JavaScript Cơ bản",
    instructor: "Hoàng Văn F",
    category: "Lập trình",
    level: "Cơ bản",
    rating: 4.8,
    students: 1567,
    duration: "30 giờ",
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    description: "Học JavaScript từ đầu. Nắm vững cú pháp, DOM manipulation, async programming và ES6+.",
    enrolled: true,
    completed: true,
    score: 8.8,
  },
  6: {
    id: 6,
    title: "Machine Learning cơ bản",
    instructor: "TS. Nguyễn Văn G",
    category: "AI & Machine Learning",
    level: "Trung cấp",
    rating: 4.8,
    students: 1234,
    duration: "40 giờ",
    price: 1500000,
    description: "Khóa học Machine Learning cơ bản với Python. Học các thuật toán ML phổ biến và ứng dụng thực tế.",
    enrolled: false,
  },
}

const lessons = [
  {
    id: 1,
    title: "Giới thiệu về Python",
    duration: "15:30",
    type: "video",
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: "Cài đặt môi trường",
    duration: "20:45",
    type: "video",
    completed: true,
    locked: false,
  },
  {
    id: 3,
    title: "Biến và kiểu dữ liệu",
    duration: "25:15",
    type: "video",
    completed: true,
    locked: false,
  },
  {
    id: 4,
    title: "Câu lệnh điều kiện",
    duration: "18:30",
    type: "video",
    completed: false,
    locked: false,
  },
  {
    id: 5,
    title: "Vòng lặp",
    duration: "22:00",
    type: "video",
    completed: false,
    locked: false,
  },
  {
    id: 6,
    title: "Hàm trong Python",
    duration: "30:00",
    type: "video",
    completed: false,
    locked: true,
  },
]

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = parseInt(params.id as string)
  const course = courseData[courseId as keyof typeof courseData]

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Không tìm thấy khóa học</h1>
          <Button asChild>
            <Link href="/authorized/lms/app/student/courses">Quay lại</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title={course.title} showCart />

      <div className="flex-1 p-6">
        {/* Course Header */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
            {course.completed && <Badge className="bg-success text-white">Đã hoàn thành</Badge>}
          </div>

          <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
          
          <p className="mb-6 text-lg text-muted-foreground">{course.description}</p>

          <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <span className="font-semibold">{course.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{course.students.toLocaleString()} học viên</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{course.totalLessons} bài học</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Giảng viên: {course.instructor}</p>

          {course.enrolled && !course.completed && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Tiến độ học tập</span>
                <span className="font-semibold">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-3" />
              <p className="mt-2 text-sm text-muted-foreground">
                Đã hoàn thành {course.completedLessons}/{course.totalLessons} bài học
              </p>
            </div>
          )}

          {course.completed && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2">
                <Award className="h-5 w-5 text-success" />
                <span className="font-semibold text-success">Điểm: {course.score}/10</span>
              </div>
              <Button>
                <Award className="mr-2 h-4 w-4" />
                Xem chứng chỉ
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="lessons" className="space-y-6">
              <TabsList>
                <TabsTrigger value="lessons">Nội dung khóa học</TabsTrigger>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Danh sách bài học</h2>
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                            lesson.locked
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : lesson.locked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Play className="h-5 w-5 text-primary" />
                            )}

                            <div>
                              <p className="font-semibold">{lesson.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Video className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>

                          {!lesson.locked && (
                            <Button size="sm" variant={lesson.completed ? "outline" : "default"} asChild>
                              <Link href={`/authorized/lms/app/student/courses/${courseId}/learn`}>
                                {lesson.completed ? "Xem lại" : "Học ngay"}
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Về khóa học này</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 font-semibold">Mô tả</h3>
                        <p className="text-muted-foreground">{course.description}</p>
                      </div>

                      <div>
                        <h3 className="mb-2 font-semibold">Bạn sẽ học được gì</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Nắm vững kiến thức cơ bản và nâng cao</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Thực hành với các dự án thực tế</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Nhận chứng chỉ sau khi hoàn thành</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="mb-2 font-semibold">Yêu cầu</h3>
                        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                          <li>Không cần kiến thức nền tảng</li>
                          <li>Máy tính có kết nối internet</li>
                          <li>Tinh thần học hỏi và kiên trì</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Đánh giá từ học viên</h2>
                    <div className="mb-6 flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{course.rating}</div>
                        <div className="flex items-center gap-1 text-warning">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Đánh giá khóa học</p>
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground">Chưa có đánh giá nào</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Thông tin khóa học</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Giảng viên</span>
                    <span className="font-semibold">{course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cấp độ</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Thời lượng</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bài học</span>
                    <span className="font-semibold">{course.totalLessons}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Học viên</span>
                    <span className="font-semibold">{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {course.enrolled ? (
                  <div className="mt-6 space-y-2">
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/authorized/lms/app/student/courses/${courseId}/learn`}>
                        <Play className="mr-2 h-4 w-4" />
                        {course.completed ? "Xem lại khóa học" : "Tiếp tục học"}
                      </Link>
                    </Button>
                    {course.completed && (
                      <Button className="w-full" variant="outline" size="lg">
                        <Award className="mr-2 h-4 w-4" />
                        Xem chứng chỉ
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="mb-4 text-center">
                      <div className="text-3xl font-bold text-primary">
                        {course.price?.toLocaleString()}đ
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Đăng ký ngay
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
