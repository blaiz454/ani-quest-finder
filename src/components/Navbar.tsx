import { Link } from "@tanstack/react-router";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";

const links = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Browse" },
  { to: "/genres", label: "Genres" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-[var(--ease-out-soft)] ${
        scrolled ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 outline-none"
          aria-label="AniVault home"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-12">
            <Sparkles className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Ani<span className="text-gradient">Vault</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ "data-active": "true" }}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground data-[active=true]:text-foreground after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-primary after:transition-transform after:duration-400 hover:after:scale-x-100 data-[active=true]:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs lg:block">
          <SearchBar size="sm" />
        </div>

        <button
          type="button"
          className="ml-auto flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:text-foreground lg:hidden"
          aria-label={searchOpen ? "Close search" : "Open search"}
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen((v) => !v)}
        >
          {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
        </button>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {searchOpen ? (
        <div className="border-t border-border px-4 py-3 lg:hidden">
          <SearchBar size="md" autoFocus />
        </div>
      ) : null}

      {open ? (
        <nav
          aria-label="Mobile"
          className="glass border-t border-border px-4 pb-4 pt-2 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              activeProps={{ "data-active": "true" }}
              className="block rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors duration-300 hover:bg-secondary hover:text-foreground data-[active=true]:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
