import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import ProfileForm from "./ProfileForm";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, business_name, phone, country")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("PROFILE ERROR:", error);
  }

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "Utilisateur";

  const businessName =
    profile?.business_name ||
    user.user_metadata?.business_name ||
    "";

  const sidebarBusinessName =
    businessName || "Compte personnel";

  const phone =
    profile?.phone ||
    user.user_metadata?.phone ||
    "";

  const country =
    profile?.country ||
    user.user_metadata?.country ||
    "Sénégal";

  const email = user.email || "Non renseigné";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={sidebarBusinessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {/* INTRO */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
              Compte
            </p>

            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Mon profil
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Gérez les informations associées à votre compte
              Wóolu.
            </p>
          </div>

          {/* IDENTITÉ */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-8">
            <div className="bg-[#4338CA] px-4 py-5 sm:px-8 sm:py-7">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-extrabold text-[#4338CA] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
                  {fullName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="break-words text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    {fullName}
                  </h2>

                  <p className="mt-1 break-words text-sm text-indigo-100 sm:text-base">
                    {sidebarBusinessName}
                  </p>
                </div>
              </div>
            </div>

            {/* INFORMATIONS */}
            <div className="grid md:grid-cols-2">
              <ProfileItem
                icon={
                  <UserRound className="h-5 w-5" />
                }
                label="Nom complet"
                value={fullName}
              />

              <ProfileItem
                icon={
                  <Building2 className="h-5 w-5" />
                }
                label="Entreprise ou activité"
                value={
                  businessName || "Non renseignée"
                }
              />

              <ProfileItem
                icon={
                  <Phone className="h-5 w-5" />
                }
                label="Téléphone"
                value={phone || "Non renseigné"}
              />

              <ProfileItem
                icon={
                  <Mail className="h-5 w-5" />
                }
                label="Adresse email"
                value={email}
              />

              <ProfileItem
                icon={
                  <MapPin className="h-5 w-5" />
                }
                label="Pays"
                value={country}
              />
            </div>
          </section>

          {/* FORMULAIRE DE MODIFICATION */}
          <ProfileForm
            userId={user.id}
            initialFullName={fullName}
            initialBusinessName={businessName}
            initialPhone={phone}
            initialCountry={country}
          />

          {/* INFORMATION EMAIL */}
          <section className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:mt-6 sm:p-6">
            <h2 className="font-extrabold text-[#4338CA]">
              À propos de votre adresse email
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Votre adresse email est liée à votre
              connexion Wóolu. Elle n&apos;est donc pas
              modifiée depuis ce formulaire.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ÉLÉMENT D'INFORMATION DU PROFIL
========================================================= */

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-gray-100 p-4 last:border-b-0 sm:p-6 md:border-r md:[&:nth-child(2n)]:border-r-0">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-bold leading-5 sm:text-base">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}