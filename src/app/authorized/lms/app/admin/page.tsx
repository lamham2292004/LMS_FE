"use client"

import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import {
  Users,
  BookOpen,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useAdminDashboard } from "@/lib/hooks/useAdminDashboard"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function AdminDashboardPage() {
  const { stats, recentEnrollments, pendingCourses, loading, error, refetch } = useAdminDashboard()

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Bảng điều khiển Admin" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải dữ liệu từ backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Bảng điều khiển Admin" />
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-2">Lỗi tải dữ liệu</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <Header title="Bảng điều khiển Admin" />

      <div className="flex-1 p-6">
        {/* Header with refresh button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
            <p className="text-muted-foreground">Dữ liệu từ LMS Backend</p>
          </div>
          <Button onClick={refetch} variant="outline" size="lg">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stats.totalEnrollments} lượt đăng ký
                  </p>
                </div>
                <Users className="h-12 w-12 text-primary opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng khóa học</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalCourses}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <Badge variant="default" className="text-xs">{stats.approvedCoursesCount} Đã duyệt</Badge>
                    <Badge variant="secondary" className="text-xs">{stats.pendingCoursesCount} Chờ duyệt</Badge>
                  </div>
                </div>
                <BookOpen className="h-12 w-12 text-blue-500 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="mt-2 text-3xl font-bold">
                    {stats.totalRevenue >= 1000000000 
                      ? `${(stats.totalRevenue / 1000000000).toFixed(1)}B`
                      : `${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {stats.totalRevenue.toLocaleString()}đ
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
                  <p className="text-sm text-muted-foreground">Đăng ký</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalEnrollments.toLocaleString()}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tổng lượt đăng ký khóa học
                  </p>
                </div>
                <ShoppingCart className="h-12 w-12 text-warning opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Đăng ký gần đây</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/authorized/lms/app/admin/courses">Xem tất cả</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chưa có đăng ký nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{enrollment.courseName}</p>
                          <p className="text-sm text-muted-foreground">{enrollment.studentName}</p>
                        </div>
                        <Badge variant={enrollment.status === "ACTIVE" ? "default" : "secondary"}>
                          {enrollment.status === "ACTIVE" ? "Đang học" : 
                           enrollment.status === "COMPLETED" ? "Hoàn thành" : "Đã hủy"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ID: {enrollment.id}</span>
                        <span className="font-semibold text-primary">{enrollment.coursePrice.toLocaleString()}đ</span>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {enrollment.enrolledAt 
                          ? format(new Date(enrollment.enrolledAt), "dd/MM/yyyy HH:mm", { locale: vi })
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Khóa học chờ duyệt</CardTitle>
                  <Badge variant="destructive">{pendingCourses.length}</Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/authorized/lms/app/admin/courses">Xem tất cả</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingCourses.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-2" />
                  <p className="text-muted-foreground">Không có khóa học chờ duyệt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <AlertCircle className="h-10 w-10 text-warning" />

                        <div>
                          <p className="font-semibold">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Teacher ID: {course.teacherId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Gửi lúc: {course.createdAt 
                              ? format(new Date(course.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/authorized/lms/app/admin/courses/${course.id}/preview`}>
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
