"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@lms/components/ui/button"
import { Card } from "@lms/components/ui/card"
import { Input } from "@lms/components/ui/input"
import { Label } from "@lms/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@lms/components/ui/radio-group"
import { CreditCard, Building2, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const cartItems = [
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
  ]

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push("/checkout/success")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 font-sans text-3xl font-bold text-foreground">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Phương thức thanh toán</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold">Thẻ tín dụng / Ghi nợ</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, JCB</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-muted-foreground">Chuyển khoản qua Internet Banking</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex flex-1 cursor-pointer items-center gap-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold">Ví điện tử</div>
                          <div className="text-sm text-muted-foreground">MoMo, ZaloPay, VNPay</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </Card>

              {/* Payment Details */}
              {paymentMethod === "card" && (
                <Card className="p-6">
                  <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Thông tin thẻ</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" type="password" maxLength={3} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Tên trên thẻ</Label>
                      <Input id="cardName" placeholder="NGUYEN VAN A" required />
                    </div>
                  </div>
                </Card>
              )}

              {/* Billing Information */}
              <Card className="p-6">
                <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Thông tin thanh toán</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nguyễn Văn A" required />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0123456789" required />
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 p-6">
                <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Đơn hàng</h2>

                <div className="space-y-3 border-b border-border pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.title}</span>
                      <span className="font-semibold text-foreground">{item.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>

                <div className="my-4 flex justify-between font-sans text-xl font-bold text-foreground">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">Giao dịch được bảo mật và mã hóa</p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
