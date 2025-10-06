"use client"

import { useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lms/components/ui/dialog"
import { Label } from "@lms/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lms/components/ui/select"
import { Search, UserPlus, MoreVertical, CheckCircle2, Ban, Trash2, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lms/components/ui/dropdown-menu"

export default function UsersManagementPage() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      enrolledCourses: 5,
      completedCourses: 2,
      joinDate: "15/01/2025",
      status: "active",
      totalSpent: 7500000,
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      enrolledCourses: 3,
      completedCourses: 1,
      joinDate: "20/01/2025",
      status: "active",
      totalSpent: 4500000,
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      enrolledCourses: 2,
      completedCourses: 0,
      joinDate: "25/01/2025",
      status: "suspended",
      totalSpent: 3000000,
    },
  ])

  const [lecturers, setLecturers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn B",
      email: "nguyenvanb@email.com",
      courses: 8,
      students: 1234,
      rating: 4.8,
      joinDate: "10/12/2024",
      status: "active",
      totalEarnings: 45000000,
    },
    {
      id: 2,
      name: "Trần Thị C",
      email: "tranthic@email.com",
      courses: 5,
      students: 856,
      rating: 4.6,
      joinDate: "15/12/2024",
      status: "active",
      totalEarnings: 32000000,
    },
    {
      id: 3,
      name: "Lê Văn D",
      email: "levand@email.com",
      courses: 3,
      students: 423,
      rating: 4.9,
      joinDate: "20/12/2024",
      status: "pending",
      totalEarnings: 18000000,
    },
  ])

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userType, setUserType] = useState<"student" | "lecturer">("student")

  const handleApprove = (lecturerId: number) => {
    setLecturers(lecturers.map((l) => (l.id === lecturerId ? { ...l, status: "active" } : l)))
  }

  const handleSuspend = (userId: number, type: "student" | "lecturer") => {
    if (type === "student") {
      setStudents(students.map((s) => (s.id === userId ? { ...s, status: "suspended" } : s)))
    } else {
      setLecturers(lecturers.map((l) => (l.id === userId ? { ...l, status: "suspended" } : l)))
    }
  }

  const handleActivate = (userId: number, type: "student" | "lecturer") => {
    if (type === "student") {
      setStudents(students.map((s) => (s.id === userId ? { ...s, status: "active" } : s)))
    } else {
      setLecturers(lecturers.map((l) => (l.id === userId ? { ...l, status: "active" } : l)))
    }
  }

  const handleDelete = () => {
    if (userType === "student") {
      setStudents(students.filter((s) => s.id !== selectedUser?.id))
    } else {
      setLecturers(lecturers.filter((l) => l.id !== selectedUser?.id))
    }
    setDeleteDialogOpen(false)
  }

  const openEditDialog = (user: any, type: "student" | "lecturer") => {
    setSelectedUser(user)
    setUserType(type)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (user: any, type: "student" | "lecturer") => {
    setSelectedUser(user)
    setUserType(type)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="flex flex-col">
      <Header title="Quản lý người dùng" />

      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Người dùng</h1>
            <p className="text-muted-foreground">Quản lý học viên và giảng viên</p>
          </div>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng học viên</p>
              <p className="mt-2 text-3xl font-bold">{students.length.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng giảng viên</p>
              <p className="mt-2 text-3xl font-bold">{lecturers.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Chờ phê duyệt</p>
              <p className="mt-2 text-3xl font-bold">{lecturers.filter((l) => l.status === "pending").length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm người dùng..." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Học viên</TabsTrigger>
            <TabsTrigger value="lecturers">Giảng viên</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách học viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Khóa học</p>
                          <p className="font-semibold">
                            {student.completedCourses}/{student.enrolledCourses}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Chi tiêu</p>
                          <p className="font-semibold">{(student.totalSpent / 1000000).toFixed(1)}M</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Tham gia</p>
                          <p className="font-semibold">{student.joinDate}</p>
                        </div>

                        <Badge variant={student.status === "active" ? "default" : "destructive"}>
                          {student.status === "active" ? "Hoạt động" : "Tạm khóa"}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(student, "student")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {student.status === "active" ? (
                              <DropdownMenuItem onClick={() => handleSuspend(student.id, "student")}>
                                <Ban className="mr-2 h-4 w-4" />
                                Tạm khóa
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivate(student.id, "student")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(student, "student")}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lecturers">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lecturers.map((lecturer) => (
                    <div key={lecturer.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>{lecturer.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{lecturer.name}</p>
                          <p className="text-sm text-muted-foreground">{lecturer.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Khóa học</p>
                          <p className="font-semibold">{lecturer.courses}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Học viên</p>
                          <p className="font-semibold">{lecturer.students.toLocaleString()}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Đánh giá</p>
                          <p className="font-semibold">{lecturer.rating}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Thu nhập</p>
                          <p className="font-semibold">{(lecturer.totalEarnings / 1000000).toFixed(0)}M</p>
                        </div>

                        <Badge
                          variant={
                            lecturer.status === "active"
                              ? "default"
                              : lecturer.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {lecturer.status === "active"
                            ? "Hoạt động"
                            : lecturer.status === "pending"
                              ? "Chờ duyệt"
                              : "Tạm khóa"}
                        </Badge>

                        {lecturer.status === "pending" && (
                          <Button size="sm" onClick={() => handleApprove(lecturer.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Phê duyệt
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(lecturer, "lecturer")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {lecturer.status === "active" ? (
                              <DropdownMenuItem onClick={() => handleSuspend(lecturer.id, "lecturer")}>
                                <Ban className="mr-2 h-4 w-4" />
                                Tạm khóa
                              </DropdownMenuItem>
                            ) : lecturer.status === "suspended" ? (
                              <DropdownMenuItem onClick={() => handleActivate(lecturer.id, "lecturer")}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(lecturer, "lecturer")}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên</Label>
              <Input id="name" defaultValue={selectedUser?.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={selectedUser?.email} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select defaultValue={selectedUser?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                  {userType === "lecturer" && <SelectItem value="pending">Chờ duyệt</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
