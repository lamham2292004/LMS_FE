import type React from "react"
import { Sidebar } from "@lms/components/sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="student" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
