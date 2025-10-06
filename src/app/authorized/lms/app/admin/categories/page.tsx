import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Badge } from "@lms/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Lập trình",
    slug: "lap-trinh",
    courses: 156,
    description: "Các khóa học về lập trình và phát triển phần mềm",
  },
  {
    id: 2,
    name: "Web Development",
    slug: "web-development",
    courses: 89,
    description: "Phát triển web frontend và backend",
  },
  {
    id: 3,
    name: "Data Science",
    slug: "data-science",
    courses: 67,
    description: "Khoa học dữ liệu và phân tích",
  },
  {
    id: 4,
    name: "AI & Machine Learning",
    slug: "ai-ml",
    courses: 45,
    description: "Trí tuệ nhân tạo và học máy",
  },
  {
    id: 5,
    name: "Mobile Development",
    slug: "mobile-dev",
    courses: 34,
    description: "Phát triển ứng dụng di động",
  },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col">
      <Header title="Quản lý danh mục" />

      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Danh mục khóa học</h1>
            <p className="text-muted-foreground">Quản lý các danh mục và phân loại</p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng danh mục</p>
              <p className="mt-2 text-3xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng khóa học</p>
              <p className="mt-2 text-3xl font-bold">{categories.reduce((sum, c) => sum + c.courses, 0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">TB khóa học/danh mục</p>
              <p className="mt-2 text-3xl font-bold">
                {Math.round(categories.reduce((sum, c) => sum + c.courses, 0) / categories.length)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Categories List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FolderOpen className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <p className="font-semibold">{category.name}</p>
                            <Badge>{category.courses} khóa học</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Slug: {category.slug}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Category Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thêm danh mục mới</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên danh mục</Label>
                  <Input id="name" placeholder="VD: Lập trình" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="VD: lap-trinh" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" placeholder="Mô tả ngắn về danh mục" />
                </div>

                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo danh mục
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
