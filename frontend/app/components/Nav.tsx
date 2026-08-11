"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/lib/auth";
import logo from "@/public/image.png";

const homeLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#gallery" },
];
const appLinks = [{ label: "Feed", href: "/feed" }];

export default function Nav() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const onHome = pathname === "/";
  const isSignedIn = Boolean(currentUser);
  const links = onHome ? homeLinks : appLinks;
  const isActive = (href: string) =>
    !onHome && href.startsWith("/") && pathname === href;

  const metadata = currentUser?.user_metadata ?? {};
  const name =
    typeof metadata.full_name === "string" && metadata.full_name
      ? metadata.full_name
      : typeof metadata.name === "string" && metadata.name
        ? metadata.name
        : currentUser?.email?.split("@")[0] ?? "Account";
  const email = currentUser?.email;
  const avatarUrl =
    typeof metadata.avatar_url === "string" && metadata.avatar_url
      ? metadata.avatar_url
      : typeof metadata.picture === "string" && metadata.picture
        ? metadata.picture
        : null;
  const initials = name.slice(0, 2).toUpperCase();
  const isAdmin =
    currentUser?.app_metadata?.role === "admin" ||
    currentUser?.user_metadata?.role === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSignOut = async () => {
    await logout();
    setOpen(false);
    setAccountOpen(false);
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
        <Link
          href="/"
          aria-label="Plyzo home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <Image
            src={logo}
            alt=""
            width={36}
            height={36}
            priority
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Plyzo
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300",
                  isActive(link.href)
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && !onHome && isSignedIn ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex h-9 items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2 text-sm font-medium text-foreground transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                )}
                <span className="hidden max-w-32 truncate lg:block">
                  {name}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted transition-transform duration-200",
                    accountOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 w-60 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
                >
                  <div className="flex flex-col gap-2 border-b border-border px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt=""
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {initials}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-card-foreground">
                          {name}
                        </p>
                        {email ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {email}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-col">
                    <Link
                      href="/account"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-mist"
                    >
                      Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        role="menuitem"
                        onClick={() => setAccountOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-mist"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void handleSignOut()}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-error transition-colors hover:bg-error-soft"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !loading && !(onHome && isSignedIn) ? (
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

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 md:hidden"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[36rem]" : "max-h-0 border-b-0"
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

          {!loading && !onHome && isSignedIn ? (
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3">
              <div className="flex items-center gap-2.5 px-3 py-2">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {name}
                  </p>
                  {email ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {email}
                    </p>
                  ) : null}
                </div>
              </div>
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
          ) : !loading && !(onHome && isSignedIn) ? (
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
