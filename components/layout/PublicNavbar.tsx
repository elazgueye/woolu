"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import WooluLogo from "@/components/WooluLogo";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* LOGO */}
        <Link
        href="/"
        onClick={closeMenu}
        className="flex items-center"
        >
        <WooluLogo className="h-11 w-[130px] sm:h-12 sm:w-[145px]" />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="#fonctionnement"
            className="text-sm font-semibold text-gray-600 transition hover:text-[#4338CA]"
          >
            Comment ça marche
          </a>

          <a
            href="#professionnels"
            className="text-sm font-semibold text-gray-600 transition hover:text-[#4338CA]"
          >
            Pour les professionnels
          </a>

          <a
            href="#tarifs"
            className="text-sm font-semibold text-gray-600 transition hover:text-[#4338CA]"
          >
            Tarifs
          </a>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/connexion"
            className="rounded-xl px-5 py-3 text-sm font-bold text-[#4338CA] transition hover:bg-indigo-50"
          >
            Se connecter
          </Link>

          <Link
            href="/inscription"
            className="rounded-xl bg-[#4338CA] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3]"
          >
            Commencer
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#4338CA] transition hover:bg-indigo-50 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-3 shadow-lg lg:hidden">
          <nav className="mx-auto max-w-7xl">
            <a
              href="#fonctionnement"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Comment ça marche
            </a>

            <a
              href="#professionnels"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Pour les professionnels
            </a>

            <a
              href="#tarifs"
              onClick={closeMenu}
              className="flex min-h-[48px] items-center rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Tarifs
            </a>

            <div className="my-3 border-t border-gray-100" />

            <div className="grid gap-2">
              <Link
                href="/connexion"
                onClick={closeMenu}
                className="flex min-h-[50px] items-center justify-center rounded-xl border border-gray-200 text-sm font-extrabold text-[#4338CA]"
              >
                Se connecter
              </Link>

              <Link
                href="/inscription"
                onClick={closeMenu}
                className="flex min-h-[50px] items-center justify-center rounded-xl bg-[#4338CA] text-sm font-extrabold text-white"
              >
                Commencer avec Wóolu
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}