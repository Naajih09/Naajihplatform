import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Landmark, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { getPublicEntryPath } from "@/lib/public-entry";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const entryPath = getPublicEntryPath();

  const navLinks = [
    { name: "How it Works", href: "#how-it-works" },
    { name: "Benefits", href: "#benefits" },
    { name: "Trust", href: "#trust" },
    { name: "About", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background-light dark:bg-background-dark transition-colors duration-300 md:bg-background-light/80 md:backdrop-blur-md md:dark:bg-background-dark/80">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer z-50">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
            <Landmark size={20} strokeWidth={3} />
          </div>
          <h2 className="text-lg font-extrabold tracking-tighter uppercase text-slate-900 dark:text-white sm:text-xl">
            Naajih<span className="text-primary">Biz</span>
          </h2>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-700 dark:text-slate-300">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="text-sm font-bold px-4 py-2 hover:text-primary transition-colors text-slate-900 dark:text-white"
          >
            Log In
          </Link>
          <Link
            to={entryPath}
            className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-extrabold hover:brightness-110 transition-all shadow-lg shadow-primary/10"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleMenu}
            className="rounded-lg p-1 text-slate-900 transition-colors hover:text-primary dark:text-white"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[70] min-h-[calc(100dvh-57px)] overflow-y-auto border-t border-slate-200 bg-background-light px-4 py-6 shadow-2xl animate-in slide-in-from-top duration-300 dark:border-white/10 dark:bg-background-dark sm:min-h-[calc(100dvh-65px)]">
          <nav className="mx-auto flex w-full max-w-sm flex-col gap-2 text-center">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-4 text-xl font-bold text-slate-900 transition-colors hover:bg-slate-100 hover:text-primary dark:text-white dark:hover:bg-white/5"
              >
                {item.name}
              </a>
            ))}
          </nav>
          <div className="mx-auto mt-5 flex w-full max-w-sm flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full rounded-xl border border-slate-300 py-4 text-center font-bold text-slate-900 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-white"
            >
              Log In
            </Link>
            <Link
              to={entryPath}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-primary text-background-dark rounded-xl font-extrabold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
