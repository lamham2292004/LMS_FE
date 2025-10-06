import { Header } from "@lms/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@lms/components/ui/card"
import { Button } from "@lms/components/ui/button"
import { Input } from "@lms/components/ui/input"
import { Badge } from "@lms/components/ui/badge"
import { Search, Download, Filter } from "lucide-react"

const transactions = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    user: "Nguyễn Văn A",
    course: "Lập trình Python cơ bản",
    amount: 1500000,
    method: "Thẻ tín dụng",
    status: "completed",
    date: "28/03/2025 14:30",
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    user: "Trần Thị B",
    course: "Web Development với React",
    amount: 2000000,
    method: "Chuyển khoản",
    status: "completed",
    date: "28/03/2025 13:15",
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    user: "Lê Văn C",
    course: "Data Science với Python",
    amount: 2500000,
    method: "Ví điện tử",
    status: "pending",
    date: "28/03/2025 12:00",
  },
  {
    id: "TXN-004",
    orderId: "ORD-004",
    user: "Phạm Thị D",
    course: "Machine Learning Advanced",
    amount: 3000000,
    method: "Thẻ tín dụng",
    status: "failed",
    date: "27/03/2025 16:45",
  },
]

export default function TransactionsPage() {
  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="flex flex-col">
      <Header title="Quản lý giao dịch" />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Giao dịch</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các giao dịch</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="mt-2 text-3xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Giao dịch thành công</p>
              <p className="mt-2 text-3xl font-bold">{transactions.filter((t) => t.status === "completed").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Đang xử lý</p>
              <p className="mt-2 text-3xl font-bold">{transactions.filter((t) => t.status === "pending").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Thất bại</p>
              <p className="mt-2 text-3xl font-bold">{transactions.filter((t) => t.status === "failed").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm giao dịch..." className="pl-10" />
          </div>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-semibold">{transaction.course}</p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status === "completed"
                            ? "Thành công"
                            : transaction.status === "pending"
                              ? "Đang xử lý"
                              : "Thất bại"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Người mua: {transaction.user}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{transaction.amount.toLocaleString()}đ</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-6">
                      <span>Mã GD: {transaction.id}</span>
                      <span>•</span>
                      <span>Đơn hàng: {transaction.orderId}</span>
                      <span>•</span>
                      <span>Phương thức: {transaction.method}</span>
                    </div>

                    <span>{transaction.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
