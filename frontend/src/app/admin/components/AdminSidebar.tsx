"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Package, Image as ImageIcon, PanelTop, Building2, Info, Tags, MessageSquareQuote, MessageCircle, Newspaper, LogOut } from "lucide-react";

const navItems = [
  { label: "Products", href: "/admin", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Popup", href: "/admin/popup", icon: PanelTop },
  { label: "Clients", href: "/admin/clients", icon: Building2 },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "WhatsApp Popup", href: "/admin/whatsapp", icon: MessageCircle },
  { label: "About Page", href: "/admin/about", icon: Info },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-border/40 shadow-sm z-40 flex flex-col">
      <div className="p-6 border-b border-border/40">
        <Image
          src="/logo/logo-red.png"
          alt="Admin"
          width={100}
          height={36}
          className="object-contain"
          priority
        />
        <p className="text-xs text-muted mt-2">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-[#f8f7f4]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
