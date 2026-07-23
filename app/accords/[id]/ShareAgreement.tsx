"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  MessageCircle,
} from "lucide-react";

type ShareAgreementProps = {
  publicToken: string;
  reference: string;
  title: string;
  clientName: string;
  creatorName: string;
};

export default function ShareAgreement({
  publicToken,
  reference,
  title,
  clientName,
  creatorName,
}: ShareAgreementProps) {
  const [copied, setCopied] = useState(false);

  function getPublicUrl() {
    return `${window.location.origin}/a/${publicToken}`;
  }

  function shareWhatsApp() {
    const publicUrl = getPublicUrl();

    const message =
      `Bonjour ${clientName},\n\n` +
      `${creatorName} vous a envoyé un accord via Wóolu.\n\n` +
      `📄 ${title}\n` +
      `Référence : ${reference}\n\n` +
      `Consultez et confirmez l'accord ici :\n${publicUrl}\n\n` +
      `Wóolu — L'accord en toute confiance.`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getPublicUrl());

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error("COPY LINK ERROR:", error);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={shareWhatsApp}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
      >
        <MessageCircle className="h-5 w-5" />
        Partager sur WhatsApp
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            Lien copié
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copier le lien
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-gray-400">
        Le client peut consulter l&apos;accord sans créer de compte Wóolu.
      </p>
    </div>
  );
}