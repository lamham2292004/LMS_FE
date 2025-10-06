"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { BookOpen, Users, Star, Search, Plus, BarChart3, Edit, Eye } from "lucide-react"

export default function LecturerCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with actual API call
  const courses = [
    {
      id: 1,
      title: "Lập trình Web với React & Next.js",
      thumbnail: "/course-1.jpg",
      status: "published",
      students: 234,
      rating: 4.8,
      reviews: 89,
      revenue: 45600000,
      lessons: 24,
      category: "Web Development",
    },
    {
      id: 2,
      title: "Python cho Data Science",
      thumbnail: "/course-2.jpg",
      status: "published",
      students: 189,
      rating: 4.9,
      reviews: 67,
      revenue: 37800000,
      lessons: 18,
      category: "Data Science",
    },
    {
      id: 3,
      title: "Machine Learning cơ bản",
      thumbnail: "/course-3.jpg",
      status: "draft",
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      lessons: 12,
      category: "AI & Machine Learning",
    },
  ]

  const publishedCourses = courses.filter((c) => c.status === "published")
  const draftCourses = courses.filter((c) => c.status === "draft")

  const filteredCourses = (courseList: typeof courses) => {
    return courseList.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <Link href="/lecturer/courses/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Tạo khóa học mới
            </Button>
          </Link>
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
              <div className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.students, 0)}</div>
              <p className="text-xs text-muted-foreground">Trên tất cả khóa học</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(publishedCourses.reduce((sum, c) => sum + c.rating, 0) / publishedCourses.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {publishedCourses.reduce((sum, c) => sum + c.reviews, 0)} đánh giá
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(courses.reduce((sum, c) => sum + c.revenue, 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">VNĐ tháng này</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Courses Tabs */}
        <Tabs defaultValue="published" className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Đã xuất bản ({publishedCourses.length})</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp ({draftCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="space-y-4">
            {filteredCourses(publishedCourses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy khóa học nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(publishedCourses).map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                        <Badge variant="secondary">{course.status === "published" ? "Đã xuất bản" : "Bản nháp"}</Badge>
                      </div>
                      <CardDescription>{course.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Học viên</p>
                          <p className="font-semibold">{course.students}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bài học</p>
                          <p className="font-semibold">{course.lessons}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Đánh giá</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {course.rating} ({course.reviews})
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Doanh thu</p>
                          <p className="font-semibold">{(course.revenue / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/lecturer/courses/${course.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            Quản lý
                          </Button>
                        </Link>
                        <Link href={`/lecturer/courses/${course.id}/edit`} className="flex-1">
                          <Button className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {filteredCourses(draftCourses).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có bản nháp nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses(draftCourses).map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                        <Badge variant="secondary">Bản nháp</Badge>
                      </div>
                      <CardDescription>{course.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>{course.lessons} bài học</p>
                        <p className="mt-1">Chưa xuất bản</p>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/lecturer/courses/${course.id}/edit`} className="flex-1">
                          <Button className="w-full gap-2">
                            <Edit className="h-4 w-4" />
                            Tiếp tục chỉnh sửa
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
