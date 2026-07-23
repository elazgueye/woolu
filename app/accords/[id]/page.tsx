import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import ShareAgreement from "./ShareAgreement";
import AgreementStatusActions from "./AgreementStatusActions";
import CancelAgreementButton from "./CancelAgreementButton";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Phone,
  Plus,
  Share2,
  UserRound,
  Wallet,
  Banknote,
  Smartphone,
  Building2,
  CreditCard,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Payment = {
  id: string;
  amount: number | string;
  payment_method: string | null;
  note: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
};

export default async function AccordPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: agreement, error: agreementError } = await supabase
    .from("agreements")
    .select("*")
    .eq("id", id)
    .eq("creator_id", user.id)
    .single();

  if (agreementError || !agreement) {
    console.error("AGREEMENT DETAIL ERROR:", agreementError);
    notFound();
  }

  const { data: participant } = await supabase
    .from("agreement_participants")
    .select("*")
    .eq("agreement_id", id)
    .eq("role", "recipient")
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, phone")
    .eq("id", user.id)
    .single();

  const { data: paymentsData, error: paymentsError } = await supabase
    .from("payments")
    .select("id, amount, payment_method, note, status, paid_at, created_at")
    .eq("agreement_id", id)
    .order("paid_at", { ascending: false });

  if (paymentsError) {
    console.error("PAYMENTS ERROR:", paymentsError);
  }

  const payments: Payment[] = paymentsData || [];
  const activePayments = payments.filter(
    (payment) => payment.status !== "cancelled"
  );

  const totalPaid = activePayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const totalAmount = Number(agreement.total_amount || 0);
  const depositAmount = Number(agreement.deposit_amount || 0);

  // L'acompte est un montant convenu : il ne devient payé
  // que lorsqu'un paiement correspondant est réellement déclaré.
  const remainingAmount = Math.max(totalAmount - totalPaid, 0);

  const paymentProgress =
    totalAmount > 0 ? Math.min((totalPaid / totalAmount) * 100, 100) : 0;

  const formattedDeliveryDate = agreement.delivery_date
    ? new Date(`${agreement.delivery_date}T00:00:00`).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Non définie";

  const createdDate = new Date(agreement.created_at).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const status =
    agreement.status === "draft"
      ? {
          label: "Brouillon",
          description: "Cet accord n’a pas encore été envoyé au client.",
        }
      : agreement.status === "pending"
      ? {
          label: "En attente de confirmation",
          description: "Le client doit encore confirmer cet accord.",
        }
      : agreement.status === "confirmed"
      ? {
          label: "Accord confirmé",
          description:
            "Le client a confirmé cet accord. Il peut maintenant être démarré.",
        }
      : agreement.status === "in_progress"
      ? {
          label: "En cours",
          description:
            "La réalisation de cet accord est actuellement en cours.",
        }
      : agreement.status === "completed"
      ? {
          label: "Accord terminé",
          description:
            "La réalisation de cet accord a été indiquée comme terminée.",
        }
      : agreement.status === "cancelled"
      ? {
          label: "Accord annulé",
          description: "Cet accord a été annulé.",
        }
      : {
          label: "Statut inconnu",
          description: "Le statut de cet accord n’a pas pu être déterminé.",
        };

  const fullName =
    profile?.full_name || user.user_metadata?.full_name || "Utilisateur";
  const businessName = profile?.business_name || "Compte personnel";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar fullName={fullName} businessName={businessName} />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="max-w-full break-all rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#4338CA] sm:text-xs">
                  {agreement.reference}
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold sm:text-xs ${
                    agreement.status === "confirmed"
                      ? "bg-green-50 text-green-700"
                      : agreement.status === "cancelled"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {agreement.status === "confirmed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5" />
                  )}
                  {status.label}
                </span>
              </div>

              <h1 className="mt-3 max-w-3xl break-words text-[28px] font-extrabold leading-tight tracking-tight sm:mt-4 sm:text-4xl">
                {agreement.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:mt-3">
                Créé le {createdDate}
              </p>
            </div>

            <Link
              href="/accords/nouveau"
              className="hidden rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold transition hover:bg-gray-50 lg:block"
            >
              + Nouvel accord
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-5 sm:space-y-6">
              <section className="rounded-2xl bg-[#4338CA] p-4 text-white shadow-sm sm:p-7">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B7F34A] sm:h-12 sm:w-12">
                    <CheckCircle2 className="h-5 w-5 text-[#4338CA] sm:h-6 sm:w-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-bold sm:text-lg">
                      {status.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-indigo-100">
                      {status.description}
                    </p>
                  </div>
                </div>
              </section>

              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <AgreementStatusActions
                  agreementId={agreement.id}
                  status={agreement.status}
                />
                <CancelAgreementButton
                  agreementId={agreement.id}
                  status={agreement.status}
                />
              </div>

              <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <AmountCard
                  label="Montant total"
                  value={`${totalAmount.toLocaleString("fr-FR")} FCFA`}
                />
                <AmountCard
                  label="Acompte convenu"
                  value={`${depositAmount.toLocaleString("fr-FR")} FCFA`}
                />
                <AmountCard
                  label="Paiements déclarés"
                  value={`${totalPaid.toLocaleString("fr-FR")} FCFA`}
                  highlight={totalPaid > 0}
                />
                <AmountCard
                  label="Reste à payer"
                  value={`${remainingAmount.toLocaleString("fr-FR")} FCFA`}
                />
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Wallet className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-bold sm:text-lg">
                        Suivi des paiements
                      </h2>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {activePayments.length} paiement
                        {activePayments.length > 1 ? "s" : ""} enregistré
                        {activePayments.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {remainingAmount > 0 ? (
                    <Link
                      href={`/accords/${id}/paiement`}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3] sm:w-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Enregistrer un paiement
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 sm:w-auto">
                      <CheckCircle2 className="h-4 w-4" />
                      Entièrement payé
                    </span>
                  )}
                </div>

                <div className="mt-6 sm:mt-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">Progression</p>
                    <p className="text-sm font-bold">
                      {Math.round(paymentProgress)} %
                    </p>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#4338CA] transition-all"
                      style={{ width: `${paymentProgress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-col gap-1 text-xs text-gray-400 min-[390px]:flex-row min-[390px]:justify-between">
                    <span>
                      {totalPaid.toLocaleString("fr-FR")} FCFA déclaré
                    </span>
                    <span>
                      {remainingAmount.toLocaleString("fr-FR")} FCFA restant
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5 sm:mt-7 sm:pt-6">
                  <h3 className="font-bold">Historique des paiements</h3>

                  {activePayments.length === 0 ? (
                    <div className="mt-4 rounded-2xl bg-[#F7F8FC] px-4 py-7 text-center sm:mt-5 sm:px-5 sm:py-8">
                      <Banknote className="mx-auto h-7 w-7 text-gray-300" />
                      <p className="mt-3 font-semibold text-gray-700">
                        Aucun paiement enregistré
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Les paiements déclarés apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 divide-y divide-gray-100 sm:mt-4">
                      {activePayments.map((payment) => (
                        <PaymentRow key={payment.id} payment={payment} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-bold sm:text-lg">
                    Détails de l&apos;accord
                  </h2>
                </div>

                <div className="mt-5 sm:mt-7">
                  <p className="text-sm font-medium text-gray-500">Objet</p>
                  <p className="mt-1 break-words font-semibold">
                    {agreement.title}
                  </p>

                  <div className="my-5 border-t border-gray-100 sm:my-6" />

                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>
                  <p className="mt-2 break-words whitespace-pre-line text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                    {agreement.description ||
                      "Aucune description supplémentaire."}
                  </p>

                  <div className="my-5 border-t border-gray-100 sm:my-6" />

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#4338CA]" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Livraison ou réalisation prévue
                      </p>
                      <p className="mt-1 font-semibold">
                        {formattedDeliveryDate}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-bold sm:text-lg">Client</h2>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-4 sm:mt-6 sm:flex-row sm:items-center sm:gap-5">
                  <div className="min-w-0">
                    <p className="break-words text-base font-bold sm:text-lg">
                      {participant?.full_name || "Client"}
                    </p>
                    <div className="mt-2 flex items-center gap-2 break-all text-sm text-gray-500">
                      <Phone className="h-4 w-4 shrink-0" />
                      {participant?.phone || "Téléphone non renseigné"}
                    </div>
                  </div>

                  {participant?.confirmation_status === "accepted" ? (
                    <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      Confirmation acceptée
                    </span>
                  ) : participant?.confirmation_status === "rejected" ? (
                    <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                      Accord refusé
                    </span>
                  ) : (
                    <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      Confirmation en attente
                    </span>
                  )}
                </div>
              </section>
            </div>

            <aside className="min-w-0 space-y-4 sm:space-y-5">
              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B7F34A]/30 text-[#4338CA]">
                  <Share2 className="h-5 w-5" />
                </div>

                <h2 className="mt-4 text-base font-bold sm:mt-5 sm:text-lg">
                  Partager avec le client
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Envoyez cet accord à votre client pour qu&apos;il puisse le
                  consulter et le confirmer.
                </p>

                <ShareAgreement
                  publicToken={agreement.public_token}
                  reference={agreement.reference}
                  title={agreement.title}
                  clientName={participant?.full_name || "Client"}
                  creatorName={
                    profile?.business_name ||
                    profile?.full_name ||
                    "Votre professionnel"
                  }
                />
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-[#4338CA]" />
                  <h2 className="font-bold">Situation financière</h2>
                </div>

                <div className="mt-5 space-y-4">
                  <SummaryLine
                    label="Montant total"
                    value={`${totalAmount.toLocaleString("fr-FR")} FCFA`}
                  />
                  <SummaryLine
                    label="Acompte convenu"
                    value={`${depositAmount.toLocaleString("fr-FR")} FCFA`}
                  />
                  <SummaryLine
                    label="Déclaré payé"
                    value={`${totalPaid.toLocaleString("fr-FR")} FCFA`}
                  />
                  <div className="border-t border-gray-100 pt-4">
                    <SummaryLine
                      label="Reste à payer"
                      value={`${remainingAmount.toLocaleString("fr-FR")} FCFA`}
                      strong
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                  Entre
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Créateur</p>
                  <p className="mt-1 break-words font-bold">
                    {profile?.business_name ||
                      profile?.full_name ||
                      "Professionnel"}
                  </p>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-bold text-gray-400">ET</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="mt-1 break-words font-bold">
                    {participant?.full_name || "Client"}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <p className="text-xs text-gray-500">Référence Wóolu</p>
                <p className="mt-1 break-all font-mono text-sm font-bold">
                  {agreement.reference}
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function AmountCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-3.5 shadow-sm sm:p-5 ${
        highlight
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <p
        className={`text-[11px] leading-4 sm:text-sm ${
          highlight ? "text-green-700" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-[15px] font-extrabold leading-5 tracking-tight sm:mt-2 sm:text-xl ${
          highlight ? "text-green-800" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  const method = getPaymentMethod(payment.payment_method);

  const date = payment.paid_at
    ? new Date(payment.paid_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(payment.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
          {method.icon}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words font-bold">
              {Number(payment.amount || 0).toLocaleString("fr-FR")} FCFA
            </p>

            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
              {payment.status === "declared" ? "Déclaré" : payment.status}
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
            {method.label} • {date}
          </p>

          {payment.note && (
            <p className="mt-1 break-words text-sm text-gray-400">
              {payment.note}
            </p>
          )}
        </div>
      </div>

      <CheckCircle2 className="hidden h-5 w-5 shrink-0 text-green-600 sm:block" />
    </div>
  );
}

function getPaymentMethod(method: string | null) {
  switch (method) {
    case "wave":
      return {
        label: "Wave",
        icon: <Smartphone className="h-5 w-5" />,
      };
    case "orange_money":
      return {
        label: "Orange Money",
        icon: <Smartphone className="h-5 w-5" />,
      };
    case "cash":
      return {
        label: "Espèces",
        icon: <Banknote className="h-5 w-5" />,
      };
    case "bank_transfer":
      return {
        label: "Virement bancaire",
        icon: <Building2 className="h-5 w-5" />,
      };
    case "check":
      return {
        label: "Chèque",
        icon: <CreditCard className="h-5 w-5" />,
      };
    default:
      return {
        label: "Autre",
        icon: <Wallet className="h-5 w-5" />,
      };
  }
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span
        className={
          strong
            ? "text-sm font-bold text-gray-800"
            : "text-sm text-gray-500"
        }
      >
        {label}
      </span>

      <span
        className={`min-w-0 break-words text-right ${
          strong ? "font-bold text-[#4338CA]" : "text-sm font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
