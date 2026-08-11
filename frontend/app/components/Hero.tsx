"use client";
import Link from "next/link";
function Word({
  children,
  delay,
  italic = false,
}: {
  children: React.ReactNode;
  delay: number;
  italic?: boolean;
}) {
  return (
    <span
      className={`enter inline-block ${italic ? "italic" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-24 pt-36 text-center sm:px-8 sm:pt-40 sm:pb-28">
        <h1
          className="enter-soft mt-7 font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.02] tracking-[-0.02em] text-ink drop-shadow-[0_1px_2px_rgba(250,250,251,0.55)] dark:drop-shadow-[0_1px_3px_rgba(12,12,15,0.9)]"
          style={{ animationDelay: "200ms" }}
        >
          <span className="block">
            <Word delay={200}>Pdf</Word>
          </span>
          <span className="block">
            <Word delay={310}>Without&nbsp;The</Word>
            <span> </span>
            <Word delay={420} italic>
              Hassle
            </Word>
          </span>
        </h1>

        <p
          className="enter mt-7 max-w-xl text-balance text-[10px] leading-relaxed text-muted drop-shadow-[0_1px_1px_rgba(250,250,251,0.5)] dark:drop-shadow-[0_1px_2px_rgba(12,12,15,0.9)] sm:text-base"
          style={{ animationDelay: "700ms" }}
        >
         Plyzo brings your everyday tools into one simple workspace — built to help you create, convert, organize, and get things done faster.
        </p>

        <div
          className="enter mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "850ms" }}
        >
          <Link
            href="/login"
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            Join Free
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href="#gallery"
            className="group rounded-full border border-border bg-background/40 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground"
          >
            Explore
          </a>
        </div>
      </div>
    </section>
  );
}
