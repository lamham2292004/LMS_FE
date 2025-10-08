import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to student dashboard by default
  redirect("/authorized/lms/app/student")
}
