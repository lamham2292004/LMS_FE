"use client";

import { usePathname } from "next/navigation"; // Thêm dòng import này
import { Search, Bell, Sun, Moon, Monitor, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Navbar({ collapsed, setCollapsed }: NavbarProps) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // === LOGIC MỚI NẰM Ở ĐÂY ===
  // Nếu đường dẫn là của trang LMS, không hiển thị gì cả (return null)
  if (pathname.startsWith("/authorized/lms/app")) {
    return null;
  }

  // Nếu không phải trang LMS, hiển thị Navbar như bình thường
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className={styles.header}>
      <div className={styles.topbarleft}>
        {/* Toggle sidebar */}
        <Menu
          size={20}
          className={styles.icon}
          onClick={() => setCollapsed(!collapsed)}
        />

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span>Dashboard</span>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>Overview</span>
        </div>
      </div>
      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <Search size={16} className={styles.searchIcon} />
        </div>

        {mounted && (
          <>
            {theme === "dark" ? (
              <Sun
                size={18}
                className={styles.icon}
                onClick={() => setTheme("light")}
              />
            ) : (
              <Moon
                size={18}
                className={styles.icon}
                onClick={() => setTheme("dark")}
              />
            )}
          </>
        )}

        <Bell size={18} className={styles.icon} />
        <Monitor size={18} className={styles.icon} />
      </div>
    </div>
  );
}