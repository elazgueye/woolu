"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  FileText,
  Loader2,
  Phone,
  Save,
  UserRound,
  Wallet,
} from "lucide-react";

export default function NewAgreementForm() {
  const router = useRouter();
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [totalAmount, setTotalAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateReference() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);

    return `WL-${year}-${random}`;
  }

  function formatAmount(value: string) {
    if (!value) return "0 FCFA";

    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return "0 FCFA";
    }

    return `${amount.toLocaleString("fr-FR")} FCFA`;
  }

  function formatDate(value: string) {
    if (!value) return "Non définie";

    return new Date(`${value}T00:00:00`).toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  async function createAgreement(
    status: "draft" | "pending"
  ) {
    setError("");

    if (!clientName.trim()) {
      setError("Indiquez le nom du client.");
      return;
    }

    if (!clientPhone.trim()) {
      setError("Indiquez le numéro de téléphone du client.");
      return;
    }

    if (!title.trim()) {
      setError("Indiquez l'objet de l'accord.");
      return;
    }

    if (!totalAmount || Number(totalAmount) <= 0) {
      setError("Indiquez un montant total valide.");
      return;
    }

    const total = Number(totalAmount);
    const deposit = depositAmount
      ? Number(depositAmount)
      : 0;

    if (deposit < 0) {
      setError("L'acompte ne peut pas être négatif.");
      return;
    }

    if (deposit > total) {
      setError(
        "L'acompte ne peut pas dépasser le montant total."
      );
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      router.push("/connexion");
      return;
    }

    const reference = generateReference();

    const { data: agreement, error: agreementError } =
      await supabase
        .from("agreements")
        .insert({
          creator_id: user.id,
          reference,
          title: title.trim(),
          description: description.trim() || null,
          total_amount: total,
          deposit_amount: deposit,
          currency: "XOF",
          delivery_date: deliveryDate || null,
          status,
        })
        .select("id, reference")
        .single();

    if (agreementError || !agreement) {
      console.error("AGREEMENT ERROR:", agreementError);

      setLoading(false);

      setError(
        agreementError?.message ||
          "Impossible de créer l'accord. Réessayez."
      );

      return;
    }

    const { error: participantError } = await supabase
      .from("agreement_participants")
      .insert({
        agreement_id: agreement.id,
        user_id: null,
        full_name: clientName.trim(),
        phone: clientPhone.trim(),
        role: "recipient",
        confirmation_status: "pending",
      });

    if (participantError) {
      console.error(
        "PARTICIPANT ERROR:",
        participantError
      );

      await supabase
        .from("agreements")
        .delete()
        .eq("id", agreement.id);

      setLoading(false);

      setError(
        "L'accord n'a pas pu être finalisé. Vérifiez les informations puis réessayez."
      );

      return;
    }

    setLoading(false);

    router.push(`/accords/${agreement.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1250px] px-4 pb-28 pt-6 sm:px-7 sm:pb-12 sm:pt-8 lg:px-10 lg:py-10">
      {/* RETOUR */}
      <button
        type="button"
        onClick={() => router.push("/accords")}
        className="mb-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-bold text-gray-500 transition hover:bg-white hover:text-[#4338CA]"
      >
        <ArrowLeft className="h-4 w-4" />
        Mes accords
      </button>

      {/* INTRO */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
          <FileText className="h-4 w-4" />
          Nouvel accord
        </div>

        <h1 className="mt-2 text-[28px] font-extrabold leading-[1.12] tracking-tight sm:mt-3 sm:text-4xl">
          Formalisez ce qui a été convenu.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
          Renseignez simplement les informations importantes.
          Votre client pourra ensuite consulter et confirmer
          l&apos;accord.
        </p>
      </div>

      <div className="mt-7 grid items-start gap-6 sm:mt-9 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ================= FORMULAIRE ================= */}
        <div className="min-w-0 space-y-4 sm:space-y-5">
          {/* CLIENT */}
          <FormSection
            icon={<UserRound className="h-5 w-5" />}
            title="Votre client"
            description="À qui cet accord sera-t-il envoyé ?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom du client *">
                <input
                  type="text"
                  autoComplete="name"
                  value={clientName}
                  onChange={(e) =>
                    setClientName(e.target.value)
                  }
                  placeholder="Ex. Ibrahima Ndiaye"
                  className={inputClass}
                />
              </Field>

              <Field label="Téléphone *">
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={clientPhone}
                    onChange={(e) =>
                      setClientPhone(e.target.value)
                    }
                    placeholder="77 000 00 00"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </Field>
            </div>
          </FormSection>

          {/* ACCORD */}
          <FormSection
            icon={<FileText className="h-5 w-5" />}
            title="Détails de l'accord"
            description="Décrivez clairement ce qui a été convenu."
          >
            <div className="space-y-4">
              <Field label="Objet de l'accord *">
                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Ex. Fabrication d'un meuble TV"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Description"
                optional="Facultatif"
              >
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                  placeholder="Décrivez le travail, le produit ou le service convenu..."
                  className={`${inputClass} min-h-[115px] resize-none`}
                />
              </Field>
            </div>
          </FormSection>

          {/* FINANCES */}
          <FormSection
            icon={<Wallet className="h-5 w-5" />}
            title="Montant et délai"
            description="Indiquez le prix convenu et, si nécessaire, l'acompte."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Montant total *">
                <MoneyInput
                  value={totalAmount}
                  setValue={setTotalAmount}
                  placeholder="350000"
                />
              </Field>

              <Field
                label="Acompte"
                optional="Facultatif"
              >
                <MoneyInput
                  value={depositAmount}
                  setValue={setDepositAmount}
                  placeholder="150000"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="Livraison ou réalisation prévue"
                  optional="Facultatif"
                >
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) =>
                        setDeliveryDate(e.target.value)
                      }
                      className={`${inputClass} pl-12`}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </FormSection>

          {/* RÉSUMÉ MOBILE */}
          <div className="lg:hidden">
            <AgreementSummary
              clientName={clientName}
              title={title}
              totalAmount={formatAmount(totalAmount)}
              depositAmount={formatAmount(depositAmount)}
              deliveryDate={formatDate(deliveryDate)}
            />
          </div>

          {/* ERREUR */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold leading-6 text-red-700 sm:px-5"
            >
              {error}
            </div>
          )}

          {/* ACTIONS TABLETTE */}
          <div className="hidden flex-col gap-3 sm:flex lg:hidden">
            <PrimaryButton
              loading={loading}
              onClick={() =>
                createAgreement("pending")
              }
            />

            <DraftButton
              loading={loading}
              onClick={() => createAgreement("draft")}
            />
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <AgreementSummary
              clientName={clientName}
              title={title}
              totalAmount={formatAmount(totalAmount)}
              depositAmount={formatAmount(depositAmount)}
              deliveryDate={formatDate(deliveryDate)}
            />

            <PrimaryButton
              loading={loading}
              onClick={() =>
                createAgreement("pending")
              }
            />

            <DraftButton
              loading={loading}
              onClick={() => createAgreement("draft")}
            />

            <p className="px-4 text-center text-xs leading-5 text-gray-400">
              Vous pourrez vérifier l&apos;accord avant de
              le partager avec votre client.
            </p>
          </div>
        </aside>
      </div>

      {/* ================= ACTION MOBILE FIXE ================= */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden sm:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() =>
              createAgreement("draft")
            }
            disabled={loading}
            aria-label="Enregistrer comme brouillon"
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition active:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              createAgreement("pending")
            }
            disabled={loading}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white shadow-sm transition active:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Création...
              </>
            ) : (
              <>
                Créer l&apos;accord
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPOSANTS
========================================================= */

const inputClass =
  "min-h-[50px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-[#15171C] placeholder:text-gray-400 outline-none transition focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100 sm:text-sm";

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA] sm:h-11 sm:w-11">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-extrabold sm:text-lg">
            {title}
          </h2>

          <p className="mt-0.5 text-xs leading-5 text-gray-500 sm:mt-1 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-bold text-gray-800">
          {label}
        </label>

        {optional && (
          <span className="text-[11px] font-medium text-gray-400">
            {optional}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

function MoneyInput({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-[76px] font-semibold`}
      />

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
        FCFA
      </span>
    </div>
  );
}

