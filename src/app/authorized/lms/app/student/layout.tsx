import type React from "react";

// Layout này chỉ cần render children, không cần thêm UI
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}