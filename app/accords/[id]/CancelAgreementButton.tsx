"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Ban, Loader2, X } from "lucide-react";

type CancelAgreementButtonProps = {
  agreementId: string;
  status: string;
};

export default function CancelAgreementButton({
  agreementId,
  status,
}: CancelAgreementButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canCancel =
    status === "pending" ||
    status === "confirmed" ||
    status === "in_progress";

  if (!canCancel) {
    return null;
  }

  async function handleCancelAgreement() {
    if (saving) return;

    const cleanReason = reason.trim();

    setErrorMessage("");

    if (cleanReason.length < 5) {
      setErrorMessage(
        "Veuillez indiquer un motif d'annulation suffisamment clair."
      );
      return;
    }

    setSaving(true);

    const { data, error } = await supabase.rpc(
      "cancel_agreement",
      {
        p_agreement_id: agreementId,
        p_reason: cleanReason,
      }
    );

    if (error) {
      console.error("CANCEL AGREEMENT ERROR:", error);

      setErrorMessage(
        "L'accord n'a pas pu être annulé. Veuillez réessayer."
      );

      setSaving(false);
      return;
    }

    if (data !== true) {
      setErrorMessage(
        "Cet accord ne peut plus être annulé. Actualisez la page pour voir son état actuel."
      );

      setSaving(false);
      return;
    }

    setShowModal(false);
    setReason("");
    setSaving(false);

    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setReason("");
          setErrorMessage("");
          setShowModal(true);
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        <Ban className="h-4 w-4" />
        Annuler l&apos;accord
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 text-[#15171C] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Ban className="h-5 w-5" />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Annuler cet accord ?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              L&apos;accord sera conservé dans Wóolu avec son historique
              et ses paiements déjà déclarés.
            </p>

            {status !== "pending" && (
              <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                Cet accord a déjà été confirmé
                {status === "in_progress"
                  ? " et sa réalisation a commencé"
                  : ""}
                . Son annulation restera donc visible dans son historique.
              </div>
            )}

            <div className="mt-5">
              <label
                htmlFor="cancellation-reason"
                className="text-sm font-semibold text-gray-700"
              >
                Motif de l&apos;annulation *
              </label>

              <textarea
                id="cancellation-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                disabled={saving}
                placeholder="Ex. Le client et le prestataire ont décidé de ne pas poursuivre la réalisation."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#4338CA] focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
              />
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Retour
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleCancelAgreement}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Annulation...
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" />
                    Confirmer l&apos;annulation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}