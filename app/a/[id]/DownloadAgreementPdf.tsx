"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";

type Payment = {
  id: string;
  amount: number | string;
  payment_method: string | null;
  note: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
};

type DownloadAgreementPdfProps = {
  reference: string;
  title: string;
  description: string;
  creatorName: string;
  creatorPhone?: string | null;
  clientName: string;
  clientPhone?: string | null;
  totalAmount: number;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  deliveryDate: string;
  createdDate: string;
  confirmationStatus?: string | null;
  clientConfirmedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  payments?: Payment[];
  status: string;
};

export default function DownloadAgreementPdf({
  reference,
  title,
  description,
  creatorName,
  creatorPhone,
  clientName,
  clientPhone,
  totalAmount,
  depositAmount,
  paidAmount,
  remainingAmount,
  deliveryDate,
  createdDate,
  confirmationStatus,
  clientConfirmedAt,
  startedAt,
  completedAt,
  cancelledAt,
  cancellationReason,
  payments = [],
  status,
}: DownloadAgreementPdfProps) {
  function formatAmount(amount: number | string) {
    const roundedAmount = Math.round(Number(amount) || 0);

    const formatted = roundedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return `${formatted} FCFA`;
  }

  function formatPaymentMethod(method: string | null) {
    switch (method) {
      case "wave":
        return "Wave";

      case "orange_money":
        return "Orange Money";

      case "cash":
        return "Espèces";

      default:
        if (!method) {
          return "Non renseigné";
        }

        return method
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          );
    }
  }

  function formatPaymentDate(date: string | null) {
    if (!date) {
      return "Date non renseignée";
    }

    return new Date(date).toLocaleDateString("fr-FR", {
      timeZone: "Africa/Dakar",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function downloadPdf() {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const purple = [67, 56, 202] as const;
    const dark = [25, 25, 30] as const;
    const gray = [105, 105, 115] as const;
    const lightGray = [247, 247, 252] as const;
    const border = [225, 225, 235] as const;

    let y = 12;

    // ==========================================
    // EN-TÊTE
    // ==========================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(...purple);
    doc.text("Wóolu", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...gray);
    doc.text("L'accord en toute confiance", margin, y + 4.5);

    const statusText = status.toUpperCase();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);

    const statusWidth = Math.max(
      doc.getTextWidth(statusText) + 10,
      34
    );

    doc.setFillColor(238, 242, 255);

    doc.roundedRect(
      pageWidth - margin - statusWidth,
      y - 6,
      statusWidth,
      9,
      2,
      2,
      "F"
    );

    doc.setTextColor(...purple);

    doc.text(
      statusText,
      pageWidth - margin - statusWidth / 2,
      y,
      {
        align: "center",
      }
    );

    doc.setDrawColor(...border);

    doc.line(
      margin,
      y + 9,
      pageWidth - margin,
      y + 9
    );

    y += 16;

    // ==========================================
    // TITRE
    // ==========================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...purple);
    doc.text("ACCORD DE PRESTATION", margin, y);

    y += 5;

    doc.setFontSize(14);
    doc.setTextColor(...dark);

    const titleLines = doc.splitTextToSize(
      title || "Accord Wóolu",
      contentWidth
    );

    doc.text(titleLines, margin, y);

    y += titleLines.length * 5.5 + 3;

    // ==========================================
    // RÉFÉRENCE
    // ==========================================

    doc.setFillColor(...lightGray);

    doc.roundedRect(
      margin,
      y,
      contentWidth,
      14,
      2.5,
      2.5,
      "F"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(...gray);
    doc.text("RÉFÉRENCE WÓOLU", margin + 5, y + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...purple);
    doc.text(reference, margin + 5, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...gray);

    doc.text(
      `Créé le ${createdDate}`,
      pageWidth - margin - 5,
      y + 9,
      {
        align: "right",
      }
    );

    y += 19;

    // ==========================================
    // PARTIES
    // ==========================================

    sectionTitle(doc, "LES PARTIES", margin, y);

    y += 4;

    const gap = 5;
    const boxWidth = (contentWidth - gap) / 2;
    const boxHeight = 22;

    // PRESTATAIRE

    doc.setFillColor(252, 252, 254);
    doc.setDrawColor(...border);

    doc.roundedRect(
      margin,
      y,
      boxWidth,
      boxHeight,
      2.5,
      2.5,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(...purple);
    doc.text("PRESTATAIRE", margin + 5, y + 5);

    doc.setFontSize(8.5);
    doc.setTextColor(...dark);

    const creatorLines = doc.splitTextToSize(
      creatorName || "Non renseigné",
      boxWidth - 10
    );

    doc.text(creatorLines, margin + 5, y + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...gray);

    doc.text(
      `Tél. : ${creatorPhone || "Non renseigné"}`,
      margin + 5,
      y + 18
    );

    // CLIENT

    const clientX = margin + boxWidth + gap;

    doc.setFillColor(252, 252, 254);
    doc.setDrawColor(...border);

    doc.roundedRect(
      clientX,
      y,
      boxWidth,
      boxHeight,
      2.5,
      2.5,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(...purple);
    doc.text("CLIENT", clientX + 5, y + 5);

    doc.setFontSize(8.5);
    doc.setTextColor(...dark);

    const clientLines = doc.splitTextToSize(
      clientName || "Non renseigné",
      boxWidth - 10
    );

    doc.text(clientLines, clientX + 5, y + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...gray);

    doc.text(
      `Tél. : ${clientPhone || "Non renseigné"}`,
      clientX + 5,
      y + 18
    );

    y += boxHeight + 5;

    // ==========================================
    // CONFIRMATION
    // ==========================================

    sectionTitle(
      doc,
      "CONFIRMATION DE L'ACCORD",
      margin,
      y
    );

    y += 4;

    const isAccepted =
      confirmationStatus === "accepted";

    if (isAccepted) {
      const confirmationHeight = clientConfirmedAt
        ? 19
        : 15;

      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);

      doc.roundedRect(
        margin,
        y,
        contentWidth,
        confirmationHeight,
        2.5,
        2.5,
        "FD"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61);

      doc.text(
        "Accord accepté par le client",
        margin + 5,
        y + 5.5
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);
      doc.setTextColor(70, 90, 75);

      doc.text(
        `${clientName} a confirmé les conditions de cet accord.`,
        margin + 5,
        y + 10.5
      );

      if (clientConfirmedAt) {
        doc.setFont("helvetica", "bold");

        doc.text(
          `Confirmation enregistrée le ${clientConfirmedAt}`,
          margin + 5,
          y + 15.5
        );
      }

      y += confirmationHeight + 5;
    } else {
      doc.setFillColor(...lightGray);
      doc.setDrawColor(...border);

      doc.roundedRect(
        margin,
        y,
        contentWidth,
        15,
        2.5,
        2.5,
        "FD"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...gray);

      doc.text(
        "Confirmation du client non enregistrée",
        margin + 5,
        y + 5.5
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.8);

      doc.text(
        "L'accord est toujours en attente de confirmation.",
        margin + 5,
        y + 10.5
      );

      y += 20;
    }

    // ==========================================
    // PRESTATION
    // ==========================================

    sectionTitle(
      doc,
      "PRESTATION CONVENUE",
      margin,
      y
    );

    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...dark);

    const serviceTitle = doc.splitTextToSize(
      title || "Prestation",
      contentWidth
    );

    doc.text(serviceTitle, margin, y);

    y += serviceTitle.length * 4.2 + 1.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(75, 75, 85);

    let descriptionLines = doc.splitTextToSize(
      description ||
        "Aucune description supplémentaire n'a été ajoutée.",
      contentWidth
    );

    const maxDescriptionLines = 3;

    if (descriptionLines.length > maxDescriptionLines) {
      descriptionLines = descriptionLines.slice(
        0,
        maxDescriptionLines
      );

      const lastIndex = descriptionLines.length - 1;

      descriptionLines[lastIndex] =
        `${descriptionLines[lastIndex].replace(/\.*$/, "")}...`;
    }

    doc.text(descriptionLines, margin, y);

    y += descriptionLines.length * 3.5 + 4;

    // ==========================================
    // CONDITIONS FINANCIÈRES
    // ==========================================

    sectionTitle(
      doc,
      "CONDITIONS FINANCIÈRES",
      margin,
      y
    );

    y += 4;

    doc.setFillColor(...lightGray);

    doc.roundedRect(
      margin,
      y,
      contentWidth,
      28,
      2.5,
      2.5,
      "F"
    );

    financialLine(
      doc,
      "Montant convenu",
      formatAmount(totalAmount),
      margin + 5,
      pageWidth - margin - 5,
      y + 5.5
    );

    financialLine(
      doc,
      "Acompte prévu",
      formatAmount(depositAmount),
      margin + 5,
      pageWidth - margin - 5,
      y + 11.2
    );

    financialLine(
      doc,
      "Paiements déclarés",
      formatAmount(paidAmount),
      margin + 5,
      pageWidth - margin - 5,
      y + 17
    );

    financialLine(
      doc,
      "Reste à payer",
      formatAmount(remainingAmount),
      margin + 5,
      pageWidth - margin - 5,
      y + 23.2,
      true
    );

    y += 33;

    // ==========================================
    // HISTORIQUE DES PAIEMENTS
    // ==========================================

    if (payments.length > 0) {
      sectionTitle(
        doc,
        "PAIEMENTS ENREGISTRÉS",
        margin,
        y
      );

      y += 4;

      payments.forEach((payment, index) => {
        const paymentHeight = payment.note ? 16 : 12.5;

        if (
          y + paymentHeight >
          pageHeight - 24
        ) {
          doc.addPage();
          y = 16;

          sectionTitle(
            doc,
            "PAIEMENTS ENREGISTRÉS — SUITE",
            margin,
            y
          );

          y += 5;
        }

        doc.setDrawColor(...border);

        doc.roundedRect(
          margin,
          y,
          contentWidth,
          paymentHeight,
          2,
          2,
          "S"
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(...gray);

        doc.text(
          formatPaymentDate(payment.paid_at),
          margin + 5,
          y + 4.5
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...dark);

        doc.text(
          formatAmount(payment.amount),
          pageWidth - margin - 5,
          y + 4.5,
          {
            align: "right",
          }
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.8);
        doc.setTextColor(...purple);

        doc.text(
          formatPaymentMethod(
            payment.payment_method
          ),
          margin + 5,
          y + 9.5
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(...gray);

        doc.text(
          payment.status === "declared"
            ? "Déclaré"
            : payment.status,
          pageWidth - margin - 5,
          y + 9.5,
          {
            align: "right",
          }
        );

        if (payment.note) {
          const noteLines = doc.splitTextToSize(
            `Note : ${payment.note}`,
            contentWidth - 10
          );

          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.2);
          doc.setTextColor(90, 90, 100);

          doc.text(
            noteLines.slice(0, 1),
            margin + 5,
            y + 13.5
          );
        }

        y += paymentHeight;

        if (index < payments.length - 1) {
          y += 2;
        }
      });

      y += 4;
    }

    // ==========================================
    // HISTORIQUE DE L'ACCORD
    // ==========================================

    function formatTimelineDate(date: string | null | undefined) {
      if (!date) {
        return null;
      }

      return new Date(date).toLocaleString("fr-FR", {
        timeZone: "Africa/Dakar",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const timelineItems: {
      label: string;
      date: string | null;
      type?: "normal" | "cancelled";
    }[] = [];

    // 1. Création
    timelineItems.push({
      label: "Accord créé",
      date: createdDate,
    });

    // 2. Confirmation du client
    if (
      confirmationStatus === "accepted" &&
      clientConfirmedAt
    ) {
      timelineItems.push({
        label: "Accord accepté par le client",
        date: clientConfirmedAt,
      });
    }

    // 3. Démarrage
    if (startedAt) {
      timelineItems.push({
        label: "Réalisation démarrée",
        date: formatTimelineDate(startedAt),
      });
    }

    // 4. Fin
    if (completedAt) {
      timelineItems.push({
        label: "Réalisation terminée",
        date: formatTimelineDate(completedAt),
      });
    }

    // 5. Annulation
    if (cancelledAt) {
      timelineItems.push({
        label: "Accord annulé",
        date: formatTimelineDate(cancelledAt),
        type: "cancelled",
      });
    }

    const timelineRowHeight = 11;
    const cancellationExtraHeight =
      cancelledAt && cancellationReason ? 13 : 0;

    const timelineHeight =
      9 +
      timelineItems.length * timelineRowHeight +
      cancellationExtraHeight;

    if (
      y + timelineHeight >
      pageHeight - 24
    ) {
      doc.addPage();
      y = 16;
    }

    sectionTitle(
      doc,
      "HISTORIQUE DE L'ACCORD",
      margin,
      y
    );

    y += 5;

    doc.setDrawColor(...border);

    doc.roundedRect(
      margin,
      y,
      contentWidth,
      timelineHeight,
      2.5,
      2.5,
      "S"
    );

    let timelineY = y + 7;

    timelineItems.forEach((item, index) => {
      const isCancellation =
        item.type === "cancelled";

      // Petit cercle d'état
      if (isCancellation) {
        doc.setFillColor(254, 226, 226);
        doc.circle(
          margin + 7,
          timelineY - 1.2,
          2.4,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(185, 28, 28);

        doc.text(
          "×",
          margin + 7,
          timelineY - 0.2,
          {
            align: "center",
          }
        );
      } else {
        doc.setFillColor(220, 252, 231);
        doc.circle(
          margin + 7,
          timelineY - 1.2,
          2.4,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.8);
        doc.setTextColor(21, 128, 61);

        // Coche dessinée manuellement pour éviter
        // les problèmes Unicode avec Helvetica/jsPDF
        doc.setDrawColor(21, 128, 61);
        doc.setLineWidth(0.45);

        doc.line(
          margin + 5.9,
          timelineY - 1.2,
          margin + 6.7,
          timelineY - 0.4
        );

        doc.line(
          margin + 6.7,
          timelineY - 0.4,
          margin + 8.2,
          timelineY - 2.1
        );

        doc.setLineWidth(0.2);
      }

      // Ligne verticale
      if (index < timelineItems.length - 1) {
        doc.setDrawColor(225, 225, 235);

        doc.line(
          margin + 7,
          timelineY + 1.5,
          margin + 7,
          timelineY + timelineRowHeight - 3
        );
      }

      // Nom de l'étape
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.3);

      if (isCancellation) {
        doc.setTextColor(185, 28, 28);
      } else {
        doc.setTextColor(...dark);
      }

      doc.text(
        item.label,
        margin + 13,
        timelineY
      );

      // Date
      if (item.date) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.3);
        doc.setTextColor(...gray);

        doc.text(
          item.date,
          margin + 13,
          timelineY + 4
        );
      }

      timelineY += timelineRowHeight;
    });

    // ==========================================
    // MOTIF D'ANNULATION
    // ==========================================

    if (cancelledAt && cancellationReason) {
      const reasonY = timelineY - 1;

      doc.setFillColor(254, 242, 242);

      doc.roundedRect(
        margin + 5,
        reasonY,
        contentWidth - 10,
        10,
        2,
        2,
        "F"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.setTextColor(185, 28, 28);

      doc.text(
        "Motif de l'annulation",
        margin + 9,
        reasonY + 3.5
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.1);
      doc.setTextColor(100, 50, 50);

      const reasonLines = doc.splitTextToSize(
        cancellationReason,
        contentWidth - 28
      );

      doc.text(
        reasonLines.slice(0, 1),
        margin + 9,
        reasonY + 7.5
      );
    }

    y += timelineHeight + 5;

    const traceabilityHeight = 18;

    if (
      y + traceabilityHeight >
      pageHeight - 20
    ) {
      doc.addPage();
      y = 16;
    }

    sectionTitle(
      doc,
      "TRAÇABILITÉ WÓOLU",
      margin,
      y
    );

    y += 4;

    doc.setFillColor(...lightGray);

    doc.roundedRect(
      margin,
      y,
      contentWidth,
      16,
      2.5,
      2.5,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...purple);

    doc.text(
      `Référence : ${reference}`,
      margin + 5,
      y + 4.5
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.setTextColor(...gray);

    const notice = doc.splitTextToSize(
      "Document généré à partir des informations enregistrées dans Wóolu au moment du téléchargement. Il conserve une trace de l'accord, de son acceptation et des paiements déclarés.",
      contentWidth - 10
    );

    doc.text(
      notice,
      margin + 5,
      y + 9
    );

    // ==========================================
    // PIED DE PAGE
    // ==========================================

    const generatedAt = new Date().toLocaleString(
      "fr-FR",
      {
        timeZone: "Africa/Dakar",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const pageCount = doc.getNumberOfPages();

    for (
      let pageNumber = 1;
      pageNumber <= pageCount;
      pageNumber++
    ) {
      doc.setPage(pageNumber);

      doc.setDrawColor(...border);

      doc.line(
        margin,
        pageHeight - 15,
        pageWidth - margin,
        pageHeight - 15
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(135, 135, 145);

      doc.text(
        `Wóolu • ${reference} • Généré le ${generatedAt}`,
        margin,
        pageHeight - 9
      );

      doc.text(
        `Page ${pageNumber}/${pageCount}`,
        pageWidth - margin,
        pageHeight - 9,
        {
          align: "right",
        }
      );
    }

    // ==========================================
    // TÉLÉCHARGEMENT
    // ==========================================

    const safeReference = reference.replace(
      /[^a-zA-Z0-9-_]/g,
      "-"
    );

    doc.save(
      `Accord-Woolu-${safeReference}.pdf`
    );
  }

  return (
    <button
      type="button"
      onClick={downloadPdf}
      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#4338CA] bg-white px-5 text-sm font-extrabold text-[#4338CA] transition hover:bg-indigo-50 sm:w-auto"
    >
      <Download className="h-5 w-5" />
      Télécharger l&apos;accord
    </button>
  );
}

function sectionTitle(
  doc: jsPDF,
  text: string,
  x: number,
  y: number
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(67, 56, 202);
  doc.text(text, x, y);
}

function financialLine(
  doc: jsPDF,
  label: string,
  value: string,
  leftX: number,
  rightX: number,
  y: number,
  emphasis = false
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 100);
  doc.text(label, leftX, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(emphasis ? 8.5 : 7.5);

  if (emphasis) {
    doc.setTextColor(67, 56, 202);
  } else {
    doc.setTextColor(30, 30, 35);
  }

  doc.text(value, rightX, y, {
    align: "right",
  });
}