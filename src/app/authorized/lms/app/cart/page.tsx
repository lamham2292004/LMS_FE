"use client"

import { useState } from "react"
import { Button } from "@lms/components/ui/button"
import { Card } from "@lms/components/ui/card"
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  title: string
  instructor: string
  image: string
  price: number
  originalPrice?: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Lập trình Web với React & Next.js",
      instructor: "Nguyễn Văn A",
      image: "/course-1.jpg",
      price: 599000,
      originalPrice: 1200000,
    },
    {
      id: "2",
      title: "Python cho Data Science",
      instructor: "Trần Thị B",
      image: "/course-2.jpg",
      price: 799000,
      originalPrice: 1500000,
    },
  ])

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price)
    }
    return sum
  }, 0)
  const total = subtotal

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 font-sans text-3xl font-bold text-foreground">Giỏ hàng</h1>

          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 font-sans text-xl font-semibold text-foreground">Giỏ hàng trống</h2>
            <p className="mb-6 text-muted-foreground">Hãy khám phá các khóa học và thêm vào giỏ hàng để bắt đầu học!</p>
            <Button asChild>
              <Link href="/authorized/lms/app/student/browse">Khám phá khóa học</Link>
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-sans text-3xl font-bold text-foreground">Giỏ hàng</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-sans text-lg font-semibold text-foreground">
                  {cartItems.length} khóa học trong giỏ
                </h2>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-border pb-4 last:border-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-20 w-32 rounded-lg object-cover"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-sans font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Giảng viên: {item.instructor}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-sans text-lg font-bold text-primary">
                          {item.price.toLocaleString("vi-VN")}đ
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {item.originalPrice.toLocaleString("vi-VN")}đ
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6">
              <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Tổng cộng</h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Giảm giá:</span>
                    <span>-{discount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
              </div>

              <div className="my-4 flex justify-between font-sans text-xl font-bold text-foreground">
                <span>Tổng:</span>
                <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/authorized/lms/app/checkout">
                  Thanh toán
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Bằng việc thanh toán, bạn đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Điều khoản dịch vụ
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
