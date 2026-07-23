import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AgreementsList from "./AgreementsList";
import AppSidebar from "@/components/layout/AppSidebar";
import { Plus } from "lucide-react";

export default async function AgreementsPage() {
  const supabase = await createClient();

  // =========================
  // UTILISATEUR
  // =========================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // =========================
  // PROFIL
  // =========================
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

  // =========================
  // ACCORDS
  // =========================
  const { data: agreements, error } = await supabase
    .from("agreements")
    .select(`
      id,
      reference,
      title,
      total_amount,
      deposit_amount,
      status,
      delivery_date,
      created_at,
      agreement_participants (
        full_name,
        role,
        confirmation_status
      )
    `)
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("AGREEMENTS ERROR:", error);
  }

  const allAgreements = agreements || [];

  // =========================
  // STATISTIQUES
  // =========================
  const total = allAgreements.length;

  const pending = allAgreements.filter(
    (agreement) => agreement.status === "pending"
  ).length;

  const confirmed = allAgreements.filter(
    (agreement) => agreement.status === "confirmed"
  ).length;

  const drafts = allAgreements.filter(
    (agreement) => agreement.status === "draft"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={businessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {/* ================= TITRE ================= */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
                Mes accords
              </p>

              <h1 className="mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight sm:mt-2 sm:text-4xl">
                Tous vos accords
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Retrouvez et suivez les accords conclus avec vos clients.
              </p>
            </div>

            {/* Le header mobile possède déjà le bouton Créer */}
            <Link
              href="/accords/nouveau"
              className="hidden min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#3730A3] md:flex"
            >
              <Plus className="h-5 w-5" />
              Nouvel accord
            </Link>
          </div>

          {/* ================= STATISTIQUES ================= */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
            <MiniStat
              label="Tous"
              value={total}
            />

            <MiniStat
              label="En attente"
              value={pending}
            />

            <MiniStat
              label="Confirmés"
              value={confirmed}
            />

            <MiniStat
              label="Brouillons"
              value={drafts}
            />
          </section>

          {/* ================= LISTE ================= */}
          <AgreementsList agreements={allAgreements} />
        </div>
      </main>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
        {label}
      </p>

      <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-gray-900 sm:mt-2">
        {value}
      </p>
    </div>
  );
}