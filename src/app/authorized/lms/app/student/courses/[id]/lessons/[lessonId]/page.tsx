"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Alert, AlertDescription } from "@lms/components/ui/alert"
import { 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  FileQuestion,
  Video as VideoIcon,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useLesson, useQuizzesByLesson } from '@/lib/hooks/useLms'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  const lessonId = parseInt(params.lessonId as string)
  
  const { data: lesson, loading, error, execute: fetchLesson } = useLesson(lessonId)
  const { quizzes, loading: loadingQuizzes, fetchQuizzes } = useQuizzesByLesson(lessonId)

  useEffect(() => {
    if (lessonId) {
      fetchLesson()
      fetchQuizzes()
    }
  }, [lessonId])

  if (loading || loadingQuizzes) {
    return (
      <div className="flex flex-col">
        <Header title="Đang tải bài học..." showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải bài học từ backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="flex flex-col">
        <Header title="Lỗi" showCart />
        <div className="flex-1 p-6">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="mb-4 text-2xl font-bold text-destructive">
              {error?.message || "Không tìm thấy bài học"}
            </h1>
            <p className="text-muted-foreground mb-4">
              Bài học không tồn tại hoặc bạn không có quyền truy cập.
            </p>
            <Button asChild>
              <Link href={`/authorized/lms/app/student/courses/${courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại khóa học
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Build video URL if exists
  const videoUrl = lesson.videoPath 
    ? (lesson.videoPath.startsWith('http') 
        ? lesson.videoPath 
        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${lesson.videoPath.startsWith('/') ? '' : '/'}${lesson.videoPath}`)
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={lesson.title} showCart />

      <div className="flex-1 p-6">
        {/* Back button */}
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href={`/authorized/lms/app/student/courses/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại khóa học
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                {videoUrl ? (
                  <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      src={videoUrl}
                      poster="/images/course-1.png"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                ) : (
                  <div className="relative aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <VideoIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Bài học này chưa có video</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">Bài {lesson.orderIndex}</Badge>
                    <Badge variant="outline">{lesson.status}</Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
                  
                  <p className="text-muted-foreground mb-4">{lesson.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {lesson.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration} phút</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quizzes */}
            {quizzes && quizzes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    Bài kiểm tra ({quizzes.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                          
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {quiz.timeLimit && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{quiz.timeLimit} phút</span>
                              </div>
                            )}
                            {quiz.maxAttempts && (
                              <div>
                                <span>Tối đa {quiz.maxAttempts} lần thử</span>
                              </div>
                            )}
                            {quiz.passScore && (
                              <div>
                                <span>Điểm đạt: {quiz.passScore}%</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button asChild>
                          <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lessonId}/quiz/${quiz.id}`}>
                            Làm bài kiểm tra
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Quizzes */}
            {(!quizzes || quizzes.length === 0) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Bài học này chưa có bài kiểm tra nào.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Thông tin bài học</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tiêu đề</p>
                    <p className="font-semibold">{lesson.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Thứ tự</p>
                    <p className="font-semibold">Bài {lesson.orderIndex}</p>
                  </div>

                  {lesson.duration && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Thời lượng</p>
                      <p className="font-semibold">{lesson.duration} phút</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                    <Badge variant="outline">{lesson.status}</Badge>
                  </div>

                  {quizzes && quizzes.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bài kiểm tra</p>
                      <p className="font-semibold">{quizzes.length} bài</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    asChild
                  >
                    <Link href={`/authorized/lms/app/student/courses/${courseId}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại khóa học
                    </Link>
                  </Button>

                  {quizzes && quizzes.length > 0 && (
                    <Button 
                      className="w-full"
                      asChild
                    >
                      <Link href={`/authorized/lms/app/student/courses/${courseId}/lessons/${lessonId}/quiz/${quizzes[0].id}`}>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Làm bài kiểm tra
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

