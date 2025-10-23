"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Sidebar.module.css";
import { moduleSections } from "./moduleList";
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
      {/* User Header */}
      <div className={styles.userSection}>
        <div className={styles.avatar}>{user?.full_name?.charAt(0) || "U"}</div>
        <span className={styles.username}>{user?.full_name || "Username"}</span>
      </div>

      {/* Navigation with Sections */}
      <div className={styles.menuWrapper}>
        <nav className={styles.menu}>
          {moduleSections.map((section, sectionIndex) => (
            <div 
              key={section.label} 
              className={`${styles.menuSection} ${sectionIndex > 0 ? styles.sectionSpacing : ''}`}
            >
              {/* Section Label */}
              <div className={styles.sectionLabel}>
                {section.label}
              </div>
              
              {/* Section Items */}
              {section.items.map((item) => (
                <Link href={item.href} key={item.name} legacyBehavior>
                  <a
                    className={`${styles.menuItem} ${
                      pathname === item.href ? styles.active : ""
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={styles.icon}
                    />
                    <span>{item.name}</span>
                  </a>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
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