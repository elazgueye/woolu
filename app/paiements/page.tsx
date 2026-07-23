import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  Banknote,
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Smartphone,
  Wallet,
} from "lucide-react";

type Payment = {
  id: string;
  agreement_id: string;
  amount: number | string;
  payment_method: string | null;
  note: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
};

type Agreement = {
  id: string;
  reference: string;
  title: string;
  total_amount: number | string;
  status: string;
};

export default async function PaymentsPage() {
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

  // =========================
  // ACCORDS
  // =========================
  const { data: agreementsData, error: agreementsError } =
    await supabase
      .from("agreements")
      .select("id, reference, title, total_amount, status")
      .eq("creator_id", user.id);

  if (agreementsError) {
    console.error("AGREEMENTS ERROR:", agreementsError);
  }

  const agreements: Agreement[] = agreementsData || [];

  const financialAgreements = agreements.filter(
    (agreement) =>
      agreement.status === "confirmed" ||
      agreement.status === "in_progress" ||
      agreement.status === "completed"
  );

  const agreementIds = agreements.map(
    (agreement) => agreement.id
  );

  // =========================
  // PAIEMENTS
  // =========================
  let payments: Payment[] = [];

  if (agreementIds.length > 0) {
    const { data: paymentsData, error: paymentsError } =
      await supabase
        .from("payments")
        .select(
          "id, agreement_id, amount, payment_method, note, status, paid_at, created_at"
        )
        .in("agreement_id", agreementIds)
        .order("paid_at", { ascending: false });

    if (paymentsError) {
      console.error("PAYMENTS ERROR:", paymentsError);
    }

    payments = paymentsData || [];
  }

  const activePayments = payments.filter(
    (payment) => payment.status !== "cancelled"
  );

  const financialAgreementIds = new Set(
    financialAgreements.map((agreement) => agreement.id)
  );

  const financialPayments = activePayments.filter((payment) =>
    financialAgreementIds.has(payment.agreement_id)
  );

  // =========================
  // CALCULS
  // =========================
  const totalPaid = financialPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const totalAgreementsAmount = financialAgreements.reduce(
    (total, agreement) =>
      total + Number(agreement.total_amount || 0),
    0
  );

  const remainingAmount = Math.max(
    totalAgreementsAmount - totalPaid,
    0
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={businessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {/* ================= TITRE ================= */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
              Paiements
            </p>

            <h1 className="mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight sm:mt-2 sm:text-4xl">
              Suivi des paiements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Retrouvez les paiements déclarés pour vos accords et
              suivez les montants restant à payer.
            </p>
          </div>

          {/* ================= STATS ================= */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
            <StatCard
              title="Paiements déclarés"
              value={`${totalPaid.toLocaleString("fr-FR")} FCFA`}
              description={`${financialPayments.length} paiement${
                financialPayments.length > 1 ? "s" : ""
              } enregistré${
                financialPayments.length > 1 ? "s" : ""
              }`}
              icon={<Wallet className="h-5 w-5" />}
            />

            <StatCard
              title="Montant des accords"
              value={`${totalAgreementsAmount.toLocaleString(
                "fr-FR"
              )} FCFA`}
              description={`${financialAgreements.length} accord${
                financialAgreements.length > 1 ? "s" : ""
              }`}
              icon={<FileText className="h-5 w-5" />}
            />

            <div className="col-span-2 lg:col-span-1">
              <StatCard
                title="Reste à payer"
                value={`${remainingAmount.toLocaleString(
                  "fr-FR"
                )} FCFA`}
                description="Sur l'ensemble de vos accords"
                icon={<Banknote className="h-5 w-5" />}
              />
            </div>
          </section>

          {/* ================= HISTORIQUE ================= */}
          <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-7">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold sm:text-lg">
                    Historique des paiements
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    Tous les paiements enregistrés sur vos accords.
                  </p>
                </div>

                {activePayments.length > 0 && (
                  <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-[#4338CA]">
                    {activePayments.length}
                  </span>
                )}
              </div>
            </div>

            {activePayments.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[330px] sm:px-6 sm:py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4338CA]">
                  <Wallet className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  Aucun paiement
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Les paiements enregistrés depuis vos accords
                  apparaîtront ici.
                </p>

                <Link
                  href="/accords"
                  className="mt-6 flex min-h-[48px] items-center justify-center rounded-xl bg-[#4338CA] px-5 text-sm font-bold text-white"
                >
                  Voir mes accords
                </Link>
              </div>
            ) : (
              <>
                {/* ================= MOBILE ================= */}
                <div className="divide-y divide-gray-100 md:hidden">
                  {activePayments.map((payment) => {
                    const agreement = agreements.find(
                      (item) =>
                        item.id === payment.agreement_id
                    );

                    const method = getPaymentMethod(
                      payment.payment_method
                    );

                    const paymentDate = payment.paid_at
                      ? new Date(
                          payment.paid_at
                        ).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <Link
                        key={payment.id}
                        href={`/accords/${payment.agreement_id}`}
                        className="block p-4 transition active:bg-[#F8F8FC]"
                      >
                        {/* Montant + flèche */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              Paiement
                            </p>

                            <p className="mt-1 text-xl font-extrabold tracking-tight text-green-700">
                              {Number(
                                payment.amount || 0
                              ).toLocaleString("fr-FR")}{" "}
                              <span className="text-xs font-bold">
                                FCFA
                              </span>
                            </p>

                            {payment.note && (
                              <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                {payment.note}
                              </p>
                            )}
                          </div>

                          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300" />
                        </div>

                        {/* Accord */}
                        <div className="mt-4 rounded-xl bg-[#F8F8FC] p-3">
                          <p className="text-[11px] font-bold text-[#4338CA]">
                            {agreement?.reference || "Accord"}
                          </p>

                          <p className="mt-1 line-clamp-1 text-sm font-bold text-gray-900">
                            {agreement?.title || "Accord Wóolu"}
                          </p>
                        </div>

                        {/* Infos paiement */}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-700">
                            <span className="shrink-0 text-[#4338CA]">
                              {method.icon}
                            </span>

                            <span className="truncate">
                              {method.label}
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-medium text-gray-400">
                            {paymentDate}
                          </span>
                        </div>

                        {/* Statuts */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-700">
                            {payment.status === "declared"
                              ? "Déclaré"
                              : payment.status}
                          </span>

                          {agreement?.status === "cancelled" && (
                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-700">
                              Accord annulé
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* ================= DESKTOP ================= */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-[1fr_1.3fr_1fr_1fr_0.8fr_40px] gap-4 border-b border-gray-100 bg-[#FAFAFC] px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                    <span>Paiement</span>
                    <span>Accord</span>
                    <span>Mode</span>
                    <span>Date</span>
                    <span>Statut</span>
                    <span />
                  </div>

                  {activePayments.map((payment) => {
                    const agreement = agreements.find(
                      (item) =>
                        item.id === payment.agreement_id
                    );

                    const method = getPaymentMethod(
                      payment.payment_method
                    );

                    const paymentDate = payment.paid_at
                      ? new Date(
                          payment.paid_at
                        ).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <Link
                        key={payment.id}
                        href={`/accords/${payment.agreement_id}`}
                        className="group grid grid-cols-[1fr_1.3fr_1fr_1fr_0.8fr_40px] items-center gap-4 border-b border-gray-100 px-6 py-5 transition last:border-0 hover:bg-[#FAFAFC]"
                      >
                        <div>
                          <p className="font-bold text-green-700">
                            {Number(
                              payment.amount || 0
                            ).toLocaleString("fr-FR")}{" "}
                            FCFA
                          </p>

                          {payment.note && (
                            <p className="mt-1 max-w-[180px] truncate text-xs text-gray-400">
                              {payment.note}
                            </p>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#4338CA]">
                            {agreement?.reference || "Accord"}
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold">
                            {agreement?.title || "Accord Wóolu"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className="text-[#4338CA]">
                            {method.icon}
                          </span>
                          {method.label}
                        </div>

                        <p className="text-sm text-gray-600">
                          {paymentDate}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                            {payment.status === "declared"
                              ? "Déclaré"
                              : payment.status}
                          </span>

                          {agreement?.status === "cancelled" && (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                              Accord annulé
                            </span>
                          )}
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#4338CA]" />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <p className="mt-3 px-1 text-xs font-medium text-gray-400 sm:mt-4 sm:text-sm">
            {activePayments.length} paiement
            {activePayments.length > 1 ? "s" : ""} au total
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="h-full min-w-0 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-5">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-5 text-gray-500 sm:text-sm">
            {title}
          </p>

          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA] min-[380px]:flex sm:h-10 sm:w-10">
            {icon}
          </div>
        </div>

        <p className="mt-2 break-words text-lg font-extrabold leading-tight tracking-tight sm:text-2xl">
          {value}
        </p>

        <p className="mt-2 text-[11px] leading-4 text-gray-400 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

function getPaymentMethod(method: string | null) {
  switch (method) {
    case "wave":
      return {
        label: "Wave",
        icon: <Smartphone className="h-4 w-4" />,
      };

    case "orange_money":
      return {
        label: "Orange Money",
        icon: <Smartphone className="h-4 w-4" />,
      };

    case "cash":
      return {
        label: "Espèces",
        icon: <Banknote className="h-4 w-4" />,
      };

    case "bank_transfer":
      return {
        label: "Virement",
        icon: <Building2 className="h-4 w-4" />,
      };

    case "check":
      return {
        label: "Chèque",
        icon: <CreditCard className="h-4 w-4" />,
      };

    default:
      return {
        label: "Autre",
        icon: <Wallet className="h-4 w-4" />,
      };
  }
}