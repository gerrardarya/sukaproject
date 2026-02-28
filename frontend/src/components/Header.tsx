import Image from "next/image";
import Link from "next/link";
import StaggeredMenu from "./StaggeredMenu";

export default function Header() {

  const menuItems = [
    { label: 'Products', ariaLabel: 'View our creations', link: '/products' },
    { label: 'Philosophy', ariaLabel: 'Our philosophy', link: '/#philosophy' },
    { label: 'Process', ariaLabel: 'Our creative process', link: '/#process' },
    { label: 'Services', ariaLabel: 'What we do', link: '/#services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/#contact' }
  ];

  const socialItems = [
    { label: 'WhatsApp', link: 'https://wa.me/1234567890' },
    { label: 'Instagram', link: 'https://www.instagram.com/custom.at.suka/' }
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border lg:bg-background/95 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">

        {/* Desktop/Tablet Navigation */}
        <div className="hidden lg:flex justify-between items-center">
          <Link href="/" className="relative h-12 w-auto flex items-center">
            <Image
              src="/logo/logo-red.png"
              alt="Premium Gifting"
              width={100}
              height={5}
              className="object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link href="/products" className="hover:text-accent transition-colors duration-300">Products</Link>
            <a href="#philosophy" className="hover:text-accent transition-colors duration-300">Philosophy</a>
            <a href="#process" className="hover:text-accent transition-colors duration-300">Process</a>
            <a href="#services" className="hover:text-accent transition-colors duration-300">Services</a>
            <a href="#contact" className="hover:text-accent transition-colors duration-300">Contact</a>
          </div>
        </div>

        {/* Mobile Navigation - Staggered Menu */}
        <div className="lg:hidden">
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="#000000"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            colors={['#B19EEF', '#5227FF']}
            logoUrl="/logo/logo-red.png"
            accentColor="#5227FF"
            isFixed={true}
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
          />
        </div>

      </div>
    </nav>
  );
}
