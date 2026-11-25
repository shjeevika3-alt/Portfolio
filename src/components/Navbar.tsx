import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  name: string;
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Resume', href: '#resume' },
];

export default function Navbar({ name }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/8 bg-[#0B0A0A]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-[#F5F4F2] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48] rounded-sm"
        >
          {name}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A8A39E]">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#F5F4F2] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#D46B48] after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#D46B48] px-4 py-2 text-sm font-medium text-[#0B0A0A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#E07A58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A0A]"
          >
            Contact Me
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#F5F4F2] hover:border-[#D46B48]/50 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#0E0D0D] px-6 py-4">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-[#A8A39E] hover:text-[#F5F4F2] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#D46B48] px-4 py-2.5 text-sm font-medium text-[#0B0A0A]"
            >
              Contact Me
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
