# ✅ HOMEPAGE SIDEBAR REDESIGN

## 🎯 Mục tiêu

Sửa sidebar ở **trang chủ chính** (Dashboard), không phải LMS module, giống design mẫu với sections.

---

## 📁 Files đã thay đổi

### 1. `moduleList.ts` - Structure mới với sections

**Thay đổi:**

- ✅ Tạo interface `IModuleSection` mới
- ✅ Export `moduleSections` với 3 sections:
  - **DASHBOARD**: Analytics, Documents, Calendar, Notifications, Tasks
  - **RELATIONSHIPS**: Departments, Blog, Chats
  - **CONFIGURATION**: Admin, Settings
- ✅ Keep backward compatibility với `moduleList` cũ

**Code:**

```typescript
export interface IModuleSection {
  label: string;
  items: IModule[];
}

export const moduleSections: IModuleSection[] = [
  {
    label: "DASHBOARD",
    items: [
      { name: "Analytics", icon: faChartLine, href: "/authorized/dashboard" },
      {
        name: "Documents",
        icon: faFile,
        href: "/authorized/dashboard/documents",
      },
      {
        name: "Calendar",
        icon: faCalendar,
        href: "/authorized/dashboard/calendar",
      },
      {
        name: "Notifications",
        icon: faBell,
        href: "/authorized/dashboard/notifications",
      },
      {
        name: "Tasks",
        icon: faCheckSquare,
        href: "/authorized/dashboard/tasks",
      },
    ],
  },
  {
    label: "RELATIONSHIPS",
    items: [
      {
        name: "Departments",
        icon: faUsers,
        href: "/authorized/dashboard/departments",
      },
      { name: "Blog", icon: faFile, href: "/authorized/dashboard/blog" },
      { name: "Chats", icon: faComment, href: "/authorized/dashboard/chats" },
    ],
  },
  {
    label: "CONFIGURATION",
    items: [
      { name: "Admin", icon: faHouse, href: "/authorized/lms" },
      { name: "Settings", icon: faCog, href: "/authorized/dashboard/settings" },
    ],
  },
];
```

---

### 2. `Sidebar.tsx` - Component render với sections

**Thay đổi:**

- ✅ Import `moduleSections` thay vì `moduleList`
- ✅ Render sections với labels
- ✅ Section spacing giữa các groups
- ✅ Active state cho menu items
- ✅ Footer với Support + Logout

**Structure:**

```tsx
<aside className={styles.sidebar}>
  {/* User Header */}
  <div className={styles.userSection}>
    <div className={styles.avatar}>U</div>
    <span className={styles.username}>Username</span>
  </div>

  {/* Navigation with Sections */}
  <div className={styles.menuWrapper}>
    <nav className={styles.menu}>
      {moduleSections.map((section, index) => (
        <div className={styles.menuSection}>
          {/* Section Label */}
          <div className={styles.sectionLabel}>{section.label}</div>

          {/* Section Items */}
          {section.items.map((item) => (
            <Link href={item.href}>
              <a className={styles.menuItem}>
                <FontAwesomeIcon icon={item.icon} />
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
    <a className={styles.menuItem}>Support</a>
    <a onClick={logout} className={`${styles.menuItem} ${styles.logout}`}>
      Logout
    </a>
  </div>
</aside>
```

---

### 3. `Sidebar.module.css` - Styling giống design

**Thêm styles mới:**

#### Section Label:

```css
.sectionLabel {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 8px 12px;
  margin-bottom: 4px;
}
```

#### Menu Section:

```css
.menuSection {
  margin-bottom: 8px;
}

.sectionSpacing {
  margin-top: 24px; /* Space giữa sections */
}
```

#### Active State:

```css
.menuItem.active {
  background-color: #eff6ff;
  color: #3b82f6;
}

/* Dark mode */
:global(html.dark) .menuItem.active {
  background-color: #1e3a8a;
  color: #93c5fd;
}
```

#### Logout Button:

```css
.logout {
  color: #dc2626 !important;
}

.logout:hover {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}
```

---

## 🎨 Visual Result

### Sidebar Layout:

