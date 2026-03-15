import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
  { label: "Admin", href: "/admin", external: true }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-brand-grape/90 backdrop-blur-md">
      <nav className="section-wrap flex items-center justify-between py-3 text-white">
        <a href="#home" className="font-display text-xl tracking-wide text-brand-gold">
          Victor's Events
        </a>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <ul className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a href={item.href} className="transition hover:text-brand-gold">
                  {item.label}
                </a>
              ) : (
                <a href={item.href} className="transition hover:text-brand-gold">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {open && (
        <div className="border-t border-white/20 bg-brand-grape/95 px-4 py-3 md:hidden">
          <ul className="space-y-3 text-sm font-semibold text-white">
            {links.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={() => setOpen(false)} className="block transition hover:text-brand-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
