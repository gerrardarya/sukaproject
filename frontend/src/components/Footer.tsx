import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="relative h-12 w-auto flex items-center">
            <Image
              src="/logo/logo-red.png"
              alt="Premium Gifting"
              width={180}
              height={48}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-8">
            <a
              href="https://wa.me/1234567890"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors duration-300 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/custom.at.suka/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors duration-300 font-medium"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          </div>
        </div>
        <div className="text-center text-muted text-sm mt-10 pt-10 border-t border-border">
          © 2024 Custom at Suka. Custom Suka Suka dan bikin
        </div>
      </div>
    </footer>
  );
}
