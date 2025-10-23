"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCategories, useCreateCourse } from '@/lib/hooks/useLms'
import { CourseStatus } from '@/lib/lms-api-client'
import Link from "next/link"

export default function NewCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    categoryId: 0,
    status: CourseStatus.UPCOMING,
    startTime: '',
    endTime: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isFree, setIsFree] = useState(false)
  
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
  const { createCourse, loading: creating, error: createError } = useCreateCourse({
    onSuccess: (data) => {
      alert('✅ Khóa học đã được tạo thành công và đang chờ phê duyệt!')
      router.push('/authorized/lms/app/lecturer/courses')
    },
    onError: (error) => {
      console.error('Error creating course:', error)
      alert(`❌ Lỗi tạo khóa học: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      alert('❌ Vui lòng nhập tên khóa học')
      return
    }
    if (!formData.description.trim()) {
      alert('❌ Vui lòng nhập mô tả khóa học')
      return
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      alert('❌ Vui lòng chọn danh mục')
      return
    }
    if (!imageFile) {
      alert('❌ Vui lòng chọn hình ảnh cho khóa học')
      return
    }

    try {
      // Convert datetime-local format to ISO 8601 with timezone
      const convertToISO = (dateTimeStr: string) => {
        if (!dateTimeStr) return undefined
        // Add seconds and timezone offset (Z for UTC)
        return dateTimeStr + ':00.000Z'
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        price: isFree ? 0 : formData.price,
        categoryId: formData.categoryId,
        status: formData.status,
        startTime: convertToISO(formData.startTime),
        endTime: convertToISO(formData.endTime),
      }
      
      console.log('📤 Sending course data:', courseData)
      await createCourse(courseData, imageFile)
    } catch (error) {
      console.error('Failed to create course:', error)
    }
  }

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải danh mục...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/authorized/lms/app/lecturer/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tạo khóa học mới</h1>
            <p className="text-muted-foreground mt-1">Tạo khóa học và gửi để admin phê duyệt</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khóa học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Tên khóa học *</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})}
                  placeholder="VD: Lập trình Python từ cơ bản đến nâng cao" 
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả khóa học *</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  rows={4} 
                  placeholder="Mô tả chi tiết về khóa học của bạn..." 
                  required
                />
              </div>

              {/* Category and Status */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <select 
                    id="category" 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="0">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái khóa học</Label>
                  <select 
                    id="status" 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as CourseStatus})}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value={CourseStatus.UPCOMING}>Sắp mở</option>
                    <option value={CourseStatus.OPEN}>Đang mở</option>
                    <option value={CourseStatus.CLOSED}>Đã đóng</option>
                  </select>
                </div>
              </div>

              {/* Start and End Time */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                  <Input 
                    id="startTime" 
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Thời gian kết thúc</Label>
                  <Input 
                    id="endTime" 
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Hình ảnh khóa học *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img src={imagePreview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview('')
                        }}
                      >
                        Thay đổi ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <Label htmlFor="image" className="cursor-pointer">
                          <div className="text-sm text-muted-foreground">
                            Click để chọn ảnh hoặc kéo thả vào đây
                          </div>
                        </Label>
                        <Input 
                          id="image" 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn ảnh
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    id="isFree" 
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="h-4 w-4" 
                  />
                  <Label htmlFor="isFree" className="cursor-pointer">Khóa học miễn phí</Label>
                </div>

                {!isFree && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá khóa học (VNĐ)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={formData.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: Number(e.target.value)})}
                      placeholder="1500000"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">📝 Lưu ý quan trọng</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Khóa học sẽ được gửi đến admin để phê duyệt</li>
                  <li>Sau khi tạo, bạn có thể thêm bài học và nội dung chi tiết</li>
                  <li>Khóa học chỉ hiển thị với học viên sau khi được admin phê duyệt</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Link href="/authorized/lms/app/lecturer/courses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Hủy bỏ
                  </Button>
                </Link>
                <Button type="submit" disabled={creating} className="flex-1">
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo khóa học'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
