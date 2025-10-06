import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Clock, PlayCircle, CheckCircle2, Lock, FileText, Award, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock data - in real app, fetch based on params.id
const courseData = {
  id: 1,
  title: "Lập trình Python cơ bản",
  description:
    "Khóa học Python toàn diện dành cho người mới bắt đầu. Học từ cú pháp cơ bản đến lập trình hướng đối tượng, xử lý file, và làm việc với thư viện phổ biến.",
  image: "python programming course banner",
  instructor: {
    name: "Nguyễn Văn B",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Senior Python Developer",
    bio: "10+ năm kinh nghiệm lập trình Python, từng làm việc tại các công ty công nghệ hàng đầu.",
  },
  rating: 4.8,
  students: 1234,
  duration: "40 giờ",
  level: "Cơ bản",
  category: "Lập trình",
  price: 1500000,
  enrolled: true,
  progress: 65,
  completedLessons: 13,
  totalLessons: 20,
  lessons: [
    {
      id: 1,
      title: "Giới thiệu về Python",
      duration: "15:30",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 2,
      title: "Cài đặt môi trường",
      duration: "20:45",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 3,
      title: "Biến và kiểu dữ liệu",
      duration: "25:00",
      completed: true,
      locked: false,
      type: "video",
    },
    {
      id: 4,
      title: "Câu lệnh điều kiện",
      duration: "30:15",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 5,
      title: "Vòng lặp trong Python",
      duration: "28:30",
      completed: false,
      locked: false,
      type: "video",
    },
    {
      id: 6,
      title: "Bài kiểm tra Module 1",
      duration: "30:00",
      completed: false,
      locked: false,
      type: "quiz",
    },
    {
      id: 7,
      title: "Functions và Parameters",
      duration: "35:20",
      completed: false,
      locked: true,
      type: "video",
    },
  ],
  requirements: [
    "Máy tính có kết nối internet",
    "Không cần kiến thức lập trình trước đó",
    "Tinh thần học hỏi và kiên trì",
  ],
  outcomes: [
    "Hiểu rõ cú pháp và cấu trúc của Python",
    "Viết được các chương trình Python cơ bản",
    "Làm việc với file và xử lý dữ liệu",
    "Áp dụng lập trình hướng đối tượng",
    "Sử dụng các thư viện Python phổ biến",
  ],
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <Header title="Chi tiết khóa học" showCart />

      <div className="flex-1">
        {/* Course Hero */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
          <div className="container mx-auto px-6 py-12">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <Badge>{courseData.category}</Badge>
                  <Badge variant="outline">{courseData.level}</Badge>
                </div>

                <h1 className="mb-4 text-4xl font-bold text-balance">{courseData.title}</h1>

                <p className="mb-6 text-lg text-muted-foreground text-pretty">{courseData.description}</p>

                <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-semibold">{courseData.rating}</span>
                    <span className="text-muted-foreground">({courseData.students} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{courseData.students.toLocaleString()} học viên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>{courseData.totalLessons} bài học</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{courseData.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{courseData.instructor.title}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={`/course-${courseData.id}.jpg?height=300&width=400&query=${courseData.image}`}
                      alt={courseData.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="p-6">
                    {courseData.enrolled ? (
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tiến độ học tập</span>
                            <span className="font-semibold">{courseData.progress}%</span>
                          </div>
                          <Progress value={courseData.progress} />
                          <p className="mt-2 text-xs text-muted-foreground">
                            {courseData.completedLessons}/{courseData.totalLessons} bài học
                          </p>
                        </div>

                        <Button className="w-full" size="lg" asChild>
                          <Link href={`/student/courses/${courseData.id}/learn`}>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Tiếp tục học
                          </Link>
                        </Button>

                        <Button variant="outline" className="w-full bg-transparent">
                          <Award className="mr-2 h-4 w-4" />
                          Xem chứng chỉ
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">{courseData.price.toLocaleString()}đ</p>
                        </div>

                        <Button className="w-full" size="lg">
                          Đăng ký ngay
                        </Button>

                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href="/cart">Thêm vào giỏ hàng</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="curriculum" className="space-y-6">
            <TabsList>
              <TabsTrigger value="curriculum">Chương trình học</TabsTrigger>
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Nội dung khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {courseData.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : lesson.locked ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : lesson.type === "quiz" ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : (
                              <PlayCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium">
                              {index + 1}. {lesson.title}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{lesson.type === "quiz" ? "Bài kiểm tra" : "Video"}</span>
                              <span>•</span>
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        </div>

                        {!lesson.locked && courseData.enrolled && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/courses/${courseData.id}/learn?lesson=${lesson.id}`}>
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

            <TabsContent value="description">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Bạn sẽ học được gì</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {courseData.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Yêu cầu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {courseData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>NV</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="mb-1 text-2xl font-bold">{courseData.instructor.name}</h3>
                      <p className="mb-4 text-muted-foreground">{courseData.instructor.title}</p>
                      <p className="text-pretty">{courseData.instructor.bio}</p>

                      <div className="mt-6 flex gap-4">
                        <div>
                          <p className="text-2xl font-bold">{courseData.students.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Học viên</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">5</p>
                          <p className="text-sm text-muted-foreground">Khóa học</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{courseData.rating}</p>
                          <p className="text-sm text-muted-foreground">Đánh giá</p>
                        </div>
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
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-border pb-6 last:border-0">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>HV</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">Học viên {review}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-warning text-warning" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Khóa học rất hay và dễ hiểu. Giảng viên giải thích rất chi tiết và có nhiều ví dụ thực tế. Tôi
                        đã học được rất nhiều kiến thức bổ ích.
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
