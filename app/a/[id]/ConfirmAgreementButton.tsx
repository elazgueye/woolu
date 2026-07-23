"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

type ConfirmAgreementButtonProps = {
  token: string;
};

export default function ConfirmAgreementButton({
  token,
}: ConfirmAgreementButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (loading) return;

    setLoading(true);
    setError("");

    const { data, error } = await supabase.rpc(
      "confirm_public_agreement",
      {
        p_token: token,
      }
    );

    if (error) {
      console.error("CONFIRMATION ERROR:", error);

      setError(
        "La confirmation n'a pas pu être enregistrée. Veuillez réessayer."
      );

      setLoading(false);
      return;
    }

    if (data !== true) {
      setError(
        "Cet accord est introuvable ou ne peut plus être confirmé."
      );

      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 py-4 font-bold text-white transition hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Confirmation...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-5 w-5" />
            Confirmer l&apos;accord
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <p className="mt-3 text-center text-xs leading-5 text-gray-400">
        Votre confirmation sera enregistrée dans Wóolu.
      </p>
    </div>
  );
}