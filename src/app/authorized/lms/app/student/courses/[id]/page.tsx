"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
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
  Video,
  RefreshCw,
  BookMarked
} from "lucide-react"
import Link from "next/link"
import { useCourse, useCheckEnrollment } from '@/lib/hooks/useLms'

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = parseInt(params.id as string)
  
  const { data: course, loading, error, execute: fetchCourse } = useCourse(courseId)
  const { isEnrolled, loading: checkingEnrollment, checkEnrollment } = useCheckEnrollment(courseId)

  useEffect(() => {
    if (courseId) {
      fetchCourse()
      checkEnrollment()
    }
  }, [courseId])

  if (loading || checkingEnrollment) {
    return (
      <div className="flex flex-col">
        <Header title="Chi tiết khóa học" showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải khóa học từ backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex flex-col">
        <Header title="Chi tiết khóa học" showCart />
        <div className="flex-1 p-6">
          <Card className="p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">
              {error?.message || "Không tìm thấy khóa học"}
            </h1>
            <p className="text-muted-foreground mb-4">
              Khóa học không tồn tại hoặc bạn không có quyền truy cập.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchCourse} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
              <Button asChild>
                <Link href="/authorized/lms/app/student/courses">Quay lại</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Build full image URL from backend
  const imageUrl = course.img 
    ? (course.img.startsWith('http') 
        ? course.img 
        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
    : '/images/course-1.png';

  const totalLessons = course.lessons?.length || 0;
  const totalDuration = course.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;
  const formattedDuration = totalDuration > 0 
    ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` 
    : 'Chưa có thông tin';

  return (
    <div className="flex flex-col">
      <Header title={course.title} showCart />

      <div className="flex-1 p-6">
        {/* Course Header */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/course-1.png';
                  }}
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{course.categoryName}</Badge>
                <Badge variant="outline">{course.status}</Badge>
                {isEnrolled && <Badge className="bg-success text-white">Đã đăng ký</Badge>}
              </div>

              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
              
              <p className="mb-6 text-lg text-muted-foreground">{course.description}</p>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formattedDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{totalLessons} bài học</span>
                </div>
              </div>

              {course.startTime && (
                <p className="text-sm text-muted-foreground mb-2">
                  📅 Bắt đầu: {new Date(course.startTime).toLocaleDateString('vi-VN')}
                </p>
              )}
              {course.endTime && (
                <p className="text-sm text-muted-foreground">
                  🏁 Kết thúc: {new Date(course.endTime).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="lessons" className="space-y-6">
              <TabsList>
                <TabsTrigger value="lessons">Nội dung khóa học</TabsTrigger>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              </TabsList>

              <TabsContent value="lessons">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                      <BookMarked className="h-5 w-5" />
                      Danh sách bài học ({totalLessons})
                    </h2>
                    
                    {course.lessons && course.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {course.lessons.map((lesson, index) => {
                          const isLocked = !isEnrolled;
                          
                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                                isLocked
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer hover:bg-accent"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                {isLocked ? (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                    {lesson.orderIndex}
                                  </div>
                                )}

                                <div>
                                  <p className="font-semibold">{lesson.title}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Video className="h-4 w-4" />
                                    {lesson.duration ? (
                                      <span>{lesson.duration} phút</span>
                                    ) : (
                                      <span>Chưa có thời lượng</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {!isLocked && (
                                <Button size="sm" asChild>
                                  <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lesson.id}`}>
                                    Học ngay
                                  </Link>
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có bài học nào trong khóa học này</p>
                      </div>
                    )}
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
                        <h3 className="mb-2 font-semibold">Thông tin khóa học</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Danh mục: {course.categoryName}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Trạng thái: {course.status}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Tổng số bài học: {totalLessons}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                            <span>Thời lượng: {formattedDuration}</span>
                          </li>
                        </ul>
                      </div>

                      {course.startTime && course.endTime && (
                        <div>
                          <h3 className="mb-2 font-semibold">Thời gian</h3>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>Bắt đầu: {new Date(course.startTime).toLocaleString('vi-VN')}</li>
                            <li>Kết thúc: {new Date(course.endTime).toLocaleString('vi-VN')}</li>
                          </ul>
                        </div>
                      )}
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
                <h3 className="mb-4 font-semibold">Thông tin khóa học</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Danh mục</span>
                    <Badge variant="outline">{course.categoryName}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    <Badge variant="secondary">{course.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Thời lượng</span>
                    <span className="font-semibold">{formattedDuration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bài học</span>
                    <span className="font-semibold">{totalLessons}</span>
                  </div>
                </div>

                <div className="mt-6">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild>
                        <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${course.lessons?.[0]?.id || 1}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Bắt đầu học
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {course.price === 0 ? (
                            <span className="text-success">Miễn phí</span>
                          ) : (
                            `${course.price.toLocaleString()}đ`
                          )}
                        </div>
                      </div>
                      <Button className="w-full" size="lg" disabled>
                        Đăng ký ngay
                        <p className="text-xs mt-1">(Chưa đăng ký khóa học)</p>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Vui lòng đăng ký khóa học từ trang Khám phá
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
