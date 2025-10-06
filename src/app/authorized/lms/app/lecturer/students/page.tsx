"use client"

import { useState } from "react"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Users, Search, Trophy, Clock, TrendingUp } from "lucide-react"

export default function LecturerStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with actual API call
  const students = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      enrolledCourses: 3,
      completedCourses: 1,
      totalProgress: 65,
      totalTrophies: 12,
      totalTime: 45,
      status: "active",
      lastActive: "2 giờ trước",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      enrolledCourses: 2,
      completedCourses: 2,
      totalProgress: 100,
      totalTrophies: 24,
      totalTime: 68,
      status: "active",
      lastActive: "1 ngày trước",
    },
    {
      id: 3,
      name: "Lê Minh Châu",
      email: "chau.le@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      enrolledCourses: 1,
      completedCourses: 0,
      totalProgress: 25,
      totalTrophies: 3,
      totalTime: 12,
      status: "inactive",
      lastActive: "7 ngày trước",
    },
  ]

  const activeStudents = students.filter((s) => s.status === "active")
  const inactiveStudents = students.filter((s) => s.status === "inactive")

  const filteredStudents = (studentList: typeof students) => {
    return studentList.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()),
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
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">{activeStudents.length} đang hoạt động</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến độ TB</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(students.reduce((sum, s) => sum + s.totalProgress, 0) / students.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Trung bình tất cả học viên</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.completedCourses, 0)}</div>
              <p className="text-xs text-muted-foreground">Khóa học đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thời gian học</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.totalTime, 0)}h</div>
              <p className="text-xs text-muted-foreground">Tổng thời gian học</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học viên theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Students Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Đang hoạt động ({activeStudents.length})</TabsTrigger>
            <TabsTrigger value="inactive">Không hoạt động ({inactiveStudents.length})</TabsTrigger>
            <TabsTrigger value="all">Tất cả ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredStudents(activeStudents).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy học viên nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredStudents(activeStudents).map((student) => (
                  <Card key={student.id}>
                    <CardContent className="flex items-center gap-6 p-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Khóa học</p>
                            <p className="font-semibold">{student.enrolledCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Hoàn thành</p>
                            <p className="font-semibold">{student.completedCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tiến độ</p>
                            <p className="font-semibold">{student.totalProgress}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cúp</p>
                            <p className="font-semibold">{student.totalTrophies}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thời gian</p>
                            <p className="font-semibold">{student.totalTime}h</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Hoạt động lần cuối: {student.lastActive}</p>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            {filteredStudents(inactiveStudents).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không có học viên không hoạt động</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredStudents(inactiveStudents).map((student) => (
                  <Card key={student.id}>
                    <CardContent className="flex items-center gap-6 p-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                          <Badge variant="secondary">Không hoạt động</Badge>
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Khóa học</p>
                            <p className="font-semibold">{student.enrolledCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Hoàn thành</p>
                            <p className="font-semibold">{student.completedCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tiến độ</p>
                            <p className="font-semibold">{student.totalProgress}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cúp</p>
                            <p className="font-semibold">{student.totalTrophies}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thời gian</p>
                            <p className="font-semibold">{student.totalTime}h</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Hoạt động lần cuối: {student.lastActive}</p>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredStudents(students).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy học viên nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredStudents(students).map((student) => (
                  <Card key={student.id}>
                    <CardContent className="flex items-center gap-6 p-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Khóa học</p>
                            <p className="font-semibold">{student.enrolledCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Hoàn thành</p>
                            <p className="font-semibold">{student.completedCourses}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tiến độ</p>
                            <p className="font-semibold">{student.totalProgress}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cúp</p>
                            <p className="font-semibold">{student.totalTrophies}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Thời gian</p>
                            <p className="font-semibold">{student.totalTime}h</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Hoạt động lần cuối: {student.lastActive}</p>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
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
