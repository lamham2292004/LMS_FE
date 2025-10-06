"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Sidebar.module.css";
import { moduleList } from "./moduleList";
import { useAuth } from "@/features/auth";
import { LogOut, HelpCircle } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.userSection}>
        <div className={styles.avatar}>{user?.full_name?.charAt(0) || "U"}</div>
        <span className={styles.username}>{user?.full_name || "Username"}</span>
      </div>

      <div className={styles.menuWrapper}>
        <nav className={styles.menu}>
          {moduleList.map((item) => (
            // SỬA LỖI: Đổi item.path thành item.href để khớp với dữ liệu
            <Link href={item.href} key={item.name} legacyBehavior>
              <a
                className={`${styles.menuItem} ${
                  pathname === item.href ? "active" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  size="lg"
                  className={styles.icon}
                />
                <span>{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.bottomMenu}>
        <a href="#" className={styles.menuItem}>
          <HelpCircle size={18} className={styles.icon} />
          <span>Support</span>
        </a>
        <a onClick={() => logout()} className={`${styles.menuItem} ${styles.logout}`}>
          <LogOut size={18} className={styles.icon} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}