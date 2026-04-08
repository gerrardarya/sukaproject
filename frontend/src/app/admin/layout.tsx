"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isLoginPage = pathname === "/admin/login";

      if (!session && !isLoginPage) {
        router.replace("/admin/login");
      } else if (session && isLoginPage) {
        router.replace("/admin");
      }

      setChecking(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isLoginPage = pathname === "/admin/login";
      if (!session && !isLoginPage) {
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
