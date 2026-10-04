"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
FolderKanban,
BookOpen,
UserRound,
ArrowUpRight,
House,
} from "lucide-react";

const links = [
{ label: "Home", href: "/", icon: House },
{ label: "Projects", href: "/projects", icon: FolderKanban },
{ label: "Blog", href: "/blog", icon: BookOpen },
{ label: "About", href: "/about", icon: UserRound },
];

export default function Navbar() {
const pathname = usePathname();

return ( <header className="floating-nav-wrap"> <nav
     className="floating-nav"
     aria-label="Main navigation"
   > <div className="floating-nav-items">
{links.map((link, index) => {
const Icon = link.icon;


        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.label}
            aria-current={active ? "page" : undefined}
            title={link.label}
            className={`floating-nav-link ${
              active ? "is-active" : ""
            }`}
            style={
              {
                "--item-index": index,
              } as CSSProperties
            }
          >
            <Icon size={18} strokeWidth={1.7} />

            <span className="floating-nav-label">
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>

    <span
      className="floating-nav-divider"
      aria-hidden="true"
    />

    <Link
      href="/contact"
      className="floating-nav-cta"
      data-cursor-text="CONTACT"
    >
      <span>Let's talk</span>
      <ArrowUpRight size={16} />
    </Link>
  </nav>
</header>


);
}
