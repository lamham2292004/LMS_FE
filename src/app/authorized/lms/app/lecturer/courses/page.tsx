"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { BookOpen, Users, Star, Search, Plus, BarChart3, Edit, Eye, RefreshCw } from "lucide-react"
import { useLecturerCourses } from '@/lib/hooks/useLms'
import { ApprovalStatus } from '@/lib/lms-api-client'

export default function LecturerCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { courses, loading, error, fetchCourses } = useLecturerCourses()

  useEffect(() => {
    fetchCourses()
  }, [])

  // Filter courses by approval status
  const publishedCourses = courses.filter((c) => c.approvalStatus === ApprovalStatus.APPROVED)
  const pendingCourses = courses.filter((c) => c.approvalStatus === ApprovalStatus.PENDING)
  const rejectedCourses = courses.filter((c) => c.approvalStatus === ApprovalStatus.REJECTED)

  const filteredCourses = (courseList: typeof courses) => {
    return courseList.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // Calculate stats
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0)
  const avgRating = publishedCourses.length > 0 
    ? (publishedCourses.reduce((sum, c) => sum + 0, 0) / publishedCourses.length).toFixed(1)
    : "0.0"

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải khóa học từ backend...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h3 className="text-destructive font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">{error.message || 'Không thể tải khóa học'}</p>
            <Button onClick={fetchCourses}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
            <p className="text-muted-foreground mt-1">Quản lý tất cả khóa học của bạn</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchCourses} variant="outline" size="lg">
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Link href="/authorized/lms/app/lecturer/courses/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Tạo khóa học mới
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">{publishedCourses.length} đã xuất bản</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Trên tất cả khóa học</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating}</div>
              <p className="text-xs text-muted-foreground">Tính năng đang phát triển</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCourses.length}</div>
              <p className="text-xs text-muted-foreground">Khóa học đang chờ</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({courses.length})</TabsTrigger>
            <TabsTrigger value="published">Đã xuất bản ({publishedCourses.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt ({pendingCourses.length})</TabsTrigger>
            <TabsTrigger value="rejected">Bị từ chối ({rejectedCourses.length})</TabsTrigger>
          </TabsList>

          {/* ALL COURSES TAB */}
          <TabsContent value="all" className="space-y-4">
            {filteredCourses(courses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chưa có khóa học nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(courses).map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                    <Card key={course.id} className="overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-1.png';
                        }}
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                          <Badge className={
                            course.approvalStatus === ApprovalStatus.APPROVED ? 'bg-success text-white' :
                            course.approvalStatus === ApprovalStatus.PENDING ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }>
                            {course.approvalStatus === ApprovalStatus.APPROVED ? 'Đã xuất bản' :
                             course.approvalStatus === ApprovalStatus.PENDING ? 'Chờ duyệt' :
                             'Bị từ chối'}
                          </Badge>
                        </div>
                        <CardDescription>{course.categoryName}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Học viên</p>
                            <p className="font-semibold">{course.enrollments?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Bài học</p>
                            <p className="font-semibold">{course.lessons?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Giá</p>
                            <p className="font-semibold">
                              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Trạng thái</p>
                            <p className="font-semibold">{course.status}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                              <Eye className="h-4 w-4" />
                              Quản lý
                            </Button>
                          </Link>
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}/edit`} className="flex-1">
                            <Button className="w-full gap-2">
                              <Edit className="h-4 w-4" />
                              Chỉnh sửa
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {filteredCourses(publishedCourses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có khóa học đã xuất bản</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(publishedCourses).map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                    <Card key={course.id} className="overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-1.png';
                        }}
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                          <Badge className="bg-success text-white">Đã xuất bản</Badge>
                        </div>
                        <CardDescription>{course.categoryName}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Học viên</p>
                            <p className="font-semibold">{course.enrollments?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Bài học</p>
                            <p className="font-semibold">{course.lessons?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Giá</p>
                            <p className="font-semibold">
                              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Trạng thái</p>
                            <p className="font-semibold">{course.status}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                              <Eye className="h-4 w-4" />
                              Quản lý
                            </Button>
                          </Link>
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}/edit`} className="flex-1">
                            <Button className="w-full gap-2">
                              <Edit className="h-4 w-4" />
                              Chỉnh sửa
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filteredCourses(pendingCourses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có khóa học nào chờ duyệt</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(pendingCourses).map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                    <Card key={course.id} className="overflow-hidden border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-1.png';
                        }}
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                          <Badge className="bg-yellow-500 text-white">Chờ duyệt</Badge>
                        </div>
                        <CardDescription>{course.categoryName}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-3 text-sm text-yellow-800 dark:text-yellow-200">
                          ⏳ Khóa học của bạn đang chờ admin phê duyệt. Vui lòng chờ...
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Bài học</p>
                            <p className="font-semibold">{course.lessons?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Giá</p>
                            <p className="font-semibold">
                              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}/edit`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                              <Edit className="h-4 w-4" />
                              Chỉnh sửa
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {filteredCourses(rejectedCourses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có khóa học nào bị từ chối</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(rejectedCourses).map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                    <Card key={course.id} className="overflow-hidden border-red-200 bg-red-50 dark:bg-red-950">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-1.png';
                        }}
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                          <Badge variant="destructive">Bị từ chối</Badge>
                        </div>
                        <CardDescription>{course.categoryName}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {course.rejectionReason && (
                          <div className="rounded-lg bg-red-100 dark:bg-red-900 p-3 text-sm text-red-800 dark:text-red-200">
                            <p className="font-semibold mb-1">❌ Lý do từ chối:</p>
                            <p>{course.rejectionReason}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Bài học</p>
                            <p className="font-semibold">{course.lessons?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Giá</p>
                            <p className="font-semibold">
                              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/authorized/lms/app/lecturer/courses/${course.id}/edit`} className="flex-1">
                            <Button className="w-full gap-2">
                              <Edit className="h-4 w-4" />
                              Sửa & Resubmit
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
