import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import PasswordForm from "./PasswordForm";
import {
  Bell,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "Utilisateur";

  const businessName =
    profile?.business_name || "Compte personnel";

  const email = user.email || "Non renseigné";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={businessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1000px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {/* TITRE */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
              Compte
            </p>

            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Paramètres
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Gérez la sécurité et les préférences de votre compte Wóolu.
            </p>
          </div>

          {/* COMPTE ET SÉCURITÉ */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-8">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-extrabold">
                    Compte et sécurité
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Informations utilisées pour accéder à Wóolu.
                  </p>
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold">
                    Adresse email
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {email}
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                Compte actif
              </span>
            </div>

            {/* MOT DE PASSE */}
            <PasswordForm />
          </section>

          {/* NOTIFICATIONS */}
          <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-6">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                  <Bell className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-extrabold">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Gérez la manière dont Wóolu vous informe.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:px-6 sm:py-6">
              <div className="rounded-xl border border-dashed border-gray-200 bg-[#FAFAFC] p-4 sm:p-5">
                <p className="font-bold text-gray-700">
                  Notifications Wóolu
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Les préférences de notifications seront disponibles
                  lorsque le système de notifications sera activé.
                </p>

                <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500">
                  À venir
                </span>
              </div>
            </div>
          </section>

          {/* SÉCURITÉ */}
          <section className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:mt-6 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4338CA]">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="font-extrabold text-[#4338CA]">
                  Sécurité de votre compte
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Ne partagez jamais votre mot de passe. Utilisez la
                  déconnexion lorsque vous utilisez Wóolu depuis un
                  appareil qui ne vous appartient pas.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}