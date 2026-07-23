"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  CheckCircle2,
  Loader2,
  Play,
  X,
} from "lucide-react";

type AgreementStatusActionsProps = {
  agreementId: string;
  status: string;
};

export default function AgreementStatusActions({
  agreementId,
  status,
}: AgreementStatusActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isConfirmed = status === "confirmed";
  const isInProgress = status === "in_progress";

  // Aucune action disponible pour les autres statuts.
  if (!isConfirmed && !isInProgress) {
    return null;
  }

  const nextStatus = isConfirmed ? "in_progress" : "completed";

  const buttonLabel = isConfirmed
    ? "Démarrer l'accord"
    : "Marquer comme terminé";

  const modalTitle = isConfirmed
    ? "Démarrer cet accord ?"
    : "Marquer cet accord comme terminé ?";

  const modalDescription = isConfirmed
    ? "L'accord passera au statut « En cours ». Cela indique que sa réalisation a commencé."
    : "L'accord passera au statut « Terminé ». Cette action indique que le travail, le produit ou le service convenu a été réalisé.";

  const confirmLabel = isConfirmed
    ? "Confirmer le démarrage"
    : "Confirmer la fin";

  async function handleStatusChange() {
    if (saving) return;

    setSaving(true);
    setErrorMessage("");

    const { data, error } = await supabase.rpc(
      "change_agreement_status",
      {
        p_agreement_id: agreementId,
        p_new_status: nextStatus,
      }
    );

    if (error) {
      console.error("AGREEMENT STATUS ERROR:", error);

      setErrorMessage(
        "Le statut de l'accord n'a pas pu être modifié. Veuillez réessayer."
      );

      setSaving(false);
      return;
    }

    if (data !== true) {
      setErrorMessage(
        "Cette action n'est plus autorisée pour cet accord. Actualisez la page puis réessayez."
      );

      setSaving(false);
      return;
    }

    setShowModal(false);
    setSaving(false);

    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErrorMessage("");
          setShowModal(true);
        }}
        className={
          isConfirmed
            ? "flex items-center justify-center gap-2 rounded-xl bg-[#B7F34A] px-5 py-3 text-sm font-bold text-[#28320F] transition hover:brightness-95"
            : "flex items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3730A3]"
        }
      >
        {isConfirmed ? (
          <Play className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}

        {buttonLabel}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 text-[#15171C] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                {isConfirmed ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {modalTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {modalDescription}
            </p>

            {isInProgress && (
              <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                Le statut « Terminé » concerne la réalisation de
                l&apos;accord. Il ne signifie pas nécessairement que le
                montant total a déjà été payé.
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleStatusChange}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    {isConfirmed ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}

                    {confirmLabel}
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