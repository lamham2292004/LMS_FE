"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback } from "@lms/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lms/components/ui/select"
import { Users, Search, Trophy, Clock, TrendingUp, BookOpen, AlertCircle } from "lucide-react"
import { useEnrollments, useLecturerCourses } from "@/lib/hooks/useLms"
import type { EnrollmentResponse } from "@/lib/lms-api-client"

// Student data aggregated from enrollments
interface StudentData {
  id: number
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  activeCourses: number
  progress: number
  lastActive: string
  enrollments: EnrollmentResponse[]
}

export default function LecturerStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  
  const { enrollments, loading: enrollmentsLoading, error: enrollmentsError, fetchEnrollments } = useEnrollments()
  const { courses, loading: coursesLoading, fetchCourses } = useLecturerCourses()

  useEffect(() => {
    fetchEnrollments()
    fetchCourses()
  }, [fetchEnrollments, fetchCourses])

  // Aggregate students from enrollments
  const students = useMemo<StudentData[]>(() => {
    if (!enrollments || enrollments.length === 0) return []

    const studentMap = new Map<number, StudentData>()

    enrollments.forEach((enrollment: EnrollmentResponse) => {
      const studentId = enrollment.studentId
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: studentId,
          name: enrollment.studentName || `Student ${studentId}`,
          email: enrollment.studentEmail || "",
          enrolledCourses: 0,
          completedCourses: 0,
          activeCourses: 0,
          progress: 0,
          lastActive: enrollment.enrolledAt,
          enrollments: [],
        })
      }

      const student = studentMap.get(studentId)!
      student.enrollments.push(enrollment)
      student.enrolledCourses++

      if (enrollment.status === 'COMPLETED') {
        student.completedCourses++
      } else if (enrollment.status === 'ACTIVE') {
        student.activeCourses++
      }

      // Calculate average progress
      if (enrollment.progress !== undefined) {
        student.progress = Math.round(
          student.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / student.enrollments.length
        )
      }

      // Update last active
      if (new Date(enrollment.enrolledAt) > new Date(student.lastActive)) {
        student.lastActive = enrollment.enrolledAt
      }
    })

    return Array.from(studentMap.values())
  }, [enrollments])

  // Filter by course
  const filteredByCourse = useMemo(() => {
    if (selectedCourse === "all") return students

    const courseId = parseInt(selectedCourse)
    return students.filter(student => 
      student.enrollments.some(e => e.courseId === courseId)
    )
  }, [students, selectedCourse])

  // Filter by search query
  const filteredStudents = useMemo(() => {
    return filteredByCourse.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [filteredByCourse, searchQuery])

  // Stats
  const stats = useMemo(() => {
    const totalStudents = students.length
    const activeStudents = students.filter(s => s.activeCourses > 0).length
    const avgProgress = students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
      : 0
    const totalCompleted = students.reduce((sum, s) => sum + s.completedCourses, 0)
    
    return { totalStudents, activeStudents, avgProgress, totalCompleted }
  }, [students])

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Hôm nay"
    if (diffInDays === 1) return "Hôm qua"
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`
    return date.toLocaleDateString("vi-VN")
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  if (enrollmentsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải danh sách học viên...</p>
        </div>
      </div>
    )
  }

  if (enrollmentsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-500">Không thể tải dữ liệu</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {enrollmentsError?.message || "Vui lòng thử lại sau"}
                </p>
              </div>
            </div>
            <Button onClick={() => fetchEnrollments()} className="w-full">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Quản lý học viên</h1>
          <p className="text-muted-foreground mt-1">Theo dõi tiến độ và hoạt động của học viên</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeStudents} đang hoạt động</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến độ TB</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Trung bình tất cả học viên</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompleted}</div>
              <p className="text-xs text-muted-foreground">Khóa học đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Khóa học của bạn</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm học viên theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Tất cả khóa học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khóa học</SelectItem>
              {courses && courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || selectedCourse !== "all" 
                  ? "Không tìm thấy học viên nào" 
                  : "Chưa có học viên nào đăng ký khóa học của bạn"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="flex items-center gap-6 p-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email || "Chưa có email"}</p>
                      </div>
                      <Badge variant={student.activeCourses > 0 ? "default" : "secondary"}>
                        {student.activeCourses > 0 ? "Đang học" : "Không hoạt động"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Khóa học</p>
                        <p className="font-semibold">{student.enrolledCourses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Đang học</p>
                        <p className="font-semibold text-blue-600">{student.activeCourses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hoàn thành</p>
                        <p className="font-semibold text-green-600">{student.completedCourses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tiến độ TB</p>
                        <p className="font-semibold">{student.progress}%</p>
                      </div>
                    </div>

                    {/* Course enrollments */}
                    <div className="flex flex-wrap gap-2">
                      {student.enrollments.slice(0, 3).map((enrollment) => (
                        <Badge key={enrollment.id} variant="outline" className="text-xs">
                          {enrollment.courseName} • {enrollment.status}
                        </Badge>
                      ))}
                      {student.enrollments.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.enrollments.length - 3} khác
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Đăng ký lần cuối: {formatLastActive(student.lastActive)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