function AgreementSummary({
  clientName,
  title,
  totalAmount,
  depositAmount,
  deliveryDate,
}: {
  clientName: string;
  title: string;
  totalAmount: string;
  depositAmount: string;
  deliveryDate: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#4338CA]">
          Vérification
        </p>

        <h3 className="mt-1 text-base font-extrabold">
          Résumé de l&apos;accord
        </h3>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <SummaryLine
          label="Client"
          value={clientName || "Non renseigné"}
        />

        <SummaryLine
          label="Objet"
          value={title || "Non renseigné"}
        />

        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 lg:grid-cols-1">
          <div className="rounded-xl bg-[#F7F8FC] p-3.5">
            <p className="text-xs font-medium text-gray-500">
              Montant total
            </p>

            <p className="mt-1 break-words text-lg font-extrabold tracking-tight text-[#15171C]">
              {totalAmount}
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F8FC] p-3.5">
            <p className="text-xs font-medium text-gray-500">
              Acompte
            </p>

            <p className="mt-1 break-words text-base font-bold text-[#15171C]">
              {depositAmount}
            </p>
          </div>
        </div>

        <SummaryLine
          label="Date prévue"
          value={deliveryDate}
        />
      </div>
    </section>
  );
}

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-[#15171C]">
        {value}
      </p>
    </div>
  );
}

function PrimaryButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#3730A3] active:bg-[#312E81] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Création...
        </>
      ) : (
        <>
          Créer l&apos;accord
          <ChevronRight className="h-5 w-5" />
        </>
      )}
    </button>
  );
}

function DraftButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 disabled:opacity-60"
    >
      <Save className="h-4 w-4" />
      Enregistrer comme brouillon
    </button>
  );
}