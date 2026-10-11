import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  MapPin,
  Sparkles,
  Newspaper,
  ListChecks,
  Settings,
  ScrollText,
} from "lucide-react";
import { getCurrentAdmin } from "@/app/lib/auth";
import LogoutButton from "../LogoutButton";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/google-business", label: "Google Business", icon: MapPin },
  { href: "/admin/ai", label: "AI", icon: Sparkles },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/recommendations", label: "Recommendations", icon: ListChecks },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
];

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
        <div className="px-5 py-5 border-b border-slate-800">
          <p className="text-lg font-semibold text-white">TechByteX</p>
          <p className="text-xs text-slate-500">AI & SEO Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-white truncate">{admin.name}</p>
            <p className="text-xs text-slate-500 truncate">{admin.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
          <p className="font-semibold text-white">TechByteX Admin</p>
          <LogoutButton />
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
