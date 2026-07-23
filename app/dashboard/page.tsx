import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Handshake,
  Plus,
  Wallet,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // =========================
  // UTILISATEUR CONNECTÉ
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

  const fullName = profile?.full_name || "Utilisateur";
  const businessName = profile?.business_name || "Compte personnel";

  // Pour le moment on utilise le premier mot.
  // On améliorera ensuite la gestion prénom/nom dans le profil.
  const firstName = fullName.split(" ")[0];

  // =========================
  // VRAIS ACCORDS
  // =========================
  const { data: agreements, error: agreementsError } = await supabase
    .from("agreements")
    .select(`
      id,
      reference,
      title,
      total_amount,
      deposit_amount,
      status,
      created_at,
      agreement_participants (
        full_name,
        role,
        confirmation_status
      )
    `)
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (agreementsError) {
    console.error("DASHBOARD AGREEMENTS ERROR:", agreementsError);
  }

  const allAgreements = agreements || [];

  // =========================
  // STATISTIQUES
  // =========================
  const pendingCount = allAgreements.filter(
    (agreement) => agreement.status === "pending"
  ).length;

  const confirmedCount = allAgreements.filter(
    (agreement) => agreement.status === "confirmed"
  ).length;

  const activeCount = allAgreements.filter(
    (agreement) =>
        agreement.status === "confirmed" ||
        agreement.status === "in_progress"
    ).length;

  const totalAgreed = allAgreements
  .filter(
    (agreement) =>
      agreement.status !== "draft" &&
      agreement.status !== "cancelled"
  )
  .reduce(
    (total, agreement) =>
      total + Number(agreement.total_amount || 0),
    0
  );

  // 5 derniers accords
  const recentAgreements = allAgreements.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      {/* ================= SIDEBAR ================= */}
        <AppSidebar
        fullName={fullName}
        businessName={businessName}
        />

      {/* ================= CONTENU ================= */}
      <div className="lg:pl-[260px]">
        

        {/* DASHBOARD */}
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:py-10">
          {/* BIENVENUE */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-[#4338CA]">
                TABLEAU DE BORD
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Bonjour, {firstName} 👋
              </h1>

              <p className="mt-2 text-gray-500">
                Voici un aperçu de votre activité sur Wóolu.
              </p>
            </div>

            <Link
              href="/accords/nouveau"
              className="hidden items-center gap-2 rounded-xl bg-[#4338CA] px-5 py-3 font-semibold text-white transition hover:bg-[#3730A3] md:flex"
            >
              <Plus className="h-5 w-5" />
              Créer un accord
            </Link>
          </div>

          {/* ================= STATS ================= */}
            <section className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-4 xl:grid-cols-4">            <StatCard
              title="Accords actifs"
              value={activeCount.toString()}
              icon={<FileText className="h-5 w-5" />}
            />

            <StatCard
              title="En attente"
              value={pendingCount.toString()}
              icon={<Clock3 className="h-5 w-5" />}
            />

            <StatCard
              title="Confirmés"
              value={confirmedCount.toString()}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <StatCard
              title="Montant convenu"
              value={`${totalAgreed.toLocaleString("fr-FR")} FCFA`}
              icon={<Wallet className="h-5 w-5" />}
            />
          </section>

          {/* ================= ACTIVITÉ ================= */}
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="font-bold">
                    Activité récente
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Vos derniers accords.
                  </p>
                </div>

                <Link
                  href="/accords"
                  className="flex items-center gap-1 text-sm font-semibold text-[#4338CA]"
                >
                  Tout voir
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {recentAgreements.length === 0 ? (
                <div className="flex min-h-[350px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                    <Handshake className="h-8 w-8 text-[#4338CA]" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Aucun accord pour le moment
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Votre activité apparaîtra ici dès que vous aurez créé
                    votre premier accord avec un client.
                  </p>

                  <Link
                    href="/accords/nouveau"
                    className="mt-6 flex items-center gap-2 rounded-xl bg-[#4338CA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3730A3]"
                  >
                    <Plus className="h-4 w-4" />
                    Créer mon premier accord
                  </Link>
                </div>
              ) : (
                <div>
                  {recentAgreements.map((agreement) => {
                    const client =
                      agreement.agreement_participants?.find(
                        (participant: {
                          full_name: string;
                          role: string;
                          confirmation_status: string;
                        }) => participant.role === "recipient"
                      );

                    return (
                      <Link
                        key={agreement.id}
                        href={`/accords/${agreement.id}`}
                        className="group flex flex-col gap-4 border-b border-gray-100 px-6 py-5 transition last:border-b-0 hover:bg-[#FAFAFC] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-bold text-[#4338CA]">
                                {agreement.reference}
                              </p>

                              <StatusBadge
                                status={agreement.status}
                              />
                            </div>

                            <p className="mt-1 truncate font-bold text-gray-900">
                              {agreement.title}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {client?.full_name || "Client"} •{" "}
                              {new Date(
                                agreement.created_at
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <p className="font-bold">
                            {Number(
                              agreement.total_amount || 0
                            ).toLocaleString("fr-FR")}{" "}
                            FCFA
                          </p>

                          <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#4338CA]" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================= CÔTÉ DROIT ================= */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl bg-[#4338CA] p-6 text-white shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B7F34A]">
                  <Handshake className="h-5 w-5 text-[#4338CA]" />
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  Formalisez vos prochains accords.
                </h2>

                <p className="mt-3 text-sm leading-6 text-indigo-100">
                  Créez un accord, partagez-le avec votre client et
                  retrouvez son statut depuis votre espace Wóolu.
                </p>

                <Link
                  href="/accords/nouveau"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#4338CA] transition hover:bg-indigo-50"
                >
                  Nouvel accord
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                  Votre formule
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      Gratuit
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Pour découvrir Wóolu
                    </p>
                  </div>

                  <span className="rounded-full bg-[#B7F34A]/30 px-3 py-1 text-xs font-bold text-[#39430F]">
                    ACTIF
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "confirmed") {
    return (
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
        Confirmé
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
        En attente
      </span>
    );
  }

  if (status === "draft") {
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">
        Brouillon
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
        Terminé
      </span>
    );
  }

  if (status === "in_progress") {
  return (
    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-[#4338CA]">
      En cours
    </span>
  );
    }

    if (status === "cancelled") {
    return (
        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
        Annulé
        </span>
    );
    }

  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">
      {status}
    </span>
  );
}