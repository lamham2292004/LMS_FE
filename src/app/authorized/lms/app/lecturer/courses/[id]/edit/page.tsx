"use client"

import { useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Save, Eye, Plus, GripVertical, Trash2, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lms/components/ui/dialog"
import Link from "next/link"

const initialLessons = [
  { id: 1, title: "Giới thiệu về Python", type: "video", duration: "15:30" },
  { id: 2, title: "Cài đặt môi trường", type: "video", duration: "20:45" },
  { id: 3, title: "Biến và kiểu dữ liệu", type: "video", duration: "25:00" },
]

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [lessons, setLessons] = useState(initialLessons)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editTitle, setEditTitle] = useState("")

  const handleEditLesson = () => {
    console.log("[v0] Editing lesson:", selectedLesson?.id, "New title:", editTitle)
    setLessons(lessons.map((l) => (l.id === selectedLesson?.id ? { ...l, title: editTitle } : l)))
    setShowEditDialog(false)
  }

  const handleDeleteLesson = () => {
    console.log("[v0] Deleting lesson:", selectedLesson?.id)
    setLessons(lessons.filter((l) => l.id !== selectedLesson?.id))
    setShowDeleteDialog(false)
  }

  return (
    <div className="flex flex-col">
      <Header title="Chỉnh sửa khóa học" />

      <div className="flex-1 p-6">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa khóa học</h1>
            <p className="text-muted-foreground">Cập nhật thông tin và nội dung khóa học</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/preview`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem trước
              </Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="curriculum">Chương trình học</TabsTrigger>
            <TabsTrigger value="pricing">Giá & Xuất bản</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên khóa học</Label>
                  <Input id="title" defaultValue="Lập trình Python cơ bản" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả ngắn</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    defaultValue="Khóa học Python toàn diện dành cho người mới bắt đầu."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Mô tả chi tiết</Label>
                  <Textarea
                    id="fullDescription"
                    rows={6}
                    defaultValue="Học từ cú pháp cơ bản đến lập trình hướng đối tượng, xử lý file, và làm việc với thư viện phổ biến."
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <select id="category" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>Lập trình</option>
                      <option>Web Development</option>
                      <option>AI & Machine Learning</option>
                      <option>DevOps</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Cấp độ</Label>
                    <select id="level" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>Cơ bản</option>
                      <option>Trung cấp</option>
                      <option>Nâng cao</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Ảnh đại diện</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-48 rounded-lg bg-muted" />
                    <Button variant="outline">Tải ảnh lên</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chương trình học</CardTitle>
                  <Button asChild>
                    <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/lessons/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm bài học
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center gap-3 rounded-lg border p-4">
                      <GripVertical className="h-5 w-5 cursor-move text-muted-foreground" />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {index + 1}. {lesson.title}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setEditTitle(lesson.title)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLesson(lesson)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                  <p className="mb-4 text-muted-foreground">Kéo thả để sắp xếp lại thứ tự bài học</p>
                  <Button variant="outline" asChild>
                    <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/lessons/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm bài học mới
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Giá khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" id="isFree" className="h-4 w-4" />
                    <Label htmlFor="isFree">Khóa học miễn phí</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input id="price" type="number" defaultValue="1500000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Giá khuyến mãi (VNĐ)</Label>
                    <Input id="discount" type="number" placeholder="Để trống nếu không có" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái xuất bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <select id="status" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option>Bản nháp</option>
                      <option>Đã xuất bản</option>
                      <option>Tạm ẩn</option>
                    </select>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-semibold">Checklist xuất bản</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="default" className="h-5 w-5 rounded-full p-0">
                          ✓
                        </Badge>
                        <span>Thông tin cơ bản đầy đủ</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="default" className="h-5 w-5 rounded-full p-0">
                          ✓
                        </Badge>
                        <span>Có ít nhất 5 bài học</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 w-5 rounded-full p-0">
                          !
                        </Badge>
                        <span>Đã thiết lập giá</span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full" size="lg">
                    Xuất bản khóa học
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài học</DialogTitle>
            <DialogDescription>Cập nhật thông tin bài học</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tên bài học</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditLesson}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa bài học</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa bài học "{selectedLesson?.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
