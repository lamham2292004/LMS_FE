# ✅ SIDEBAR REDESIGN - GIỐNG DESIGN MẪU

## 🎨 Thay đổi giao diện

### Layout mới theo design:

```
┌─────────────────────────────┐
│  [U] Username               │  ← User Avatar + Name
├─────────────────────────────┤
│  DASHBOARD                  │  ← Section Label
│  📊 Analytics               │
│  📄 Documents               │
│  📅 Calendar                │
│  🔔 Notifications           │
│  ✓  Tasks                   │
├─────────────────────────────┤
│  RELATIONSHIPS              │  ← Section Label
│  🏢 Departments             │
│  📝 Blog                    │
│  💬 Chats                   │
├─────────────────────────────┤
│  CONFIGURATION              │  ← Section Label
│  👤 Admin                   │
│  ⚙️  Settings               │
├─────────────────────────────┤
│  ❓ Support                 │
│  🚪 Logout (Red)            │  ← Footer
└─────────────────────────────┘
```

---

## 🔧 Thay đổi code

### File: `sidebar.tsx`

#### 1. **User Header (trên cùng)**

```tsx
{
  /* User Header */
}
<div className="flex items-center gap-3 border-b border-border px-4 py-4">
  <Avatar className="h-10 w-10 bg-muted">
    <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
      {avatarLetter}
    </AvatarFallback>
  </Avatar>
  <span className="text-sm font-medium">{username}</span>
</div>;
```

#### 2. **Sections với Labels**

```tsx
{
  /* Navigation Sections */
}
<nav className="flex-1 overflow-y-auto py-4">
  {sections.map((section, sectionIndex) => (
    <div key={section.label} className={cn("px-3", sectionIndex > 0 && "mt-6")}>
      {/* Section Label */}
      <div className="mb-2 px-3">
        <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          {section.label}
        </h3>
      </div>

      {/* Section Items */}
      <div className="space-y-0.5">
        {section.items.map((item) => (
          <Link href={item.href} className="...">
            <Icon className="mr-3 h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  ))}
</nav>;
```

#### 3. **Footer với Support & Logout**

```tsx
{
  /* Footer */
}
<div className="border-t border-border p-3 space-y-0.5">
  <Link
    href="#"
    className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground"
  >
    <HelpCircle className="mr-3 h-4 w-4" />
    Support
  </Link>
  <button
    onClick={handleLogout}
    className="w-full flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
  >
    <LogOut className="mr-3 h-4 w-4" />
    Logout
  </button>
</div>;
```

---

## 📋 Menu Structure

### Student Menu:

```typescript
{
  DASHBOARD: [
    Tổng quan, Khóa học, Lịch học, Bài kiểm tra
  ],
  LEARNING: [
    Khám phá, Tài liệu
  ],
  CONFIGURATION: [
    Hồ sơ, Cài đặt
  ]
}
```

### Lecturer Menu:

```typescript
{
  DASHBOARD: [
    Tổng quan, Khóa học, Học viên, Lịch dạy
  ],
  TEACHING: [
    Tài liệu, Tin nhắn
  ],
  CONFIGURATION: [
    Hồ sơ, Cài đặt
  ]
}
```

### Admin Menu:

```typescript
{
  DASHBOARD: [
    Tổng quan, Người dùng, Khóa học, Thông báo
  ],
  RELATIONSHIPS: [
    Danh mục, Departments, Chats
  ],
  CONFIGURATION: [
    Giao dịch, Cài đặt
  ]
}
```

---

## 🎯 Features mới

### 1. **User Avatar**

- Avatar với chữ cái đầu của username
- Fallback từ localStorage nếu không có user data
- Style: Circular avatar với background muted

### 2. **Section Labels**

- Uppercase text
- Muted color (gray)
- Spacing giữa các sections
- Font size nhỏ (text-xs)

### 3. **Active State**

- Background: `bg-accent`
- Text color: `accent-foreground`
- Smooth transition

