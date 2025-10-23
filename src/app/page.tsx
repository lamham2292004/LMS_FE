"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/login"); // redirect thẳng tới login
    } else {
      router.push("/authorized/dashboard"); // có token thì vào dashboard
    }
  }, [router]);

  return <div>Protected Content</div>;
}
