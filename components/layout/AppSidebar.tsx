"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import WooluLogo from "@/components/WooluLogo";
import {
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

type AppSidebarProps = {
  fullName: string;
  businessName: string;
};

export default function AppSidebar({
  fullName,
  businessName,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = fullName?.trim()?.charAt(0)?.toUpperCase() || "W";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, showLogoutModal]);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
      return;
    }

    router.push("/connexion");
    router.refresh();
  }

  function isActive(path: string) {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(path);
  }

  function desktopMenuClass(path: string) {
    return isActive(path)
      ? "flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-[#4338CA]"
      : "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900";
  }

  function mobileMenuClass(path: string) {
    return isActive(path)
      ? "flex min-h-[52px] items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-[15px] font-bold text-[#4338CA]"
      : "flex min-h-[52px] items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-gray-700 transition active:bg-gray-100";
  }

  return (
    <>
      {/* ===================================================== */}
      {/* HEADER MOBILE */}
      {/* ===================================================== */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-xl lg:hidden">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2.5"
        >
          <WooluLogo className="h-10 w-[112px] shrink-0" />

          <p className="hidden max-w-[120px] truncate text-[10px] font-medium text-gray-400 min-[430px]:block">
            {businessName}
          </p>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/accords/nouveau"
            aria-label="Créer un accord"
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#4338CA] px-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden min-[360px]:inline">Créer</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition active:scale-95 active:bg-gray-50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ===================================================== */}
      {/* OVERLAY MOBILE */}
      {/* ===================================================== */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* ===================================================== */}
      {/* MENU MOBILE */}
      {/* ===================================================== */}
      <aside
        className={`fixed inset-y-0 right-0 z-[80] flex w-[88%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* En-tête menu */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <WooluLogo className="h-11 w-[125px]" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition active:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profil */}
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4338CA] text-sm font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                {fullName}
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-500">
                {businessName}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
            Espace de travail
          </p>

          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={mobileMenuClass("/dashboard")}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              Tableau de bord
            </Link>

            <Link
              href="/accords"
              className={mobileMenuClass("/accords")}
            >
              <Handshake className="h-5 w-5 shrink-0" />
              Mes accords
            </Link>

            <Link
              href="/paiements"
              className={mobileMenuClass("/paiements")}
            >
              <Wallet className="h-5 w-5 shrink-0" />
              Paiements
            </Link>
          </div>

          <p className="mb-2 mt-6 px-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
            Compte
          </p>

          <div className="space-y-1">
            <Link
              href="/profil"
              className={mobileMenuClass("/profil")}
            >
              <UserRound className="h-5 w-5 shrink-0" />
              Mon profil
            </Link>

            <Link
              href="/parametres"
              className={mobileMenuClass("/parametres")}
            >
              <Settings className="h-5 w-5 shrink-0" />
              Paramètres
            </Link>
          </div>

          {/* Action principale */}
          <Link
            href="/accords/nouveau"
            className="mt-7 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#4338CA] px-4 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition active:scale-[0.99]"
          >
            <Plus className="h-5 w-5" />
            Nouvel accord
          </Link>
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setShowLogoutModal(true);
            }}
            className="flex min-h-[50px] w-full items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-gray-600 transition active:bg-red-50 active:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* SIDEBAR DESKTOP */}
      {/* ===================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-gray-200 bg-white lg:flex lg:flex-col">
        {/* LOGO */}
        <div className="flex h-20 items-center border-b border-gray-100 px-7">
          <Link href="/dashboard" className="flex items-center">
            <WooluLogo className="h-12 w-[145px]" />
          </Link>
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
            Espace de travail
          </p>

          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={desktopMenuClass("/dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              Tableau de bord
            </Link>

            <Link
              href="/accords"
              className={desktopMenuClass("/accords")}
            >
              <Handshake className="h-5 w-5" />
              Mes accords
            </Link>

            <Link
              href="/paiements"
              className={desktopMenuClass("/paiements")}
            >
              <Wallet className="h-5 w-5" />
              Paiements
            </Link>
          </div>

          <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
            Compte
          </p>

          <div className="space-y-1">
            <Link
              href="/profil"
              className={desktopMenuClass("/profil")}
            >
              <UserRound className="h-5 w-5" />
              Mon profil
            </Link>

            <Link
              href="/parametres"
              className={desktopMenuClass("/parametres")}
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </div>
        </nav>

        {/* PROFIL DESKTOP */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4338CA] text-sm font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {fullName}
              </p>

              <p className="truncate text-xs text-gray-500">
                {businessName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Se déconnecter"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* MODAL DÉCONNEXION */}
      {/* ===================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 px-3 pb-3 backdrop-blur-[2px] sm:items-center sm:px-4 sm:pb-0">
          <div className="w-full max-w-[430px] rounded-[24px] bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <LogOut className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Se déconnecter ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Êtes-vous sûr de vouloir vous déconnecter de votre
              espace Wóolu ?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="min-h-[48px] rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />

                {loggingOut
                  ? "Déconnexion..."
                  : "Se déconnecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}