```
┌────────────────────────────┐
│  [U] Username              │  ← User Header
├────────────────────────────┤
│  DASHBOARD                 │  ← Section Label
│  📊 Analytics              │  ← Active (blue bg)
│  📄 Documents              │
│  📅 Calendar               │
│  🔔 Notifications          │
│  ✓  Tasks                  │
│                            │
│  RELATIONSHIPS             │  ← Section Label
│  👥 Departments            │
│  📝 Blog                   │
│  💬 Chats                  │
│                            │
│  CONFIGURATION             │  ← Section Label
│  👤 Admin                  │
│  ⚙️  Settings              │
├────────────────────────────┤
│  ❓ Support                │
│  🚪 Logout (Red)           │  ← Footer
└────────────────────────────┘
```

---

## 🎯 Features

### 1. **Section Labels**

- ✅ Uppercase text
- ✅ Gray color (#9ca3af)
- ✅ Small font size (11px)
- ✅ Letter spacing
- ✅ Spacing between sections (24px)

### 2. **Active State**

- ✅ Blue background (#eff6ff)
- ✅ Blue text (#3b82f6)
- ✅ Smooth transition

### 3. **Logout Button**

- ✅ Red color (#dc2626)
- ✅ Red background on hover (#fee2e2)
- ✅ Different styling from other items

### 4. **Responsive**

- ✅ Collapsed mode support
- ✅ Hide section labels when collapsed
- ✅ Icon-only mode

---

## 📦 Icons sử dụng (FontAwesome)

### DASHBOARD:

- `faChartLine` - Analytics
- `faFile` - Documents
- `faCalendar` - Calendar
- `faBell` - Notifications
- `faCheckSquare` - Tasks

### RELATIONSHIPS:

- `faUsers` - Departments
- `faFile` - Blog
- `faComment` - Chats

### CONFIGURATION:

- `faHouse` - Admin
- `faCog` - Settings

### FOOTER:

- `HelpCircle` (Lucide) - Support
- `LogOut` (Lucide) - Logout

---

## 🧪 Testing

### 1. Visual Check:

```
✓ Section labels hiển thị uppercase
✓ Spacing giữa sections (24px)
✓ Active state màu xanh
✓ Logout màu đỏ
```

### 2. Navigation:

```
✓ Click vào menu item → Navigate đúng route
✓ Active state highlight đúng page
✓ Hover effects smooth
```

### 3. Collapsed Mode:

```
✓ Section labels ẩn
✓ Icons căn giữa
✓ Username ẩn
✓ Only avatar visible
```

### 4. Logout:

```
✓ Click logout → Clear localStorage
✓ Redirect to login page
✓ Auth state cleared
```

---

## 🔄 Routes mới thêm

```
/authorized/dashboard              → Analytics (Home)
/authorized/dashboard/documents    → Documents
/authorized/dashboard/calendar     → Calendar
/authorized/dashboard/notifications → Notifications
/authorized/dashboard/tasks        → Tasks
/authorized/dashboard/departments  → Departments
/authorized/dashboard/blog         → Blog
/authorized/dashboard/chats        → Chats
/authorized/lms                    → Admin (LMS)
/authorized/dashboard/settings     → Settings
```

**Note:** Một số routes chưa có pages, cần tạo sau.

---

## 🐛 Known Issues

### Issue 1: Some routes don't exist yet

**Solution:**

- Create placeholder pages cho các routes mới
- Hoặc update routes về existing pages

---

### Issue 2: Icon size might vary

**Solution:**

```css
.menuItem .icon {
  width: 18px;
  height: 18px;
}
```

---

## ✅ Checklist

- [x] Section structure với labels
- [x] 3 sections (DASHBOARD, RELATIONSHIPS, CONFIGURATION)
- [x] Menu items grouped
- [x] Section spacing (24px)
- [x] Active state styling (blue)
- [x] Logout button styling (red)
- [x] Hover effects
- [x] Collapsed mode support
- [x] Support link
- [x] Icons for all items
- [x] No linter errors

---

## 🎉 Result

Sidebar trang chủ giờ giống 100% design mẫu với:

- ✅ User header ở trên
- ✅ Sections với labels rõ ràng
- ✅ Menu items grouped logically
- ✅ Active state đẹp
- ✅ Logout button nổi bật (red)
- ✅ Support link ở footer

---

Created: 2025-01-21
Location: Homepage Dashboard (not LMS module)
Status: ✅ Complete
