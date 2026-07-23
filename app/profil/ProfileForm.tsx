"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

type ProfileFormProps = {
  userId: string;
  initialFullName: string;
  initialBusinessName: string;
  initialPhone: string;
  initialCountry: string;
};

export default function ProfileForm({
  userId,
  initialFullName,
  initialBusinessName,
  initialPhone,
  initialCountry,
}: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(initialFullName);

  const [businessName, setBusinessName] =
    useState(initialBusinessName);

  const [phone, setPhone] = useState(initialPhone);

  const [country, setCountry] = useState(
    initialCountry || "Sénégal"
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setSuccess(false);
    setErrorMessage("");

    const cleanFullName = fullName.trim();
    const cleanBusinessName = businessName.trim();
    const cleanPhone = phone.trim();

    if (!cleanFullName) {
      setErrorMessage("Le nom complet est obligatoire.");
      setSaving(false);
      return;
    }

    if (!country) {
      setErrorMessage("Veuillez sélectionner votre pays.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: cleanFullName,
        business_name: cleanBusinessName || null,
        phone: cleanPhone || null,
        country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setErrorMessage(
        "La modification du profil n'a pas pu être enregistrée."
      );

      setSaving(false);
      return;
    }

    /*
     * On met également à jour les métadonnées Auth.
     * Elles servent déjà de solution de secours dans ProfilePage.
     */
    const { error: metadataError } =
      await supabase.auth.updateUser({
        data: {
          full_name: cleanFullName,
          business_name: cleanBusinessName,
          phone: cleanPhone,
          country,
        },
      });

    if (metadataError) {
      console.error(
        "AUTH METADATA UPDATE ERROR:",
        metadataError
      );

      /*
       * Le profil principal a déjà été enregistré.
       * On ne bloque donc pas l'utilisateur.
       */
    }

    setSuccess(true);
    setSaving(false);

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-7"
    >
      {/* EN-TÊTE */}
      <div>
        <h2 className="text-base font-extrabold sm:text-lg">
          Modifier mes informations
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          Ces informations seront utilisées dans votre espace
          Wóolu et sur vos accords.
        </p>
      </div>

      {/* CHAMPS */}
      <div className="mt-5 grid gap-5 sm:mt-7 md:grid-cols-2">
        {/* NOM */}
        <div>
          <label
            htmlFor="profile-full-name"
            className="text-sm font-bold text-gray-700"
          >
            Nom complet *
          </label>

          <div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
            <UserRound className="h-5 w-5 shrink-0 text-gray-400" />

            <input
              id="profile-full-name"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
              placeholder="Votre nom complet"
            />
          </div>
        </div>

        {/* ENTREPRISE */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="profile-business"
              className="text-sm font-bold text-gray-700"
            >
              Entreprise ou activité
            </label>

            <span className="text-[11px] font-medium text-gray-400">
              Facultatif
            </span>
          </div>

          <div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
            <Building2 className="h-5 w-5 shrink-0 text-gray-400" />

            <input
              id="profile-business"
              type="text"
              autoComplete="organization"
              value={businessName}
              onChange={(event) =>
                setBusinessName(event.target.value)
              }
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
              placeholder="Ex. Ibrahima Menuiserie"
            />
          </div>
        </div>

        {/* TÉLÉPHONE */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="profile-phone"
              className="text-sm font-bold text-gray-700"
            >
              Téléphone
            </label>

            <span className="text-[11px] font-medium text-gray-400">
              Facultatif
            </span>
          </div>

          <div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
            <Phone className="h-5 w-5 shrink-0 text-gray-400" />

            <input
              id="profile-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm"
              placeholder="+221 77 000 00 00"
            />
          </div>
        </div>

        {/* PAYS */}
        <div>
          <label
            htmlFor="profile-country"
            className="text-sm font-bold text-gray-700"
          >
            Pays *
          </label>

          <div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
            <MapPin className="h-5 w-5 shrink-0 text-gray-400" />

            <select
              id="profile-country"
              required
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
              className="min-w-0 flex-1 cursor-pointer bg-transparent py-3 text-base text-gray-900 outline-none sm:text-sm"
            >
              <option value="Sénégal">Sénégal</option>

              <option value="Côte d'Ivoire">
                Côte d&apos;Ivoire
              </option>

              <option value="Mali">Mali</option>

              <option value="Guinée">Guinée</option>

              <option value="Burkina Faso">
                Burkina Faso
              </option>

              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERREUR */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* SUCCÈS */}
      {success && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <span>
            Profil mis à jour avec succès.
          </span>
        </div>
      )}

      {/* BOUTON */}
      <div className="mt-6 sm:mt-7 sm:flex sm:justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white transition hover:bg-[#3730A3] active:bg-[#312E81] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </form>
  );
}