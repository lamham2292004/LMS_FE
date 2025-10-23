"use client"

import { useState, useEffect } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Search, RefreshCw, Eye, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lms/components/ui/dialog"
import Link from "next/link"
import { Textarea } from "@lms/components/ui/textarea"
import { useAdminCourses, useApproveCourse, useDeleteCourse } from '@/lib/hooks/useLms'
import { ApprovalStatus, CourseResponse } from '@/lib/lms-api-client'

export default function AdminCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const { courses, loading, error, fetchCourses } = useAdminCourses()
  
  const { approveCourse, loading: approving } = useApproveCourse({
    onSuccess: () => {
      alert('✅ Khóa học đã được phê duyệt thành công!')
      fetchCourses() // Reload danh sách
      setShowApproveDialog(false)
    },
    onError: (error) => {
      alert(`❌ Lỗi phê duyệt: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  const { deleteCourse, loading: deleting } = useDeleteCourse({
    onSuccess: () => {
      alert('✅ Khóa học đã được xóa!')
      fetchCourses() // Reload danh sách
      setShowDeleteDialog(false)
    },
    onError: (error) => {
      alert(`❌ Lỗi xóa khóa học: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  // Debug: Kiểm tra approvalStatus
  useEffect(() => {
    if (courses.length > 0) {
      console.log('🔍 Debug courses:', courses.map(c => ({
        id: c.id,
        title: c.title,
        approvalStatus: c.approvalStatus,
        approvalStatusType: typeof c.approvalStatus
      })))
      console.log('🔍 ApprovalStatus enum:', ApprovalStatus)
    }
  }, [courses])

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = async () => {
    if (!selectedCourse) return
    
    try {
      await approveCourse(selectedCourse.id, {
        approvalStatus: ApprovalStatus.APPROVED
      })
    } catch (error) {
      console.error('Failed to approve course:', error)
    }
  }

  const handleSubmitRejection = async () => {
    if (!selectedCourse || !rejectionReason.trim()) return
    
    try {
      await approveCourse(selectedCourse.id, {
        approvalStatus: ApprovalStatus.REJECTED,
        rejectionReason: rejectionReason.trim()
      })
      
      alert('✅ Khóa học đã bị từ chối!')
      fetchCourses()
      setShowRejectDialog(false)
      setRejectionReason("")
    } catch (error: any) {
      console.error('Failed to reject course:', error)
      alert(`❌ Lỗi từ chối: ${error.message || 'Vui lòng thử lại'}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedCourse) return
    
    try {
      await deleteCourse(selectedCourse.id)
    } catch (error) {
      console.error('Failed to delete course:', error)
    }
  }

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý khóa học" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải khóa học từ backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý khóa học" />
        <div className="flex-1 p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h3 className="text-destructive font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">{error.message || 'Không thể tải khóa học'}</p>
            <Button onClick={fetchCourses}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  // Filter by approval status (so sánh cả string và enum)
  const publishedCourses = filteredCourses.filter(c => 
    c.approvalStatus === ApprovalStatus.APPROVED || String(c.approvalStatus) === 'APPROVED'
  )
  const pendingCourses = filteredCourses.filter(c => 
    c.approvalStatus === ApprovalStatus.PENDING || String(c.approvalStatus) === 'PENDING'
  )
  const rejectedCourses = filteredCourses.filter(c => 
    c.approvalStatus === ApprovalStatus.REJECTED || String(c.approvalStatus) === 'REJECTED'
  )
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0)

  return (
    <div className="flex flex-col">
      <Header title="Quản lý khóa học" />

      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tất cả khóa học</h1>
            <p className="text-muted-foreground">Quản lý và phê duyệt khóa học (LMS Backend)</p>
          </div>
          <Button onClick={fetchCourses} variant="outline" size="lg" disabled={loading}>
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng khóa học</p>
              <p className="mt-2 text-3xl font-bold">{courses.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Đã phê duyệt</p>
              <p className="mt-2 text-3xl font-bold">{publishedCourses.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingCourses.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng học viên</p>
              <p className="mt-2 text-3xl font-bold">
                {totalStudents.toLocaleString()}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({filteredCourses.length})</TabsTrigger>
            <TabsTrigger value="published">Đã phê duyệt ({publishedCourses.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt ({pendingCourses.length})</TabsTrigger>
            <TabsTrigger value="rejected">Bị từ chối ({rejectedCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy khóa học nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                <Card key={course.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-32 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={imageUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/course-1.png';
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <Badge
                              className={
                                (course.approvalStatus === ApprovalStatus.APPROVED || String(course.approvalStatus) === 'APPROVED')
                                  ? "bg-success text-white"
                                  : (course.approvalStatus === ApprovalStatus.PENDING || String(course.approvalStatus) === 'PENDING')
                                    ? "bg-yellow-500 text-white"
                                    : "bg-red-500 text-white"
                              }
                              onClick={() => console.log(`🔍 Course ${course.id}:`, { 
                                approvalStatus: course.approvalStatus, 
                                type: typeof course.approvalStatus,
                                isPending: course.approvalStatus === ApprovalStatus.PENDING,
                                isStringPending: String(course.approvalStatus) === 'PENDING',
                                raw: JSON.stringify(course.approvalStatus)
                              })}
                            >
                              {(course.approvalStatus === ApprovalStatus.APPROVED || String(course.approvalStatus) === 'APPROVED')
                                ? "Đã phê duyệt"
                                : (course.approvalStatus === ApprovalStatus.PENDING || String(course.approvalStatus) === 'PENDING')
                                  ? "Chờ duyệt"
                                  : "Bị từ chối"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Danh mục: {course.categoryName}</span>
                            <span>•</span>
                            <span>Teacher ID: {course.teacherId}</span>
                            <span>•</span>
                            <span>{course.enrollments?.length || 0} học viên</span>
                            <span>•</span>
                            <span className="font-semibold text-primary">
                              {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()}đ`}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Tạo lúc: {course.createdAt ? new Date(course.createdAt).toLocaleString('vi-VN') : 'N/A'}
                          </p>
                          
                          {(course.approvalStatus === ApprovalStatus.REJECTED || String(course.approvalStatus) === 'REJECTED') && course.rejectionReason && (
                            <p className="mt-2 text-xs text-red-600">
                              <strong>Lý do từ chối:</strong> {course.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/authorized/lms/app/admin/courses/${course.id}/preview`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem
                          </Link>
                        </Button>
                        {(course.approvalStatus === ApprovalStatus.PENDING || String(course.approvalStatus) === 'PENDING') && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course)
                                setShowApproveDialog(true)
                              }}
                              disabled={approving}
                            >
                              Phê duyệt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course)
                                setShowRejectDialog(true)
                              }}
                              disabled={approving}
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setShowDeleteDialog(true)
                          }}
                          disabled={deleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="published">
            {publishedCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có khóa học đã phê duyệt</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedCourses.map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';
                    
                  return (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={imageUrl} alt={course.title} className="w-24 h-16 object-cover rounded" onError={(e) => { e.currentTarget.src = '/images/course-1.png'; }} />
                          <div className="flex-1">
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.categoryName} • {course.enrollments?.length || 0} học viên</p>
                          </div>
                          <Badge className="bg-success text-white">Đã phê duyệt</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có khóa học chờ phê duyệt</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCourses.map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';
                    
                  return (
                    <Card key={course.id} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={imageUrl} alt={course.title} className="w-24 h-16 object-cover rounded" onError={(e) => { e.currentTarget.src = '/images/course-1.png'; }} />
                          <div className="flex-1">
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.categoryName} • {course.price.toLocaleString()}đ</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => { setSelectedCourse(course); setShowApproveDialog(true); }}>
                              Phê duyệt
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => { setSelectedCourse(course); setShowRejectDialog(true); }}>
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {rejectedCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có khóa học bị từ chối</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rejectedCourses.map((course) => {
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';
                    
                  return (
                    <Card key={course.id} className="border-red-200 bg-red-50 dark:bg-red-950">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img src={imageUrl} alt={course.title} className="w-24 h-16 object-cover rounded" onError={(e) => { e.currentTarget.src = '/images/course-1.png'; }} />
                          <div className="flex-1">
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">{course.categoryName}</p>
                            {course.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1"><strong>Lý do:</strong> {course.rejectionReason}</p>
                            )}
                          </div>
                          <Badge variant="destructive">Bị từ chối</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối khóa học</DialogTitle>
            <DialogDescription>Vui lòng nhập lý do từ chối khóa học "{selectedCourse?.title}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleSubmitRejection} disabled={!rejectionReason.trim()}>
              Từ chối
            </Button>
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
