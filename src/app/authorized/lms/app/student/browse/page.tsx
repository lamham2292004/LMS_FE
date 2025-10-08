import { Header } from "@lms/components/header"
import { Card, CardContent } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Badge } from "@lms/components/ui/badge"
import { Input } from "@lms/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lms/components/ui/tabs"
import { Search, Star, Users, Clock, ShoppingCart } from "lucide-react"
import Link from "next/link"

const allCourses = [
  {
    id: 6,
    title: "Machine Learning cơ bản",
    category: "AI & Machine Learning",
    price: 1500000,
    rating: 4.8,
    students: 1234,
    duration: "40 giờ",
    image: "machine learning course",
    instructor: "TS. Nguyễn Văn G",
    level: "Trung cấp",
    isFree: false,
  },
  {
    id: 7,
    title: "Docker & Kubernetes",
    category: "DevOps",
    price: 0,
    rating: 4.9,
    students: 2341,
    duration: "25 giờ",
    image: "docker kubernetes course",
    instructor: "Trần Văn H",
    level: "Nâng cao",
    isFree: true,
  },
  {
    id: 8,
    title: "Node.js Backend Development",
    category: "Backend",
    price: 1200000,
    rating: 4.7,
    students: 987,
    duration: "35 giờ",
    image: "nodejs backend course",
    instructor: "Lê Thị I",
    level: "Trung cấp",
    isFree: false,
  },
  {
    id: 9,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    price: 800000,
    rating: 4.6,
    students: 1567,
    duration: "20 giờ",
    image: "UI UX design course",
    instructor: "Phạm Văn K",
    level: "Cơ bản",
    isFree: false,
  },
  {
    id: 10,
    title: "Git & GitHub cho người mới",
    category: "Tools",
    price: 0,
    rating: 4.9,
    students: 3456,
    duration: "10 giờ",
    image: "git github course",
    instructor: "Hoàng Thị L",
    level: "Cơ bản",
    isFree: true,
  },
  {
    id: 11,
    title: "TypeScript Advanced",
    category: "Lập trình",
    price: 1000000,
    rating: 4.8,
    students: 876,
    duration: "30 giờ",
    image: "typescript advanced course",
    instructor: "Vũ Văn M",
    level: "Nâng cao",
    isFree: false,
  },
]

const categories = [
  "Tất cả",
  "Lập trình",
  "Web Development",
  "AI & Machine Learning",
  "DevOps",
  "Backend",
  "Design",
  "Tools",
]

export default function BrowseCoursesPage() {
  return (
    <div className="flex flex-col">
      <Header title="Khám phá khóa học" showCart />

      <div className="flex-1 p-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm khóa học..." className="pl-10" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category} variant={category === "Tất cả" ? "default" : "outline"} size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tất cả khóa học</TabsTrigger>
            <TabsTrigger value="free">Miễn phí</TabsTrigger>
            <TabsTrigger value="paid">Trả phí</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tìm thấy {allCourses.length} khóa học</p>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Phổ biến nhất</option>
                <option>Mới nhất</option>
                <option>Đánh giá cao</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course) => (
                <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={`/course-${course.id}.jpg?height=200&width=400&query=${course.image}`}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    {course.isFree && (
                      <div className="absolute left-2 top-2">
                        <Badge className="bg-success text-white">Miễn phí</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>

                    <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>

                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {course.isFree ? (
                          <span className="text-lg font-bold text-success">Miễn phí</span>
                        ) : (
                          <span className="text-lg font-bold text-primary">{course.price.toLocaleString()}đ</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" asChild>
                          <Link href="/authorized/lms/app/cart">
                            <ShoppingCart className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/authorized/lms/app/student/courses/${course.id}`}>Xem chi tiết</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses
                .filter((course) => course.isFree)
                .map((course) => (
                  <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={`/course-${course.id}.jpg?height=200&width=400&query=${course.image}`}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <Badge className="absolute left-2 top-2 bg-success text-white">Miễn phí</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>
                      <Button className="w-full" asChild>
                        <Link href={`/authorized/lms/app/student/courses/${course.id}`}>Đăng ký ngay</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="paid">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses
                .filter((course) => !course.isFree)
                .map((course) => (
                  <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={`/course-${course.id}.jpg?height=200&width=400&query=${course.image}`}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{course.title}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{course.price.toLocaleString()}đ</span>
                        <Button size="icon" variant="outline" asChild>
                          <Link href="/authorized/lms/app/cart">
                            <ShoppingCart className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
