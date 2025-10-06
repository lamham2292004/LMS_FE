import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { BookOpen, Users, DollarSign, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Tổng khóa học",
    value: "8",
    icon: BookOpen,
    trend: "+2 tháng này",
    color: "text-primary",
  },
  {
    title: "Tổng học viên",
    value: "1,234",
    icon: Users,
    trend: "+156 tháng này",
    color: "text-blue-500",
  },
  {
    title: "Doanh thu",
    value: "45.2M",
    icon: DollarSign,
    trend: "+12% tháng này",
    color: "text-success",
  },
  {
    title: "Đánh giá TB",
    value: "4.8",
    icon: TrendingUp,
    trend: "Tăng 0.2 điểm",
    color: "text-warning",
  },
]

const courses = [
  {
    id: 1,
    title: "Lập trình Python cơ bản",
    students: 234,
    revenue: "12.5M",
    rating: 4.8,
    status: "published",
    lastUpdated: "2 ngày trước",
  },
  {
    id: 2,
    title: "Web Development với React",
    students: 189,
    revenue: "9.8M",
    rating: 4.7,
    status: "published",
    lastUpdated: "1 tuần trước",
  },
  {
    id: 3,
    title: "Machine Learning nâng cao",
    students: 0,
    revenue: "0",
    rating: 0,
    status: "draft",
    lastUpdated: "3 ngày trước",
  },
]

export default function LecturerDashboard() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard Giảng viên" />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color} opacity-40`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Khóa học của tôi</h2>
            <Button asChild>
              <Link href="/lecturer/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Tạo khóa học mới
              </Link>
            </Button>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                      <Badge variant={course.status === "published" ? "default" : "secondary"}>
                        {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{course.students} học viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{course.revenue}đ</span>
                      </div>
                      {course.status === "published" && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{course.rating} sao</span>
                        </div>
                      )}
                      <span>Cập nhật: {course.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/lecturer/courses/${course.id}`}>Quản lý</Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/lecturer/courses/${course.id}/edit`}>Chỉnh sửa</Link>
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
