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
import { lmsApiClient, CourseStatus, CategoryResponse, CourseResponse } from "@/lib/lms-api-client"
import { LMS_API_CONFIG } from "@/lib/config"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const courseId = parseInt(params.id)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [price, setPrice] = useState<number>(0)
  const [isFree, setIsFree] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [status, setStatus] = useState<CourseStatus>(CourseStatus.UPCOMING)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [course, setCourse] = useState<CourseResponse | null>(null)

  // Load course data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        console.log('📖 Loading course data for ID:', courseId)
        
        // Load categories
        const categoriesResponse = await lmsApiClient.getAllCategories()
        console.log('📚 Categories loaded:', categoriesResponse.result?.length)
        if (categoriesResponse.result) {
          setCategories(categoriesResponse.result)
        }

        // Load course
        console.log('🔍 Fetching course by ID:', courseId)
        const courseResponse = await lmsApiClient.getCourse(courseId)
        console.log('📦 Course response:', courseResponse)
        
        if (courseResponse.result) {
          const courseData = courseResponse.result
          console.log('✅ Course data loaded:', courseData)
          setCourse(courseData)
          
          // Populate form
          setTitle(courseData.title || "")
          setDescription(courseData.description || "")
          setCategoryId(courseData.categoryId || null)
          setPrice(courseData.price || 0)
          setIsFree(courseData.price === 0)
          setStatus(courseData.status || CourseStatus.UPCOMING)
          setCurrentImage(courseData.img || "")
          
          // Format datetime for input (remove timezone and seconds)
          if (courseData.startTime) {
            // "2025-10-16T15:15:00+07:00" -> "2025-10-16T15:15"
            const dateStr = courseData.startTime.split('+')[0].split('.')[0]
            setStartTime(dateStr.substring(0, 16)) // YYYY-MM-DDTHH:mm
          }
          if (courseData.endTime) {
            const dateStr = courseData.endTime.split('+')[0].split('.')[0]
            setEndTime(dateStr.substring(0, 16))
          }
        }
      } catch (err: any) {
        console.error("Error loading course:", err)
        setError("Không thể tải thông tin khóa học")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [courseId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      // Validation
      if (!title.trim()) {
        setError("Vui lòng nhập tên khóa học")
        return
      }
      if (!categoryId) {
        setError("Vui lòng chọn danh mục")
        return
      }

      // Format datetime for Spring Boot OffsetDateTime
      const formatDateTime = (datetime: string) => {
        if (!datetime) return undefined
        // Convert to ISO 8601 format with timezone
        // "2025-10-16T15:15" -> "2025-10-16T15:15:00+07:00"
        const withSeconds = datetime.includes(':') && datetime.split(':').length === 2 
          ? `${datetime}:00` 
          : datetime
        // Add timezone offset (Vietnam = +07:00)
        return `${withSeconds}+07:00`
      }

      const courseData = {
        title: title.trim(),
        description: description.trim(),
        price: isFree ? 0 : price,
        categoryId: categoryId,
        status: status,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
      }

      console.log("Updating course:", courseData)

      const response = await lmsApiClient.updateCourse(courseId, courseData, imageFile || undefined)

      if (response.result) {
        console.log("✅ Course updated successfully")
        // Redirect to course detail page
        router.push(`/authorized/lms/app/lecturer/courses/${courseId}`)
      }
    } catch (err: any) {
      console.error("Error updating course:", err)
      setError(err.message || "Không thể cập nhật khóa học. Vui lòng thử lại.")
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

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Không tìm thấy khóa học</p>
          <Link href="/authorized/lms/app/lecturer/courses">
            <Button className="mt-4">Quay lại danh sách</Button>
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
            <h1 className="text-3xl font-bold">Chỉnh sửa khóa học</h1>
            <p className="text-muted-foreground mt-1">Cập nhật thông tin khóa học của bạn</p>
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
              <CardDescription>Thông tin chính về khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên khóa học *</Label>
                <Input
                  id="title"
                  placeholder="VD: Lập trình React từ cơ bản đến nâng cao"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về khóa học..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <select
                    id="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CourseStatus)}
                  >
                    <option value="UPCOMING">Sắp mở</option>
                    <option value="OPEN">Đã mở</option>
                    <option value="CLOSED">Đã đóng</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Ngày bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Ngày kết thúc</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min={startTime}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Ảnh khóa học</Label>
                <div className="space-y-2">
                  {currentImage && (
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={`${LMS_API_CONFIG.baseUrl}${currentImage}`}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      ✅ New image selected: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Giá và xuất bản</CardTitle>
              <CardDescription>Đặt giá cho khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="isFree" className="cursor-pointer">
                  Khóa học miễn phí
                </Label>
              </div>

              {!isFree && (
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href={`/authorized/lms/app/lecturer/courses/${courseId}`}>
              <Button type="button" variant="outline" disabled={saving}>
                Hủy
              </Button>
            </Link>
            <Button type="submit" disabled={saving || !title.trim() || !categoryId}>
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
