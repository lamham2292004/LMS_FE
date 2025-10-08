import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Progress } from "@lms/components/ui/progress"
import { Trophy, Clock, BookOpen, Target, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <div className="flex flex-col">
      <Header title="Tổng quan" showCart />

      <div className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Xin chào, Nguyễn Văn A</h2>
                <p className="text-muted-foreground">
                  Hôm nay bạn đã sẵn sàng học chưa? Hãy tiếp tục hành trình của bạn!
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/authorized/lms/app/student/courses/1/learn">Tiếp tục học</Link>
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="h-32 w-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-16 w-16 text-blue-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thời lượng</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24 giờ</div>
              <p className="text-xs text-muted-foreground">+2 giờ tuần này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa học đang học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 khóa hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cúp đã đạt</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Top 10% học viên</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Điểm trung bình</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5/10</div>
              <p className="text-xs text-muted-foreground">Xuất sắc</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Khóa học đang học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: 1,
                title: "Lập trình Python cơ bản",
                progress: 65,
                lessons: "13/20 bài học",
                image: "python programming course",
              },
              {
                id: 2,
                title: "Web Development với React",
                progress: 40,
                lessons: "8/20 bài học",
                image: "react web development",
              },
              {
                id: 3,
                title: "Cơ sở dữ liệu SQL",
                progress: 80,
                lessons: "16/20 bài học",
                image: "database SQL course",
              },
            ].map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{course.title}</h3>
                  <div className="flex items-center gap-4">
                    <Progress value={course.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.lessons}</p>
                </div>
                <Button asChild>
                  <Link href={`/authorized/lms/app/student/courses/${course.id}/learn`}>
                    Tiếp tục học
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hồ sơ học tập</CardTitle>
              <Button variant="link">Xem tất cả</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Trình độ hiện tại</span>
                  <span className="text-sm text-muted-foreground">Trung cấp</span>
                </div>
                <Progress value={60} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Điểm bắt đầu</p>
                  <p className="text-2xl font-bold">5.0</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Điểm hiện tại</p>
                  <p className="text-2xl font-bold">8.5</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mục tiêu</p>
                  <p className="text-2xl font-bold">9.5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
