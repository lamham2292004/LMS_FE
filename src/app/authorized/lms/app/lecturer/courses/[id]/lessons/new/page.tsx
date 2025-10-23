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
import { ArrowLeft, Upload, Video, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { lmsApiClient, LessonStatus } from "@/lib/lms-api-client"

export default function NewLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courseId = parseInt(params.id)
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState<number>(30)
  const [orderIndex, setOrderIndex] = useState<number>(1)
  const [status, setStatus] = useState<LessonStatus>(LessonStatus.OPEN)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      // Validate
      if (!title.trim()) {
        setError("Vui lòng nhập tiêu đề bài học")
        return
      }

      const lessonData = {
        courseId: courseId,
        title: title.trim(),
        description: description.trim(),
        orderIndex: orderIndex,
        duration: duration,
        status: status,
      }

      console.log("Creating lesson:", lessonData)
      
      const response = await lmsApiClient.createLesson(lessonData, videoFile || undefined)
      
      if (response.result) {
        console.log("✅ Lesson created successfully:", response.result)
        router.push(`/authorized/lms/app/lecturer/courses/${params.id}`)
      }
    } catch (err: any) {
      console.error("Error creating lesson:", err)
      setError(err.message || "Không thể tạo bài học. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
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
          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin chính về bài học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài học *</Label>
                <Input 
                  id="title" 
                  placeholder="VD: Giới thiệu về React Hooks" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả ngắn gọn về nội dung bài học..." 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="30" 
                    min="1" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự</Label>
                  <Input 
                    id="order" 
                    type="number" 
                    placeholder="1" 
                    min="1"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 h-10"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LessonStatus)}
                  >
                    <option value="OPEN">Mở</option>
                    <option value="UPCOMING">Sắp mở</option>
                    <option value="CLOSED">Đã đóng</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Content */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung video (Optional)</CardTitle>
              <CardDescription>Upload video cho bài học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video">Video file</Label>
                <Input 
                  id="video" 
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                {videoFile && (
                  <p className="text-sm text-muted-foreground">
                    ✅ Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Lưu ý:</strong> Video có thể được thêm sau khi tạo bài học. Backend hỗ trợ upload video lên server.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href={`/authorized/lms/app/lecturer/courses/${params.id}`}>
              <Button type="button" variant="outline" disabled={loading}>
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo bài học"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
