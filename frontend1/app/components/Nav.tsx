"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/lib/auth";
import logo from "@/public/image.png";
const homeLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Gallery", href: "#gallery" },
];
const appLinks = [{ label: "Feed", href: "/feed" }];
export default function Nav() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isSignedIn = Boolean(currentUser);
  const isAdmin = currentUser?.role === "admin";
  const onHome = pathname === "/";
  const links = onHome ? homeLinks : appLinks;
  const isActive = (href: string) =>
    !onHome && href.startsWith("/") && pathname === href;
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  };
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open || !onHome
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-4 px-5 sm:px-8",
          onHome ? "max-w-6xl" : "max-w-7xl"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Plyzo home"
          className="flex shrink-0 items-center"
        >
          <Image
            src={logo}
            alt="Plyzo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative text-sm transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300",
                  isActive(link.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </div>
        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {!loading && isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account">Account</Link>
              </Button>

              {isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="mr-2 size-4" aria-hidden="true" />
                Sign out
              </Button>
            </>
          ) : !loading ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>

              <Button size="sm" asChild>
                <Link href="/login">Get started</Link>
              </Button>
            </>
          ) : null}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-mist md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>
      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[32rem]" : "max-h-0 border-b-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive(link.href)
                  ? "bg-mist text-foreground"
                  : "text-foreground hover:bg-mist"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!loading && isSignedIn && (
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-mist"
              >
                Account
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-mist"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-error transition-colors hover:bg-error-soft"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
          {!loading && !isSignedIn && (
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/login">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
