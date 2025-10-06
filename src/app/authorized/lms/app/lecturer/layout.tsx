import type React from "react"
import { Sidebar } from "@lms/components/sidebar"

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="lecturer" />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