### 4. **Logout Button**

- Màu đỏ (text-red-600)
- Hover: bg-red-50 (light mode), bg-red-950/30 (dark mode)
- Clear localStorage on click
- Redirect to login page

---

## 🔐 Logout Logic

```tsx
const handleLogout = () => {
  // Clear auth token
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }
  // Redirect to login
  router.push("/auth/login");
};
```

---

## 🎨 Styling Details

### Section Labels:

```css
text-xs
font-semibold
text-muted-foreground/70
uppercase
tracking-wider
```

### Menu Items:

```css
/* Normal */
text-muted-foreground
hover:bg-accent/50
hover:text-accent-foreground

/* Active */
bg-accent
text-accent-foreground
```

### Footer Buttons:

```css
/* Support */
text-muted-foreground
hover:bg-accent/50

/* Logout */
text-red-600
hover:bg-red-50
dark:hover:bg-red-950/30
```

---

## 📦 Dependencies

### Icons (lucide-react):

- BarChart3 (Analytics)
- BookOpen (Courses)
- Users (Users)
- Calendar (Calendar)
- Bell (Notifications)
- CheckSquare (Tasks)
- FileText (Documents/Categories)
- Building2 (Departments)
- MessageCircle (Chats)
- UserCheck (Profile)
- Settings (Settings)
- HelpCircle (Support)
- LogOut (Logout)

### Components:

- Avatar (from @lms/components/ui/avatar)
- Link (from next/link)
- useRouter, usePathname (from next/navigation)
- cn (from @lms/lib/utils)

---

## 🧪 Testing

### 1. User Avatar:

```
✓ Hiển thị chữ cái đầu của username
✓ Fallback to "U" nếu không có username
✓ Circular avatar
```

### 2. Navigation:

```
✓ Active state highlight
✓ Hover effects
✓ Smooth transitions
✓ Icons align với text
```

### 3. Sections:

```
✓ Labels uppercase và muted
✓ Spacing giữa sections (mt-6)
✓ Group items theo section
```

### 4. Logout:

```
✓ Click logout → Clear localStorage
✓ Redirect to /auth/login
✓ Button màu đỏ
```

---

## 🎯 Responsive

Sidebar width: **256px (w-64)**

Mobile: Consider toggle sidebar với hamburger menu (future improvement)

---

## 🐛 Known Issues

### Issue 1: Username không hiển thị

**Fix:**

- Check localStorage có `user_data` không
- Check format của `user_data` JSON

### Issue 2: Avatar không hiển thị

**Fix:**

- Check Avatar component được import đúng
- Check Tailwind classes được compile

---

## ✅ Checklist

- [x] User avatar với first letter
- [x] Section labels (DASHBOARD, RELATIONSHIPS, etc.)
- [x] Menu items grouped by sections
- [x] Active state styling
- [x] Hover effects
- [x] Support link
- [x] Logout button (red)
- [x] Logout functionality (clear localStorage)
- [x] Responsive width (w-64)
- [x] Overflow scroll for nav
- [x] Border separators
- [x] Icons for all items

---

## 📸 Screenshots (Expected)

### Admin View:

```
┌─────────────────┐
│ [A] Admin       │
├─────────────────┤
│ DASHBOARD       │
│ 📊 Tổng quan    │ ← Active (blue bg)
│ 👥 Người dùng   │
│ 📚 Khóa học     │
│ 🔔 Thông báo    │
├─────────────────┤
│ RELATIONSHIPS   │
│ 📁 Danh mục     │
│ 🏢 Departments  │
│ 💬 Chats        │
├─────────────────┤
│ CONFIGURATION   │
│ 💰 Giao dịch    │
│ ⚙️  Cài đặt     │
├─────────────────┤
│ ❓ Support      │
│ 🚪 Logout (Red) │
└─────────────────┘
```

---

Created: 2025-01-21
Status: ✅ Complete
Design: Matched with provided screenshot
