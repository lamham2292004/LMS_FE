"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lms/components/ui/select"
import { ArrowLeft, Upload, Video, FileText } from "lucide-react"
import Link from "next/link"

export default function NewLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lessonType, setLessonType] = useState<"video" | "document" | "quiz">("video")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle lesson creation
    router.push(`/authorized/lms/app/lecturer/courses/${params.id}`)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Thêm bài học mới</h1>
            <p className="text-muted-foreground mt-1">Tạo nội dung học tập cho khóa học của bạn</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin chính về bài học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài học *</Label>
                <Input id="title" placeholder="VD: Giới thiệu về React Hooks" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" placeholder="Mô tả ngắn gọn về nội dung bài học..." rows={4} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input id="duration" type="number" placeholder="30" min="1" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự</Label>
                  <Input id="order" type="number" placeholder="1" min="1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Type */}
          <Card>
            <CardHeader>
              <CardTitle>Loại nội dung</CardTitle>
              <CardDescription>Chọn định dạng nội dung cho bài học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Loại bài học *</Label>
                <Select value={lessonType} onValueChange={(value: any) => setLessonType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Tài liệu
                      </div>
                    </SelectItem>
                    <SelectItem value="quiz">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Bài kiểm tra
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {lessonType === "video" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-url">URL Video</Label>
                    <Input id="video-url" placeholder="https://youtube.com/watch?v=..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Hoặc tải lên video</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Kéo thả video vào đây hoặc click để chọn</p>
                      <Button type="button" variant="outline" size="sm">
                        Chọn file
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {lessonType === "document" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Nội dung bài học</Label>
                    <Textarea id="content" placeholder="Nhập nội dung bài học..." rows={10} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tài liệu đính kèm</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">Tải lên PDF, Word, hoặc các tài liệu khác</p>
                      <Button type="button" variant="outline" size="sm">
                        Chọn file
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {lessonType === "quiz" && (
                <div className="rounded-lg border bg-muted p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Bài kiểm tra cần được tạo riêng trong phần Quản lý bài kiểm tra
                  </p>
                  <Link href={`/authorized/lms/app/lecturer/courses/${params.id}/quizzes/new`}>
                    <Button type="button" variant="outline">
                      Đi tới tạo bài kiểm tra
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </Link>
            <Button type="submit">Tạo bài học</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
