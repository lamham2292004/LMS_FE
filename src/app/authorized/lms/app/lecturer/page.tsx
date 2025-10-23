"use client"

import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLecturerCourses } from "@/lib/hooks/useLecturerCourses"

export default function LecturerDashboard() {
  const { courses, stats, loading, error } = useLecturerCourses()

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Dashboard Giảng viên" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Dashboard Giảng viên" />
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">Lỗi: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      title: "Tổng khóa học",
      value: stats?.totalCourses.toString() || "0",
      icon: BookOpen,
      trend: `${stats?.publishedCourses || 0} đã xuất bản`,
      color: "text-primary",
    },
    {
      title: "Tổng học viên",
      value: stats?.totalStudents.toString() || "0",
      icon: Users,
      trend: "Trên tất cả khóa học",
      color: "text-blue-500",
    },
    {
      title: "Doanh thu",
      value: `${((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      trend: "VNĐ tổng cộng",
      color: "text-success",
    },
    {
      title: "Đánh giá TB",
      value: stats?.averageRating.toFixed(1) || "0.0",
      icon: TrendingUp,
      trend: "Trên tất cả khóa học",
      color: "text-warning",
    },
  ]

  // Get recent courses (top 5)
  const recentCourses = courses.slice(0, 5)
  return (
    <div className="flex flex-col">
      <Header title="Dashboard Giảng viên" />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
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
              <Link href="/authorized/lms/app/lecturer/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Tạo khóa học mới
              </Link>
            </Button>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {recentCourses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chưa có khóa học nào</p>
                <Button asChild className="mt-4">
                  <Link href="/authorized/lms/app/lecturer/courses/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo khóa học đầu tiên
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            recentCourses.map((course) => (
              <Card key={course.id} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <Badge variant={course.status === "OPEN" ? "default" : "secondary"}>
                          {course.status === "OPEN" ? "Đã xuất bản" : "Bản nháp"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{course.studentCount} học viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{(course.revenue / 1000000).toFixed(1)}M đ</span>
                        </div>
                        {course.status === "OPEN" && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>{course.rating} sao</span>
                          </div>
                        )}
                        <span>Cập nhật: {new Date(course.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/authorized/lms/app/lecturer/courses/${course.id}`}>Quản lý</Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/authorized/lms/app/lecturer/courses/${course.id}/edit`}>Chỉnh sửa</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {courses.length > 5 && (
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link href="/authorized/lms/app/lecturer/courses">Xem tất cả khóa học</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
