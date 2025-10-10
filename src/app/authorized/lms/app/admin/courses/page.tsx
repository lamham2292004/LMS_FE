"use client"

import { useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Search, Filter, Eye, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lms/components/ui/dialog"
import Link from "next/link"

const allCourses = [
  {
    id: 1,
    title: "Lập trình Python cơ bản",
    category: "Lập trình",
    lecturer: "Nguyễn Văn B",
    students: 1234,
    rating: 4.8,
    price: 1500000,
    status: "published",
    createdDate: "15/01/2025",
  },
  {
    id: 2,
    title: "Web Development với React",
    category: "Web Development",
    lecturer: "Trần Thị C",
    students: 856,
    rating: 4.6,
    price: 2000000,
    status: "published",
    createdDate: "20/01/2025",
  },
  {
    id: 3,
    title: "Machine Learning Advanced",
    category: "AI & ML",
    lecturer: "Phạm Văn G",
    students: 0,
    rating: 0,
    price: 3000000,
    status: "pending",
    createdDate: "25/03/2025",
  },
]

export default function AdminCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = () => {
    console.log("[v0] Approving course:", selectedCourse?.id)
    setShowApproveDialog(false)
    // TODO: Call API to approve course
  }

  const handleDelete = () => {
    console.log("[v0] Deleting course:", selectedCourse?.id)
    setShowDeleteDialog(false)
    // TODO: Call API to delete course
  }

  return (
    <div className="flex flex-col">
      <Header title="Quản lý khóa học" />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tất cả khóa học</h1>
          <p className="text-muted-foreground">Quản lý và phê duyệt khóa học</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng khóa học</p>
              <p className="mt-2 text-3xl font-bold">{allCourses.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Đã xuất bản</p>
              <p className="mt-2 text-3xl font-bold">{allCourses.filter((c) => c.status === "published").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="mt-2 text-3xl font-bold">{allCourses.filter((c) => c.status === "pending").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng học viên</p>
              <p className="mt-2 text-3xl font-bold">
                {allCourses.reduce((sum, c) => sum + c.students, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="published">Đã xuất bản</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="draft">Bản nháp</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-32 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={`/course-${course.id}.jpg?height=80&width=128`}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <Badge
                              variant={
                                course.status === "published"
                                  ? "default"
                                  : course.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {course.status === "published"
                                ? "Đã xuất bản"
                                : course.status === "pending"
                                  ? "Chờ duyệt"
                                  : "Bản nháp"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Danh mục: {course.category}</span>
                            <span>•</span>
                            <span>Giảng viên: {course.lecturer}</span>
                            <span>•</span>
                            <span>{course.students.toLocaleString()} học viên</span>
                            {course.rating > 0 && (
                              <>
                                <span>•</span>
                                <span>⭐ {course.rating}</span>
                              </>
                            )}
                            <span>•</span>
                            <span className="font-semibold text-primary">{course.price.toLocaleString()}đ</span>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">Tạo lúc: {course.createdDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/authorized/lms/app/admin/courses/${course.id}/preview`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem
                          </Link>
                        </Button>
                        {course.status === "pending" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course)
                              setShowApproveDialog(true)
                            }}
                          >
                            Phê duyệt
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <p className="text-center text-muted-foreground">Hiển thị các khóa học đã xuất bản</p>
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-center text-muted-foreground">Hiển thị các khóa học chờ phê duyệt</p>
          </TabsContent>

          <TabsContent value="draft">
            <p className="text-center text-muted-foreground">Hiển thị các khóa học bản nháp</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phê duyệt khóa học</DialogTitle>
            <DialogDescription>Bạn có chắc muốn phê duyệt khóa học "{selectedCourse?.title}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleApprove}>Phê duyệt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa khóa học</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa khóa học "{selectedCourse?.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
