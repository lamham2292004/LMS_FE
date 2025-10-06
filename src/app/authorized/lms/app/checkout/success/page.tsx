"use client"

import { Button } from "@lms/components/ui/button"
import { Card } from "@lms/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const orderDetails = {
    orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString("vi-VN"),
    courses: [
      {
        id: "1",
        title: "Lập trình Web với React & Next.js",
        price: 599000,
      },
      {
        id: "2",
        title: "Python cho Data Science",
        price: 799000,
      },
    ],
    total: 1398000,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <Card className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-success/10 p-4">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
          </div>

          <h1 className="mb-2 font-sans text-3xl font-bold text-foreground">Thanh toán thành công!</h1>
          <p className="mb-8 text-muted-foreground">Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ!</p>

          <Card className="mb-8 bg-accent p-6 text-left">
            <div className="mb-4 flex justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-mono font-semibold text-foreground">{orderDetails.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ngày mua</p>
                <p className="font-semibold text-foreground">{orderDetails.date}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Khóa học đã mua:</p>
              {orderDetails.courses.map((course) => (
                <div key={course.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{course.title}</span>
                  <span className="font-semibold text-foreground">{course.price.toLocaleString("vi-VN")}đ</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 font-sans text-lg font-bold">
                <span className="text-foreground">Tổng cộng:</span>
                <span className="text-primary">{orderDetails.total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/student/courses">Xem khóa học của tôi</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/student/browse">Tiếp tục khám phá</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">Hóa đơn đã được gửi đến email của bạn</p>
        </Card>
      </div>
    </div>
  )
}
