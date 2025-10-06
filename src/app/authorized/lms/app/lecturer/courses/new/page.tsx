"use client"

import { useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Textarea } from "@lms/components/ui/textarea"
import { ArrowRight, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleCreateCourse = () => {
    // In real app, create course via API and redirect to the new course's edit page
    router.push("/lecturer/courses")
  }

  return (
    <div className="flex flex-col">
      <Header title="Tạo khóa học mới" />

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`h-1 w-16 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Bước 1: Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên khóa học</Label>
                  <Input id="title" placeholder="VD: Lập trình Python từ cơ bản đến nâng cao" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả ngắn</Label>
                  <Textarea id="description" rows={3} placeholder="Mô tả ngắn gọn về khóa học của bạn..." />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <select id="category" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="">Chọn danh mục</option>
                      <option>Lập trình</option>
                      <option>Web Development</option>
                      <option>AI & Machine Learning</option>
                      <option>DevOps</option>
                      <option>Database</option>
                      <option>Design</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Cấp độ</Label>
                    <select id="level" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="">Chọn cấp độ</option>
                      <option>Cơ bản</option>
                      <option>Trung cấp</option>
                      <option>Nâng cao</option>
                    </select>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">
                  Tiếp theo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Bước 2: Mục tiêu học tập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Học viên sẽ học được gì?</Label>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Input key={i} placeholder={`Mục tiêu ${i}`} />
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Thêm mục tiêu
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Yêu cầu trước khi học</Label>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Input key={i} placeholder={`Yêu cầu ${i}`} />
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Thêm yêu cầu
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Tiếp theo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Bước 3: Giá và xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <input type="checkbox" id="isFree" className="h-4 w-4" />
                  <Label htmlFor="isFree">Khóa học miễn phí</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá khóa học (VNĐ)</Label>
                  <Input id="price" type="number" placeholder="1500000" />
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Bước tiếp theo</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sau khi tạo khóa học, bạn sẽ được chuyển đến trang chỉnh sửa để thêm bài học, video và nội dung chi
                    tiết.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Quay lại
                  </Button>
                  <Button onClick={handleCreateCourse} className="flex-1">
                    Tạo khóa học
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
