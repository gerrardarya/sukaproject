"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PreLoader from "./PreLoader";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Only show preloader on homepage
  const shouldShowPreloader = pathname === "/";

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Skip loading state if not on homepage
  useEffect(() => {
    if (!shouldShowPreloader) {
      setIsLoading(false);
    }
  }, [shouldShowPreloader]);

  return (
    <>
      {shouldShowPreloader && <PreLoader onLoadingComplete={handleLoadingComplete} />}
      <div className={isLoading && shouldShowPreloader ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  );
}