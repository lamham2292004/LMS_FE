'use client';

import { useEffect } from 'react';
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Progress } from "@lms/components/ui/progress"
import { Trophy, Clock, BookOpen, Target, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useMyEnrollments, useCourses } from '@/lib/hooks/useLms';

export default function StudentDashboard() {
  const { enrollments, loading: enrollmentsLoading, fetchEnrollments } = useMyEnrollments();
  const { courses, loading: coursesLoading, fetchCourses } = useCourses();

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  // Stats
  const activeCourses = enrollments.filter(e => e.status === 'ACTIVE');
  const completedCourses = enrollments.filter(e => e.status === 'COMPLETED');
  const totalCourses = enrollments.length;
  const averageProgress = activeCourses.length > 0
    ? Math.round(activeCourses.reduce((sum, e) => sum + (e.progress || 0), 0) / activeCourses.length)
    : 0;

  // Get first 3 active courses for "Continue Learning" section
  const recentCourses = activeCourses.slice(0, 3);

  if (enrollmentsLoading || coursesLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Tổng quan" showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Tổng quan (LMS Backend)" showCart />

      <div className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Xin chào, Sinh viên! 👋</h2>
                <p className="text-muted-foreground">
                  {totalCourses === 0 
                    ? "Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!"
                    : activeCourses.length > 0
                    ? "Hôm nay bạn đã sẵn sàng học chưa? Hãy tiếp tục hành trình của bạn!"
                    : "Chúc mừng! Bạn đã hoàn thành tất cả khóa học đang theo học."
                  }
                </p>
                <div className="flex gap-2">
                  {activeCourses.length > 0 ? (
                    <Button className="mt-4" asChild>
                      <Link href={`/authorized/lms/app/student/courses/${activeCourses[0].courseId}/learn`}>
                        Tiếp tục học
                      </Link>
                    </Button>
                  ) : (
                    <Button className="mt-4" asChild>
                      <Link href="/authorized/lms/app/student/browse">Khám phá khóa học</Link>
                    </Button>
                  )}
                  <Button className="mt-4" variant="outline" asChild>
                    <Link href="/authorized/lms/app/student/courses">Khóa học của tôi</Link>
                  </Button>
                </div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng khóa học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {activeCourses.length} đang học, {completedCourses.length} hoàn thành
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa đang học</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Tiến độ trung bình {averageProgress}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã hoàn thành</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalCourses > 0 ? `${Math.round((completedCourses.length / totalCourses) * 100)}%` : '0%'} hoàn thành
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa học khả dụng</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Khóa học mới để khám phá
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        {recentCourses.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Khóa học đang học</CardTitle>
                <Button variant="link" asChild>
                  <Link href="/authorized/lms/app/student/courses">Xem tất cả</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">{enrollment.courseName}</h3>
                    <div className="flex items-center gap-4">
                      <Progress value={enrollment.progress || 0} className="flex-1" />
                      <span className="text-sm text-muted-foreground">{enrollment.progress || 0}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/authorized/lms/app/student/courses/${enrollment.courseId}/learn`}>
                      Tiếp tục học
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ học tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Tiến độ tổng thể</span>
                  <span className="text-sm text-muted-foreground">{averageProgress}%</span>
                </div>
                <Progress value={averageProgress} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Đăng ký</p>
                  <p className="text-2xl font-bold">{totalCourses}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Đang học</p>
                  <p className="text-2xl font-bold">{activeCourses.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Hoàn thành</p>
                  <p className="text-2xl font-bold">{completedCourses.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {totalCourses === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">
                Bắt đầu hành trình học tập!
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                Hiện có {courses.length} khóa học chờ bạn khám phá
              </p>
              <Button asChild size="lg">
                <Link href="/authorized/lms/app/student/browse">
                  Khám phá khóa học ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
