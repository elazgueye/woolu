"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Search,
  UserRound,
} from "lucide-react";

type Participant = {
  full_name: string;
  role: string;
  confirmation_status: string;
};

type Agreement = {
  id: string;
  reference: string;
  title: string;
  total_amount: number | string | null;
  deposit_amount: number | string | null;
  status: string;
  delivery_date: string | null;
  created_at: string;
  agreement_participants: Participant[] | null;
};

type Filter =
  | "all"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "draft";

export default function AgreementsList({
  agreements,
}: {
  agreements: Agreement[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredAgreements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return agreements.filter((agreement) => {
      const client = agreement.agreement_participants?.find(
        (participant) => participant.role === "recipient"
      );

      const matchesFilter =
        filter === "all" || agreement.status === filter;

      const matchesSearch =
        query === "" ||
        agreement.reference?.toLowerCase().includes(query) ||
        agreement.title?.toLowerCase().includes(query) ||
        client?.full_name?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [agreements, search, filter]);

  return (
    <>
      {/* ======================================= */}
      {/* RECHERCHE + FILTRES */}
      {/* ======================================= */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:mt-7 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Recherche */}
          <div className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border border-gray-200 bg-[#FAFAFC] px-4 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-50 lg:w-[400px]">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Client, référence ou objet..."
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Filtres mobile = scroll horizontal */}
          <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 lg:w-auto">
              <FilterButton
                label="Tous"
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />

              <FilterButton
                label="En attente"
                active={filter === "pending"}
                onClick={() => setFilter("pending")}
              />

              <FilterButton
                label="Confirmés"
                active={filter === "confirmed"}
                onClick={() => setFilter("confirmed")}
              />

              <FilterButton
                label="En cours"
                active={filter === "in_progress"}
                onClick={() => setFilter("in_progress")}
              />

              <FilterButton
                label="Terminés"
                active={filter === "completed"}
                onClick={() => setFilter("completed")}
              />

              <FilterButton
                label="Annulés"
                active={filter === "cancelled"}
                onClick={() => setFilter("cancelled")}
              />

              <FilterButton
                label="Brouillons"
                active={filter === "draft"}
                onClick={() => setFilter("draft")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* LISTE */}
      {/* ======================================= */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-5">
        {filteredAgreements.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[320px] sm:px-6 sm:py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <Search className="h-6 w-6 text-[#4338CA]" />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Aucun accord trouvé
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Essayez une autre recherche ou choisissez un autre filtre.
            </p>

            {(search || filter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-5 min-h-[44px] rounded-xl px-4 text-sm font-bold text-[#4338CA] active:bg-indigo-50"
              >
                Réinitialiser
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ======================================= */}
            {/* MOBILE */}
            {/* ======================================= */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredAgreements.map((agreement) => {
                const client = agreement.agreement_participants?.find(
                  (participant) => participant.role === "recipient"
                );

                return (
                  <Link
                    key={agreement.id}
                    href={`/accords/${agreement.id}`}
                    className="block p-4 transition active:bg-[#F8F8FC]"
                  >
                    {/* Ligne supérieure */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-[#4338CA]">
                            {agreement.reference}
                          </p>

                          <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
                        </div>

                        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-5 text-gray-900">
                          {agreement.title}
                        </h3>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <UserRound className="h-4 w-4 shrink-0 text-gray-400" />

                      <span className="truncate font-medium">
                        {client?.full_name || "Client"}
                      </span>
                    </div>

                    {/* Montant + statut */}
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-gray-400">
                          Montant
                        </p>

                        <p className="mt-0.5 whitespace-nowrap text-base font-extrabold tracking-tight text-gray-900">
                          {Number(
                            agreement.total_amount || 0
                          ).toLocaleString("fr-FR")}{" "}
                          <span className="text-xs font-bold">
                            FCFA
                          </span>
                        </p>
                      </div>

                      <StatusBadge status={agreement.status} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ======================================= */}
            {/* TABLETTE / DESKTOP */}
            {/* ======================================= */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr_40px] gap-4 border-b border-gray-100 bg-[#FAFAFC] px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                <span>Accord</span>
                <span>Client</span>
                <span>Montant</span>
                <span>Statut</span>
                <span />
              </div>

              {filteredAgreements.map((agreement) => {
                const client = agreement.agreement_participants?.find(
                  (participant) => participant.role === "recipient"
                );

                return (
                  <Link
                    key={agreement.id}
                    href={`/accords/${agreement.id}`}
                    className="group grid grid-cols-[1.6fr_1fr_1fr_0.8fr_40px] items-center gap-4 border-b border-gray-100 px-6 py-5 transition last:border-0 hover:bg-[#FAFAFC]"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#4338CA]">
                          {agreement.reference}
                        </p>

                        <p className="mt-1 truncate font-bold">
                          {agreement.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            agreement.created_at
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <p className="truncate text-sm font-semibold">
                      {client?.full_name || "Client"}
                    </p>

                    <p className="text-sm font-bold">
                      {Number(
                        agreement.total_amount || 0
                      ).toLocaleString("fr-FR")}{" "}
                      FCFA
                    </p>

                    <StatusBadge status={agreement.status} />

                    <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#4338CA]" />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* COMPTEUR */}
      <p className="mt-3 px-1 text-xs font-medium text-gray-400 sm:mt-4 sm:text-sm">
        {filteredAgreements.length} accord
        {filteredAgreements.length > 1 ? "s" : ""} affiché
        {filteredAgreements.length > 1 ? "s" : ""}
      </p>
    </>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[42px] shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#4338CA] text-white shadow-sm"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-green-700 sm:px-3 sm:text-xs">
        <Check className="h-3.5 w-3.5" />
        Confirmé
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-700 sm:px-3 sm:text-xs">
        <Clock3 className="h-3.5 w-3.5" />
        En attente
      </span>
    );
  }

  if (status === "in_progress") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-[#4338CA] sm:px-3 sm:text-xs">
        <Clock3 className="h-3.5 w-3.5" />
        En cours
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 sm:px-3 sm:text-xs">
        <Check className="h-3.5 w-3.5" />
        Terminé
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="inline-flex shrink-0 rounded-full bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-700 sm:px-3 sm:text-xs">
        Annulé
      </span>
    );
  }

  if (status === "draft") {
    return (
      <span className="inline-flex shrink-0 rounded-full bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold text-gray-600 sm:px-3 sm:text-xs">
        Brouillon
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 rounded-full bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold text-gray-600 sm:px-3 sm:text-xs">
      {status}
    </span>
  );
}