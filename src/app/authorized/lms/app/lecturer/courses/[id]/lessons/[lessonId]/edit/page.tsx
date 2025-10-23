"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@lms/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { lmsApiClient, LessonStatus, LessonResponse } from "@/lib/lms-api-client"

export default function EditLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const router = useRouter()
  const courseId = parseInt(params.id)
  const lessonId = parseInt(params.lessonId)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [orderIndex, setOrderIndex] = useState<number>(1)
  const [duration, setDuration] = useState<number>(30)
  const [status, setStatus] = useState<LessonStatus>(LessonStatus.OPEN)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lesson, setLesson] = useState<LessonResponse | null>(null)

  // Load lesson data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        console.log('📖 Loading lesson data for ID:', lessonId)
        
        // Load lesson
        const lessonResponse = await lmsApiClient.getLesson(lessonId)
        console.log('📦 Lesson response:', lessonResponse)
        
        if (lessonResponse.result) {
          const lessonData = lessonResponse.result
          console.log('✅ Lesson data loaded:', lessonData)
          setLesson(lessonData)
          
          // Populate form
          setTitle(lessonData.title || "")
          setDescription(lessonData.description || "")
          setOrderIndex(lessonData.orderIndex || 1)
          setDuration(lessonData.duration || 30)
          setStatus(lessonData.status || LessonStatus.OPEN)
        }
      } catch (err: any) {
        console.error("Error loading lesson:", err)
        setError("Không thể tải thông tin bài học")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [lessonId])

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      // Validation
      if (!title.trim()) {
        setError("Vui lòng nhập tên bài học")
        return
      }

      const lessonData = {
        title: title.trim(),
        description: description.trim(),
        orderIndex: orderIndex,
        duration: duration,
        status: status,
      }

      console.log("Updating lesson:", lessonData)

      // Use different endpoint based on whether we have a video file
      const response = videoFile 
        ? await lmsApiClient.updateLesson(lessonId, lessonData, videoFile)
        : await lmsApiClient.updateLesson(lessonId, lessonData)

      if (response.result) {
        console.log("✅ Lesson updated successfully")
        // Redirect back to course management page
        router.push(`/authorized/lms/app/lecturer/courses/${courseId}`)
      }
    } catch (err: any) {
      console.error("Error updating lesson:", err)
      setError(err.message || "Không thể cập nhật bài học. Vui lòng thử lại.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Không tìm thấy bài học</p>
          <Link href={`/authorized/lms/app/lecturer/courses/${courseId}`}>
            <Button className="mt-4">Quay lại khóa học</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/authorized/lms/app/lecturer/courses/${courseId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa bài học</h1>
            <p className="text-muted-foreground mt-1">Cập nhật thông tin bài học</p>
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
              <CardTitle>Thông tin bài học</CardTitle>
              <CardDescription>Thông tin chính về bài học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên bài học *</Label>
                <Input
                  id="title"
                  placeholder="VD: Giới thiệu về React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về bài học..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="orderIndex">Thứ tự *</Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LessonStatus)}
                  >
                    <option value="UPCOMING">Sắp mở</option>
                    <option value="OPEN">Đã mở</option>
                    <option value="CLOSED">Đã đóng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video bài học</Label>
                {lesson.videoPath && (
                  <div className="rounded-lg border p-3 bg-muted/50 mb-2">
                    <p className="text-sm text-muted-foreground">
                      📹 Video hiện tại: {lesson.videoPath.split('/').pop()}
                    </p>
                  </div>
                )}
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                {videoFile && (
                  <p className="text-sm text-muted-foreground">
                    ✅ Video mới đã chọn: {videoFile.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {lesson.videoPath 
                    ? "Chọn video mới để thay thế video hiện tại (tùy chọn)"
                    : "Chọn video cho bài học (tùy chọn)"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href={`/authorized/lms/app/lecturer/courses/${courseId}`}>
              <Button type="button" variant="outline" disabled={saving}>
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={saving || !title.trim()}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

