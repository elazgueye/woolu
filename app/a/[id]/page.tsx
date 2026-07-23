import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ConfirmAgreementButton from "./ConfirmAgreementButton";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Handshake,
  Phone,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicAgreementPage({
  params,
}: PageProps) {
  const { id: token } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_agreement",
    {
      p_token: token,
    }
  );

  if (error) {
    console.error("PUBLIC AGREEMENT ERROR:", error);
    notFound();
  }

  const agreement = data?.[0];

  if (!agreement) {
    notFound();
  }

  const totalAmount = Number(agreement.total_amount || 0);
  const depositAmount = Number(agreement.deposit_amount || 0);
  const paidAmount = Number(agreement.paid_amount || 0);
  const remainingAmount = Number(
    agreement.remaining_amount || 0
  );
  const paymentCount = Number(agreement.payment_count || 0);

  const paymentProgress =
    totalAmount > 0
      ? Math.min(
          Math.round((paidAmount / totalAmount) * 100),
          100
        )
      : 0;

  const formattedDeliveryDate = agreement.delivery_date
    ? new Date(
        `${agreement.delivery_date}T00:00:00`
      ).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Non définie";

  const createdDate = new Date(
    agreement.created_at
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isConfirmed =
    agreement.confirmation_status === "accepted" ||
    agreement.status === "confirmed" ||
    agreement.status === "in_progress" ||
    agreement.status === "completed";

  const isInProgress = agreement.status === "in_progress";
  const isCompleted = agreement.status === "completed";
  const isCancelled = agreement.status === "cancelled";

  const publicStatus = isCancelled
    ? {
        label: "Accord annulé",
        description:
          "Cet accord a été annulé et ne peut plus être confirmé.",
      }
    : isCompleted
    ? {
        label: "Accord terminé",
        description:
          "La réalisation de cet accord a été indiquée comme terminée.",
      }
    : isInProgress
    ? {
        label: "Accord en cours",
        description:
          "La réalisation de cet accord est actuellement en cours.",
      }
    : isConfirmed
    ? {
        label: "Accord confirmé",
        description:
          "Votre confirmation a bien été enregistrée dans Wóolu.",
      }
    : {
        label: "Confirmation attendue",
        description:
          "Vérifiez les informations ci-dessous avant de confirmer l'accord.",
      };

  const statusStyle = isCancelled
    ? {
        wrapper: "border-red-200 bg-red-50/80",
        icon: "bg-red-100 text-red-700",
      }
    : isConfirmed
    ? {
        wrapper: "border-green-200 bg-green-50/80",
        icon: "bg-green-100 text-green-700",
      }
    : {
        wrapper: "border-indigo-100 bg-indigo-50/80",
        icon: "bg-white text-[#4338CA]",
      };

  return (
    <main className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      {/* HEADER */}
      <header className="border-b border-gray-200/80 bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1050px] items-center justify-between px-4 sm:h-20 sm:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Logo temporaire — remplacé plus tard par le vrai logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4338CA] shadow-sm sm:h-11 sm:w-11">
              <Check
                className="h-6 w-6 text-[#B7F34A]"
                strokeWidth={3}
              />
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-[#4338CA]">
                Wóolu
              </p>

              <p className="hidden text-[11px] text-gray-400 sm:block">
                L&apos;accord en toute confiance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-green-700 sm:gap-2 sm:px-3 sm:text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Lien sécurisé</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[850px] px-4 py-6 sm:px-8 sm:py-12">
        {/* INTRODUCTION */}
        <section className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm sm:h-16 sm:w-16">
            <Handshake className="h-7 w-7 text-[#4338CA] sm:h-8 sm:w-8" />
          </div>

          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4338CA] sm:mt-6 sm:text-sm">
            Accord Wóolu
          </p>

          <h1 className="mx-auto mt-2.5 max-w-2xl text-[28px] font-bold leading-[1.15] tracking-tight sm:mt-3 sm:text-4xl">
            {agreement.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Un accord vous a été envoyé par{" "}
            <span className="font-bold text-gray-800">
              {agreement.business_name ||
                agreement.creator_name ||
                "un professionnel"}
            </span>
            .
          </p>
        </section>

        {/* STATUT */}
        <section
          className={`mt-6 rounded-2xl border p-4 sm:mt-8 sm:p-6 ${statusStyle.wrapper}`}
        >
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${statusStyle.icon}`}
            >
              {isCancelled ? (
                <FileCheck2 className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : isConfirmed ? (
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Clock3 className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-bold">
                {publicStatus.label}
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600 sm:leading-6">
                {publicStatus.description}
              </p>
            </div>
          </div>
        </section>

        {/* INFORMATIONS PRINCIPALES */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-6 sm:rounded-3xl">
          {/* RÉFÉRENCE */}
          <div className="border-b border-gray-100 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 sm:text-xs">
                Référence Wóolu
              </p>

              <p className="mt-1.5 font-mono text-[15px] font-bold text-[#4338CA]">
                {agreement.reference}
              </p>
            </div>

            <p className="mt-2 text-xs text-gray-500 sm:mt-0 sm:text-sm">
              Créé le {createdDate}
            </p>
          </div>

          {/* PARTIES */}
          <div className="divide-y divide-gray-100 border-b border-gray-100 sm:grid sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <Party
              label="Créateur"
              name={
                agreement.business_name ||
                agreement.creator_name ||
                "Professionnel"
              }
            />

            <Party
              label="Client"
              name={agreement.client_name || "Client"}
              phone={agreement.client_phone}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-7">
            <SectionTitle
              icon={<FileCheck2 className="h-5 w-5" />}
              title="Ce qui a été convenu"
            />

            <h3 className="mt-4 text-lg font-bold">
              {agreement.title}
            </h3>

            <p className="mt-2.5 whitespace-pre-line text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              {agreement.description ||
                "Aucune description supplémentaire n'a été ajoutée."}
            </p>
          </div>

          {/* MONTANTS */}
          <div className="border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-7">
            <SectionTitle
              icon={<Wallet className="h-5 w-5" />}
              title="Situation financière"
            />

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <PublicAmount
                label="Montant total"
                value={`${totalAmount.toLocaleString(
                  "fr-FR"
                )} FCFA`}
                emphasis
              />

              <PublicAmount
                label="Acompte"
                value={`${depositAmount.toLocaleString(
                  "fr-FR"
                )} FCFA`}
              />

              <PublicAmount
                label="Déclaré payé"
                value={`${paidAmount.toLocaleString(
                  "fr-FR"
                )} FCFA`}
                positive={paidAmount > 0}
              />

              <PublicAmount
                label="Reste à payer"
                value={`${remainingAmount.toLocaleString(
                  "fr-FR"
                )} FCFA`}
                emphasis
                positive={remainingAmount === 0}
              />
            </div>

            {/* PROGRESSION FINANCIÈRE */}
            {totalAmount > 0 && (
              <div className="mt-5 rounded-2xl border border-gray-100 bg-[#FAFAFC] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold text-gray-500">
                    Progression des paiements
                  </p>

                  <p
                    className={`text-sm font-bold ${
                      paymentProgress === 100
                        ? "text-green-700"
                        : "text-[#4338CA]"
                    }`}
                  >
                    {paymentProgress} %
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      paymentProgress === 100
                        ? "bg-green-600"
                        : "bg-[#4338CA]"
                    }`}
                    style={{
                      width: `${paymentProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-[11px] text-gray-500 sm:text-xs">
                  <span>
                    {paidAmount.toLocaleString("fr-FR")} FCFA
                    déclaré
                  </span>

                  <span>
                    {remainingAmount.toLocaleString("fr-FR")} FCFA
                    restant
                  </span>
                </div>
              </div>
            )}

            {paymentCount > 0 && (
              <p className="mt-4 text-xs leading-5 text-gray-400">
                {paymentCount} paiement
                {paymentCount > 1 ? "s" : ""} enregistré
                {paymentCount > 1 ? "s" : ""} dans Wóolu.
              </p>
            )}
          </div>

          {/* DATE */}
          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Livraison ou réalisation prévue
                </p>

                <p className="mt-1 text-sm font-bold sm:text-base">
                  {formattedDeliveryDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUIVI / CONFIRMATION */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-6 sm:rounded-3xl sm:p-8">
          {isCancelled ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 sm:h-16 sm:w-16">
                <FileCheck2 className="h-7 w-7 text-red-700 sm:h-8 sm:w-8" />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:mt-5 sm:text-2xl">
                Accord annulé
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Cet accord a été annulé. Aucune nouvelle
                confirmation ne peut être enregistrée.
              </p>

              {agreement.cancellation_reason && (
                <div className="mx-auto mt-5 max-w-lg rounded-2xl border border-red-100 bg-red-50 p-4 text-left sm:mt-6">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-red-500">
                    Motif de l&apos;annulation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-800">
                    {agreement.cancellation_reason}
                  </p>

                  {agreement.cancelled_at && (
                    <p className="mt-3 text-xs text-red-500">
                      Annulé le{" "}
                      {new Date(
                        agreement.cancelled_at
                      ).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}

              <p className="mx-auto mt-5 max-w-md text-xs leading-5 text-gray-400">
                Cet accord reste consultable dans Wóolu afin de
                conserver les informations et la situation
                financière enregistrées.
              </p>
            </div>
          ) : isCompleted ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16">
                <CheckCircle2 className="h-7 w-7 text-green-700 sm:h-8 sm:w-8" />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:mt-5 sm:text-2xl">
                Accord terminé
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                La réalisation de cet accord a été indiquée comme
                terminée. Vous pouvez conserver ce lien pour
                consulter sa situation.
              </p>

              {remainingAmount > 0 ? (
                <div className="mx-auto mt-5 max-w-md rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800 sm:mt-6">
                  Il reste{" "}
                  {remainingAmount.toLocaleString("fr-FR")} FCFA
                  à payer selon les paiements déclarés dans Wóolu.
                </div>
              ) : (
                <div className="mx-auto mt-5 max-w-md rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 sm:mt-6">
                  ✓ Le montant total de l&apos;accord a été déclaré
                  payé.
                </div>
              )}
            </div>
          ) : isInProgress ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 sm:h-16 sm:w-16">
                <Clock3 className="h-7 w-7 text-[#4338CA] sm:h-8 sm:w-8" />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:mt-5 sm:text-2xl">
                Accord en cours
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Cet accord a été confirmé et sa réalisation est
                actuellement en cours.
              </p>

              <div className="mx-auto mt-5 max-w-sm rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-[#4338CA] sm:mt-6">
                ✓ Confirmation enregistrée dans Wóolu
              </div>
            </div>
          ) : isConfirmed ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16">
                <CheckCircle2 className="h-7 w-7 text-green-700 sm:h-8 sm:w-8" />
              </div>

              <h2 className="mt-4 text-xl font-bold sm:mt-5 sm:text-2xl">
                Accord confirmé
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Votre confirmation a bien été enregistrée. Vous
                pouvez conserver ce lien pour consulter cet accord
                à tout moment.
              </p>

              <div className="mx-auto mt-5 max-w-sm rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 sm:mt-6">
                ✓ Confirmation enregistrée dans Wóolu
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                  <FileCheck2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold sm:text-xl">
                    Tout est correct ?
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-gray-500">
                    Vérifiez les informations ci-dessus, puis
                    confirmez si elles correspondent bien à ce qui
                    a été convenu.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <ConfirmAgreementButton token={token} />
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 sm:text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                Votre confirmation sera enregistrée dans Wóolu.
              </div>
            </>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-7 text-center sm:py-8">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#4338CA]">
            <ShieldCheck className="h-4 w-4" />
            Wóolu
          </div>

          <p className="mt-1.5 text-xs text-gray-400">
            L&apos;accord en toute confiance.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[#4338CA]">
      {icon}

      <h2 className="text-sm font-bold sm:text-base">
        {title}
      </h2>
    </div>
  );
}

function Party({
  label,
  name,
  phone,
}: {
  label: string;
  name: string;
  phone?: string | null;
}) {
  return (
    <div className="flex gap-3 px-5 py-5 sm:px-8 sm:py-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[#4338CA]">
        <UserRound className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 break-words text-sm font-bold sm:text-base">
          {name}
        </p>

        {phone && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {phone}
          </p>
        )}
      </div>
    </div>
  );
}

function PublicAmount({
  label,
  value,
  emphasis = false,
  positive = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  positive?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-3.5 sm:p-4 ${
        emphasis
          ? "border-indigo-100 bg-indigo-50/60"
          : "border-gray-100 bg-[#F8F9FC]"
      }`}
    >
      <p className="text-[11px] font-medium leading-4 text-gray-500 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-sm font-extrabold leading-5 sm:text-base ${
          positive ? "text-green-700" : "text-[#15171C]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}