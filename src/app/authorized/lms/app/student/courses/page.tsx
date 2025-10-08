import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Progress } from "@lms/components/ui/progress"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Play, Clock, Award } from "lucide-react"
import Link from "next/link"

const enrolledCourses = [
  {
    id: 1,
    title: "Lập trình Python cơ bản",
    category: "Lập trình",
    progress: 65,
    completedLessons: 13,
    totalLessons: 20,
    image: "python programming course thumbnail",
    instructor: "Nguyễn Văn B",
    level: "Cơ bản",
  },
  {
    id: 2,
    title: "Web Development với React",
    category: "Web Development",
    progress: 40,
    completedLessons: 8,
    totalLessons: 20,
    image: "react web development thumbnail",
    instructor: "Trần Thị C",
    level: "Trung cấp",
  },
  {
    id: 3,
    title: "Cơ sở dữ liệu SQL",
    category: "Database",
    progress: 80,
    completedLessons: 16,
    totalLessons: 20,
    image: "SQL database course thumbnail",
    instructor: "Lê Văn D",
    level: "Cơ bản",
  },
]

const completedCourses = [
  {
    id: 4,
    title: "HTML & CSS Fundamentals",
    category: "Web Development",
    completedDate: "15/03/2025",
    score: 9.2,
    image: "HTML CSS course thumbnail",
    instructor: "Phạm Thị E",
    certificate: true,
  },
  {
    id: 5,
    title: "JavaScript Cơ bản",
    category: "Lập trình",
    completedDate: "28/02/2025",
    score: 8.8,
    image: "JavaScript course thumbnail",
    instructor: "Hoàng Văn F",
    certificate: true,
  },
]

export default function MyCoursesPage() {
  return (
    <div className="flex flex-col">
      <Header title="Khóa học của tôi" showCart />

      <div className="flex-1 p-6">
        {/* Stats Summary */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số cúp</p>
                  <p className="text-3xl font-bold text-primary">12/867</p>
                </div>
                <Award className="h-12 w-12 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng thời lượng</p>
                  <p className="text-3xl font-bold">24 giờ</p>
                </div>
                <Clock className="h-12 w-12 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Khóa học hiện tại</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <Play className="h-12 w-12 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="learning" className="space-y-6">
          <TabsList>
            <TabsTrigger value="learning">Đang học</TabsTrigger>
            <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={`/course-${course.id}.jpg?height=200&width=400&query=${course.image}`}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>

                    <p className="mb-3 text-sm text-muted-foreground">Giảng viên: {course.instructor}</p>

                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                      <p className="text-xs text-muted-foreground">
                        Đã học {course.completedLessons}/{course.totalLessons} bài
                      </p>
                    </div>

                    <Link href={`/authorized/lms/app/student/courses/${course.id}`}>
                      <Button className="w-full">Tiếp tục học</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course) => (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={`/course-${course.id}.jpg?height=200&width=400&query=${course.image}`}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge className="bg-success text-white">Hoàn thành</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>

                    <p className="mb-3 text-sm text-muted-foreground">Giảng viên: {course.instructor}</p>

                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Điểm số</span>
                        <span className="text-lg font-bold text-success">{course.score}/10</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Hoàn thành: {course.completedDate}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`/authorized/lms/app/student/courses/${course.id}`}>Xem lại</Link>
                      </Button>
                      {course.certificate && <Button className="flex-1">Chứng chỉ</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
