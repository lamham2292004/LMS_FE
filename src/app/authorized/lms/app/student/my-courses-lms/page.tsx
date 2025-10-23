'use client';

import { useEffect } from 'react';
import { Header } from "@lms/components/header";
import { Card, CardContent } from "@lms/components/ui/card";
import { Button } from "@lms/components/ui/button";
import { Progress } from "@lms/components/ui/progress";
import { Badge } from "@lms/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs";
import { Play, Clock, Award, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useMyEnrollments } from '@/lib/hooks/useLms';

export default function MyCoursesLMSPage() {
  const { enrollments, loading, error, fetchEnrollments } = useMyEnrollments({
    onError: (err) => {
      if (err.code === 2103) {
        // Student only error
        console.error('This feature is for students only');
      }
    }
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Separate by status
  const activeCourses = enrollments.filter(e => e.status === 'ACTIVE');
  const completedCourses = enrollments.filter(e => e.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Khóa học của tôi" showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải khóa học của bạn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Khóa học của tôi" showCart />
        <div className="flex-1 p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h3 className="text-destructive font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">
              {error.code === 2103 
                ? 'Chức năng này chỉ dành cho sinh viên. Vui lòng đăng nhập với tài khoản sinh viên.'
                : error.message
              }
            </p>
            <Button onClick={fetchEnrollments}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Khóa học của tôi (LMS Backend)" showCart />

      <div className="flex-1 p-6">
        {/* Stats Summary */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đang học</p>
                  <p className="text-3xl font-bold text-primary">{activeCourses.length}</p>
                </div>
                <Play className="h-12 w-12 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                  <p className="text-3xl font-bold">{completedCourses.length}</p>
                </div>
                <Award className="h-12 w-12 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số khóa học</p>
                  <p className="text-3xl font-bold">{enrollments.length}</p>
                </div>
                <Clock className="h-12 w-12 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchEnrollments}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="learning" className="space-y-6">
          <TabsList>
            <TabsTrigger value="learning">Đang học ({activeCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Đã hoàn thành ({completedCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-4">
            {activeCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Chưa có khóa học nào
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Bạn chưa đăng ký khóa học nào. Hãy khám phá và đăng ký các khóa học mới!
                  </p>
                  <Link href="/authorized/lms/app/student/browse-lms">
                    <Button>Khám phá khóa học</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-5">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-green-100 text-green-800">
                          ✅ Đang học
                        </Badge>
                        {enrollment.progress !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {enrollment.progress}%
                          </span>
                        )}
                      </div>

                      {/* Course Name */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {enrollment.courseName}
                      </h3>

                      {/* Enrolled Date */}
                      <p className="text-sm text-muted-foreground mb-4">
                        📅 Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>

                      {/* Progress Bar */}
                      {enrollment.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Tiến độ</span>
                            <span className="font-semibold">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} />
                        </div>
                      )}

                      {/* Action Button */}
                      <Link href={`/authorized/lms/app/student/courses/${enrollment.courseId}`}>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Vào học
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Bạn chưa hoàn thành khóa học nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-5">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          🎓 Hoàn thành
                        </Badge>
                      </div>

                      {/* Course Name */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {enrollment.courseName}
                      </h3>

                      {/* Enrolled Date */}
                      <p className="text-sm text-muted-foreground mb-4">
                        ✅ Hoàn thành: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/authorized/lms/app/student/courses/${enrollment.courseId}`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            Xem lại
                          </Button>
                        </Link>
                        <Button className="flex-1">
                          Chứng chỉ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

