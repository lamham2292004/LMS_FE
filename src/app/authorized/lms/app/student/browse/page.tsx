'use client';

import { useEffect, useState } from "react";
import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Input } from "@lms/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Search, Star, Users, Clock, ShoppingCart, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useCourses, useCategories } from '@/lib/hooks/useLms';
import EnrollButton from '@/components/LMS/EnrollButton';

export default function BrowseCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const { courses, loading: coursesLoading, error: coursesError, fetchCourses } = useCourses();
  const { categories, loading: categoriesLoading, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  // Separate by price
  const freeCourses = sortedCourses.filter(c => c.price === 0);
  const paidCourses = sortedCourses.filter(c => c.price > 0);

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Khám phá khóa học" showCart />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải khóa học từ backend...</p>
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="flex flex-col">
        <Header title="Khám phá khóa học" showCart />
        <div className="flex-1 p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h3 className="text-destructive font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">{coursesError.message}</p>
            <Button onClick={fetchCourses}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Khám phá khóa học (LMS Backend)" showCart />

      <div className="flex-1 p-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm khóa học..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={fetchCourses} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.name ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả khóa học ({sortedCourses.length})</TabsTrigger>
            <TabsTrigger value="free">Miễn phí ({freeCourses.length})</TabsTrigger>
            <TabsTrigger value="paid">Trả phí ({paidCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tìm thấy {sortedCourses.length} khóa học</p>
              <select 
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Phổ biến nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>

            {sortedCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy khóa học nào</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedCourses.map((course) => {
                  // Build full image URL from backend
                  const imageUrl = course.img 
                    ? (course.img.startsWith('http') 
                        ? course.img 
                        : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                    : '/images/course-1.png';

                  return (
                  <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-1.png';
                        }}
                      />
                      <div className="absolute right-2 top-2">
                        <Badge 
                          variant="secondary"
                          className={
                            course.status === 'OPEN' ? 'bg-green-500 text-white' :
                            course.status === 'UPCOMING' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }
                        >
                          {course.status === 'OPEN' ? '🟢 Đang mở' :
                           course.status === 'UPCOMING' ? '🔵 Sắp mở' :
                           '🔴 Đã đóng'}
                        </Badge>
                      </div>
                      {course.price === 0 && (
                        <div className="absolute left-2 top-2">
                          <Badge className="bg-success text-white">Miễn phí</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {course.categoryName}
                        </Badge>
                        {course.startTime && (
                          <Badge variant="outline" className="text-xs">
                            📅 {new Date(course.startTime).toLocaleDateString('vi-VN')}
                          </Badge>
                        )}
                      </div>

                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>

                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                      {course.lessons && course.lessons.length > 0 && (
                        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.lessons.length} bài học</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-lg font-bold text-success">Miễn phí</span>
                          ) : (
                            <span className="text-lg font-bold text-primary">{course.price.toLocaleString()}đ</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <EnrollButton 
                            courseId={course.id}
                            courseName={course.title}
                            courseStatus={course.status}
                            startTime={course.startTime}
                            className="text-sm px-3 py-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="free">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {freeCourses.map((course) => {
                const imageUrl = course.img 
                  ? (course.img.startsWith('http') 
                      ? course.img 
                      : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                  : '/images/course-1.png';
                
                return (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/course-1.png';
                      }}
                    />
                    <Badge className="absolute left-2 top-2 bg-success text-white">Miễn phí</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <EnrollButton 
                      courseId={course.id}
                      courseName={course.title}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="paid">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paidCourses.map((course) => {
                const imageUrl = course.img 
                  ? (course.img.startsWith('http') 
                      ? course.img 
                      : `${process.env.NEXT_PUBLIC_LMS_API_URL?.replace('/api', '') || 'http://localhost:8083'}${course.img.startsWith('/') ? '' : '/'}${course.img}`)
                  : '/images/course-1.png';
                
                return (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/course-1.png';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{course.price.toLocaleString()}đ</span>
                      <EnrollButton 
                        courseId={course.id}
                        courseName={course.title}
                        className="text-sm px-3 py-2"
                      />
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
