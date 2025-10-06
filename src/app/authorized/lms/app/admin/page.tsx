import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Badge } from "@lms/components/ui/badge"
import { Button } from "@lms/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@lms/components/ui/avatar"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

const stats = {
  totalUsers: 15234,
  userGrowth: 12.5,
  totalCourses: 456,
  courseGrowth: 8.3,
  totalRevenue: 2450000000,
  revenueGrowth: 15.7,
  totalOrders: 3421,
  orderGrowth: -2.4,
}

const recentUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: "student",
    joinDate: "28/03/2025",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    role: "lecturer",
    joinDate: "27/03/2025",
    status: "active",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    role: "student",
    joinDate: "26/03/2025",
    status: "pending",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    user: "Nguyễn Văn D",
    course: "Lập trình Python cơ bản",
    amount: 1500000,
    status: "completed",
    date: "28/03/2025 14:30",
  },
  {
    id: "ORD-002",
    user: "Trần Thị E",
    course: "Web Development với React",
    amount: 2000000,
    status: "completed",
    date: "28/03/2025 13:15",
  },
  {
    id: "ORD-003",
    user: "Lê Văn F",
    course: "Data Science với Python",
    amount: 2500000,
    status: "pending",
    date: "28/03/2025 12:00",
  },
]

const pendingCourses = [
  {
    id: 1,
    title: "Machine Learning Advanced",
    lecturer: "Phạm Văn G",
    submittedDate: "25/03/2025",
    status: "pending",
  },
  {
    id: 2,
    title: "DevOps Fundamentals",
    lecturer: "Hoàng Thị H",
    submittedDate: "24/03/2025",
    status: "pending",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Bảng điều khiển Admin" />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">+{stats.userGrowth}%</span>
                    <span className="text-muted-foreground">so với tháng trước</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-primary opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng khóa học</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalCourses}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">+{stats.courseGrowth}%</span>
                    <span className="text-muted-foreground">so với tháng trước</span>
                  </div>
                </div>
                <BookOpen className="h-12 w-12 text-blue-500 opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="mt-2 text-3xl font-bold">{(stats.totalRevenue / 1000000000).toFixed(1)}B</p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">+{stats.revenueGrowth}%</span>
                    <span className="text-muted-foreground">so với tháng trước</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-success opacity-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                  <p className="mt-2 text-3xl font-bold">{stats.totalOrders.toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="font-semibold text-destructive">{stats.orderGrowth}%</span>
                    <span className="text-muted-foreground">so với tháng trước</span>
                  </div>
                </div>
                <ShoppingCart className="h-12 w-12 text-warning opacity-40" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Người dùng mới</CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={user.role === "lecturer" ? "default" : "secondary"}>
                          {user.role === "student" ? "Học viên" : "Giảng viên"}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{user.joinDate}</p>
                      </div>

                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Hoạt động" : "Chờ duyệt"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{order.course}</p>
                        <p className="text-sm text-muted-foreground">{order.user}</p>
                      </div>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{order.id}</span>
                      <span className="font-semibold text-primary">{order.amount.toLocaleString()}đ</span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">{order.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Khóa học chờ duyệt</CardTitle>
                  <Badge variant="destructive">{pendingCourses.length}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <AlertCircle className="h-10 w-10 text-warning" />

                      <div>
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-sm text-muted-foreground">Giảng viên: {course.lecturer}</p>
                        <p className="text-xs text-muted-foreground">Gửi lúc: {course.submittedDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                      <Button size="sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Phê duyệt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
