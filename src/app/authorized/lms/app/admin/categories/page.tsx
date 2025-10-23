"use client"

import { useState, useEffect } from "react"
import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { Badge } from "@lms/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lms/components/ui/dialog"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '@/lib/hooks/useLms'
import { CategoryResponse } from '@/lib/lms-api-client'

export default function CategoriesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editCategory, setEditCategory] = useState({ name: "", description: "" })

  // Fetch categories from backend
  const { categories, loading, error, fetchCategories } = useCategories()

  // Create category
  const { createCategory, loading: creating } = useCreateCategory({
    onSuccess: () => {
      alert('✅ Tạo danh mục thành công!')
      fetchCategories() // Reload list
      setShowAddDialog(false)
      setNewCategory({ name: "", description: "" })
    },
    onError: (error) => {
      alert(`❌ Lỗi tạo danh mục: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  // Update category
  const { updateCategory, loading: updating } = useUpdateCategory({
    onSuccess: () => {
      alert('✅ Cập nhật danh mục thành công!')
      fetchCategories()
      setShowEditDialog(false)
    },
    onError: (error) => {
      alert(`❌ Lỗi cập nhật: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  // Delete category
  const { deleteCategory, loading: deleting } = useDeleteCategory({
    onSuccess: () => {
      alert('✅ Xóa danh mục thành công!')
      fetchCategories()
      setShowDeleteDialog(false)
    },
    onError: (error) => {
      alert(`❌ Lỗi xóa danh mục: ${error.message || 'Vui lòng thử lại'}`)
    }
  })

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!newCategory.name || !newCategory.description) {
      alert('❌ Vui lòng điền đầy đủ thông tin')
      return
    }
    try {
      await createCategory(newCategory)
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleEdit = async () => {
    if (!selectedCategory || !editCategory.name || !editCategory.description) {
      alert('❌ Vui lòng điền đầy đủ thông tin')
      return
    }
    try {
      await updateCategory(selectedCategory.id, editCategory)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    try {
      await deleteCategory(selectedCategory.id)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý danh mục" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải danh mục...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Quản lý danh mục" />
        <div className="flex-1 p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h3 className="text-destructive font-semibold mb-2">❌ Lỗi tải dữ liệu</h3>
            <p className="text-muted-foreground mb-4">{error.message || 'Không thể tải danh mục'}</p>
            <Button onClick={fetchCategories}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Quản lý danh mục" />

      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Danh mục khóa học</h1>
            <p className="text-muted-foreground">Quản lý các danh mục và phân loại (LMS Backend)</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchCategories} variant="outline" size="lg" disabled={loading}>
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </div>
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
              <p className="mt-2 text-3xl font-bold">
                {categories.reduce((sum, c) => sum + (c.courses?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">TB khóa học/danh mục</p>
              <p className="mt-2 text-3xl font-bold">
                {categories.length > 0 
                  ? Math.round(categories.reduce((sum, c) => sum + (c.courses?.length || 0), 0) / categories.length)
                  : 0
                }
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
                  {categories.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Chưa có danh mục nào</p>
                      <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo danh mục đầu tiên
                      </Button>
                    </div>
                  ) : (
                    categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FolderOpen className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <p className="font-semibold">{category.name}</p>
                            <Badge variant="secondary">
                              {category.courses?.length || 0} khóa học
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">ID: {category.id}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedCategory(category)
                            setEditCategory({ name: category.name, description: category.description })
                            setShowEditDialog(true)
                          }}
                          disabled={updating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedCategory(category)
                            setShowDeleteDialog(true)
                          }}
                          disabled={deleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
                <Label htmlFor="quick-name">Tên danh mục</Label>
                <Input 
                  id="quick-name" 
                  placeholder="VD: Lập trình"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-description">Mô tả</Label>
                <Input 
                  id="quick-description" 
                  placeholder="Mô tả ngắn về danh mục"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleAdd}
                disabled={creating}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creating ? 'Đang tạo...' : 'Tạo danh mục'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* Dialogs */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  placeholder="VD: Lập trình"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  placeholder="Mô tả ngắn về danh mục"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAdd} disabled={creating}>
                {creating ? 'Đang tạo...' : 'Thêm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
              <DialogDescription>
                Đang chỉnh sửa: {selectedCategory?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tên danh mục</Label>
                <Input 
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input 
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleEdit} disabled={updating}>
                {updating ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa danh mục</DialogTitle>
              <DialogDescription>Bạn có chắc muốn xóa danh mục "{selectedCategory?.name}"?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
