"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
} from "lucide-react";

type Agreement = {
  id: string;
  reference: string;
  title: string;
  total_amount: number | string;
  status: string;
};

type Profile = {
  full_name: string | null;
  business_name: string | null;
};

const paymentMethods = [
  {
    value: "wave",
    label: "Wave",
    icon: Smartphone,
  },
  {
    value: "orange_money",
    label: "Orange Money",
    icon: Smartphone,
  },
  {
    value: "cash",
    label: "Espèces",
    icon: Banknote,
  },
  {
    value: "bank_transfer",
    label: "Virement",
    icon: Building2,
  },
  {
    value: "check",
    label: "Chèque",
    icon: CreditCard,
  },
  {
    value: "other",
    label: "Autre",
    icon: Wallet,
  },
];

export default function NewPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const agreementId = params.id as string;

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [alreadyPaid, setAlreadyPaid] = useState(0);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [paidAt, setPaidAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoadingPage(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/connexion");
        return;
      }

      const [
        { data: agreementData, error: agreementError },
        { data: payments, error: paymentsError },
        { data: profileData },
      ] = await Promise.all([
        supabase
          .from("agreements")
          .select("id, reference, title, total_amount, status")
          .eq("id", agreementId)
          .single(),

        supabase
          .from("payments")
          .select("amount, status")
          .eq("agreement_id", agreementId),

        supabase
          .from("profiles")
          .select("full_name, business_name")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      if (agreementError || !agreementData) {
        setError("Impossible de charger cet accord.");
        setLoadingPage(false);
        return;
      }

      if (paymentsError) {
        setError("Impossible de charger les paiements.");
        setLoadingPage(false);
        return;
      }

      const totalPaid = (payments || [])
        .filter((payment) => payment.status !== "cancelled")
        .reduce(
          (total, payment) =>
            total + Number(payment.amount || 0),
          0
        );

      setAgreement(agreementData);
      setAlreadyPaid(totalPaid);
      setProfile(profileData || null);
      setLoadingPage(false);
    }

    loadData();
  }, [agreementId, router, supabase]);

  const totalAmount = Number(agreement?.total_amount || 0);

  const remainingAmount = Math.max(
    totalAmount - alreadyPaid,
    0
  );

  const enteredAmount = Number(amount || 0);

  const remainingAfterPayment = Math.max(
    remainingAmount - enteredAmount,
    0
  );

  const canReceivePayment =
    agreement?.status === "confirmed" ||
    agreement?.status === "in_progress" ||
    agreement?.status === "completed";

  const fullName = profile?.full_name || "Utilisateur";
  const businessName =
    profile?.business_name || "Compte personnel";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!agreement || !canReceivePayment) {
      setError(
        "Cet accord ne peut pas recevoir de paiement dans son état actuel."
      );
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Saisissez un montant valide.");
      return;
    }

    if (numericAmount > remainingAmount) {
      setError(
        `Le paiement ne peut pas dépasser le reste à payer de ${remainingAmount.toLocaleString(
          "fr-FR"
        )} FCFA.`
      );
      return;
    }

    setSaving(true);

    const paidAtTimestamp = new Date(
      `${paidAt}T12:00:00`
    ).toISOString();

    const { data, error: paymentError } =
      await supabase.rpc("create_agreement_payment", {
        p_agreement_id: agreementId,
        p_amount: numericAmount,
        p_payment_method: paymentMethod,
        p_note: note.trim(),
        p_paid_at: paidAtTimestamp,
      });

    if (paymentError) {
      console.error("PAYMENT RPC ERROR:", paymentError);

      setError(
        "Le paiement n'a pas pu être enregistré. Veuillez réessayer."
      );

      setSaving(false);
      return;
    }

    if (data !== true) {
      setError(
        "Ce paiement ne peut pas être enregistré. Vérifiez le statut de l'accord et le montant restant à payer."
      );

      setSaving(false);
      return;
    }

    router.push(`/accords/${agreementId}`);
    router.refresh();
  }

  if (loadingPage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement...
        </div>
      </main>
    );
  }

  if (!agreement) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-extrabold">
            Accord introuvable
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Cet accord n&apos;est pas disponible ou vous
            n&apos;avez pas accès à celui-ci.
          </p>

          <Link
            href="/accords"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#4338CA] px-5 text-sm font-bold text-white"
          >
            Retour aux accords
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={businessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <div className="mx-auto max-w-[1150px] px-4 pb-28 pt-6 sm:px-8 sm:pb-10 sm:pt-8 lg:px-10 lg:py-10">
          <Link
            href={`/accords/${agreementId}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-bold text-gray-500 transition hover:bg-white hover:text-[#4338CA]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accord
          </Link>

          <div className="mt-4 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
              Paiement
            </p>

            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Enregistrer un paiement
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Ajoutez le montant réellement reçu pour cet accord.
            </p>
          </div>

          {!canReceivePayment && (
            <div className="mt-5 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold leading-6 text-amber-800">
              Cet accord ne peut pas recevoir de paiement dans son
              état actuel.
            </div>
          )}

          <div className="mt-6 grid items-start gap-5 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
            <form
              id="payment-form"
              onSubmit={handleSubmit}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div>
                <label className="text-sm font-bold">
                  Montant reçu *
                </label>

                <div className="mt-2 flex min-h-[54px] overflow-hidden rounded-xl border border-gray-300 bg-white transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={remainingAmount}
                    step="1"
                    required
                    disabled={!canReceivePayment || saving}
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    placeholder="Ex. 100000"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-lg font-bold outline-none placeholder:text-base placeholder:font-normal placeholder:text-gray-400 disabled:bg-gray-50"
                  />

                  <div className="flex shrink-0 items-center border-l border-gray-200 bg-gray-50 px-3 text-xs font-bold text-gray-500 sm:px-4 sm:text-sm">
                    FCFA
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-gray-400">
                    Reste actuellement :{" "}
                    <strong className="text-gray-600">
                      {remainingAmount.toLocaleString("fr-FR")} FCFA
                    </strong>
                  </p>

                  {remainingAmount > 0 && (
                    <button
                      type="button"
                      disabled={!canReceivePayment || saving}
                      onClick={() =>
                        setAmount(String(remainingAmount))
                      }
                      className="text-xs font-bold text-[#4338CA] disabled:opacity-50"
                    >
                      Tout solder
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Mode de paiement *
                </label>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const selected =
                      paymentMethod === method.value;

                    return (
                      <button
                        key={method.value}
                        type="button"
                        disabled={!canReceivePayment || saving}
                        onClick={() =>
                          setPaymentMethod(method.value)
                        }
                        className={`flex min-h-[64px] items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-xs font-bold transition sm:text-sm ${
                          selected
                            ? "border-[#4338CA] bg-indigo-50 text-[#4338CA] ring-1 ring-[#4338CA]"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? "bg-white"
                              : "bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 leading-4">
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Date du paiement *
                </label>

                <div className="relative mt-2">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="date"
                    required
                    disabled={!canReceivePayment || saving}
                    value={paidAt}
                    onChange={(event) =>
                      setPaidAt(event.target.value)
                    }
                    className="min-h-[52px] w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-50 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold">
                    Note
                  </label>

                  <span className="text-[11px] font-medium text-gray-400">
                    Facultatif
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={note}
                  disabled={!canReceivePayment || saving}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Ex. Acompte reçu par Wave..."
                  className="mt-2 min-h-[110px] w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-50 sm:text-sm"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  saving ||
                  remainingAmount <= 0 ||
                  !canReceivePayment
                }
                className="mt-7 hidden min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 font-bold text-white transition hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Enregistrer le paiement
                  </>
                )}
              </button>
            </form>

            <aside className="min-w-0">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="break-all text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#4338CA]">
                      {agreement.reference}
                    </p>

                    <h2 className="mt-1 break-words text-base font-extrabold">
                      {agreement.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
                  <MoneyCard
                    label="Montant de l'accord"
                    value={totalAmount}
                  />

                  <MoneyCard
                    label="Déjà déclaré"
                    value={alreadyPaid}
                  />

                  <div className="col-span-2 lg:col-span-1">
                    <MoneyCard
                      label="Reste actuel"
                      value={remainingAmount}
                      strong
                    />
                  </div>
                </div>

                {enteredAmount > 0 &&
                  enteredAmount <= remainingAmount &&
                  canReceivePayment && (
                    <div className="mt-4 rounded-xl bg-green-50 p-4">
                      <p className="text-xs font-bold text-green-700">
                        Après ce paiement
                      </p>

                      <p className="mt-1 break-words text-xl font-extrabold tracking-tight text-green-800 sm:text-2xl">
                        {remainingAfterPayment.toLocaleString(
                          "fr-FR"
                        )}{" "}
                        FCFA
                      </p>

                      <p className="mt-1 text-xs text-green-700">
                        restera à payer
                      </p>
                    </div>
                  )}

                <div className="mt-4 flex gap-3 rounded-xl bg-amber-50 p-3.5">
                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <p className="text-xs leading-5 text-amber-800">
                    Ce paiement sera enregistré comme{" "}
                    <strong>déclaré</strong>. Wóolu conserve
                    l&apos;information saisie sans prétendre vérifier
                    automatiquement la transaction.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
          <button
            type="submit"
            form="payment-form"
            disabled={
              saving ||
              remainingAmount <= 0 ||
              !canReceivePayment
            }
            className="mx-auto flex min-h-[52px] w-full max-w-lg items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Enregistrer le paiement
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

function MoneyCard({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl p-3.5 ${
        strong ? "bg-indigo-50" : "bg-[#F7F8FC]"
      }`}
    >
      <p
        className={`text-[11px] font-medium ${
          strong ? "text-[#4338CA]" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1 break-words text-sm font-extrabold leading-5 ${
          strong ? "text-[#4338CA]" : "text-gray-900"
        }`}
      >
        {value.toLocaleString("fr-FR")} FCFA
      </p>
    </div>
  );
}
