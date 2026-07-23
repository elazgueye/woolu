"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import WooluLogo from "@/components/WooluLogo";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
  ShieldCheck,
} from "lucide-react";

export default function InscriptionPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Sénégal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanFullName = fullName.trim();
    const cleanBusinessName = businessName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFullName) {
      setError("Votre nom complet est obligatoire.");
      setLoading(false);
      return;
    }

    if (!cleanPhone) {
      setError("Votre numéro de téléphone est obligatoire.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanFullName,
          business_name: cleanBusinessName,
          phone: cleanPhone,
          country,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("SIGNUP ERROR:", error);

      const message = error.message.toLowerCase();

      if (
        message.includes("already registered") ||
        message.includes("already exists")
      ) {
        setError(
          "Un compte existe déjà avec cette adresse email."
        );
      } else if (message.includes("password")) {
        setError(
          "Le mot de passe choisi n'est pas accepté. Utilisez au moins 8 caractères."
        );
      } else {
        setError(error.message);
      }

      return;
    }

    setSuccess(true);
  }

  /* ======================================================
     CONFIRMATION EMAIL
  ====================================================== */

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7FB] px-4 py-8 text-[#111318] sm:px-6">
        <div className="w-full max-w-md rounded-[24px] border border-gray-200 bg-white p-5 text-center shadow-xl shadow-indigo-100/40 sm:rounded-[28px] sm:p-8">
          <Link
            href="/"
            className="mx-auto flex w-fit items-center"
            >
            <WooluLogo className="h-12 w-[145px]" />
            </Link>

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#B7F34A]/30">
            <MailCheck className="h-8 w-8 text-[#4338CA]" />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA]">
            Dernière étape
          </p>

          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-[#111318] sm:text-3xl">
            Vérifiez votre boîte mail
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
            Nous avons envoyé un lien de confirmation à
          </p>

          <p className="mt-2 break-all font-extrabold text-[#111318]">
            {email.trim().toLowerCase()}
          </p>

          <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-left">
            <p className="text-sm font-bold text-[#4338CA]">
              Que faire maintenant ?
            </p>

            <div className="mt-3 space-y-2.5 text-sm leading-6 text-gray-600">
              <p className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#4338CA]" />
                Ouvrez votre boîte mail.
              </p>

              <p className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#4338CA]" />
                Cliquez sur le lien envoyé par Wóolu.
              </p>

              <p className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#4338CA]" />
                Revenez ensuite vous connecter.
              </p>
            </div>
          </div>

          <Link
            href="/connexion"
            className="mt-6 flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#4338CA] px-5 font-extrabold text-white transition hover:bg-[#3730A3]"
          >
            Aller à la connexion
          </Link>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            Si vous ne trouvez pas le message, vérifiez également
            vos courriers indésirables.
          </p>
        </div>
      </main>
    );
  }

  /* ======================================================
     INSCRIPTION
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#F7F7FB] text-[#111318]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* PANNEAU DESKTOP */}
        <section className="relative hidden overflow-hidden bg-[#4338CA] p-10 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-[#B7F34A]/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <Link
            href="/"
            className="relative flex w-fit items-center rounded-xl bg-white px-3 py-2"
            >
            <WooluLogo className="h-11 w-[135px]" />
            </Link>

          <div className="relative max-w-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B7F34A]">
              <ShieldCheck className="h-7 w-7 text-[#4338CA]" />
            </div>

            <h2 className="text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              Les paroles passent.
              <br />
              Les accords restent.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-100">
              Créez, partagez et suivez vos accords avec vos
              clients depuis un seul endroit, même depuis votre
              téléphone.
            </p>

            <div className="mt-8 space-y-3 text-sm font-semibold text-indigo-100">
              <SignupBenefit text="Créez vos accords simplement" />
              <SignupBenefit text="Partagez-les par WhatsApp" />
              <SignupBenefit text="Gardez une trace des paiements déclarés" />
            </div>
          </div>

          <p className="relative text-sm text-indigo-200">
            Wóolu — Des accords plus clairs, simplement.
          </p>
        </section>

        {/* FORMULAIRE */}
        <section className="flex justify-center px-4 py-5 sm:px-8 sm:py-10 lg:items-center lg:px-12 lg:py-12">
          <div className="w-full max-w-lg">
            {/* MOBILE TOP */}
            <div className="flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center">
                <WooluLogo className="h-11 w-[130px]" />
                </Link>

              <Link
                href="/"
                aria-label="Retour à l'accueil"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            {/* TITRE */}
            <div className="mt-9 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
                Commencez gratuitement
              </p>

              <h1 className="mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-[#111318] sm:text-4xl">
                Créez votre compte
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                Quelques informations suffisent pour commencer avec Wóolu.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5 sm:mt-8"
            >
              {/* NOM */}
              <Field>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-bold text-[#22252B]"
                >
                  Nom complet *
                </label>

                <input
                  id="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Ex. Ibrahima Ndiaye"
                  className={inputClass}
                />
              </Field>

              {/* ENTREPRISE */}
              <Field>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="businessName"
                    className="text-sm font-bold text-[#22252B]"
                  >
                    Entreprise ou activité
                  </label>

                  <span className="text-[11px] font-medium text-gray-400">
                    Facultatif
                  </span>
                </div>

                <input
                  id="businessName"
                  type="text"
                  autoComplete="organization"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  placeholder="Ex. Ibrahima Menuiserie"
                  className={inputClass}
                />
              </Field>

              {/* TELEPHONE + PAYS */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-[#22252B]"
                  >
                    Téléphone *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+221 77 000 00 00"
                    className={inputClass}
                  />
                </Field>

                <Field>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-bold text-[#22252B]"
                  >
                    Pays *
                  </label>

                  <select
                    id="country"
                    required
                    value={country}
                    onChange={(e) =>
                      setCountry(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option>Sénégal</option>
                    <option>Côte d&apos;Ivoire</option>
                    <option>Mali</option>
                    <option>Guinée</option>
                    <option>Burkina Faso</option>
                    <option>Autre</option>
                  </select>
                </Field>
              </div>

              {/* EMAIL */}
              <Field>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#22252B]"
                >
                  Adresse email *
                </label>

                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="vous@exemple.com"
                  className={inputClass}
                />
              </Field>

              {/* PASSWORD */}
              <Field>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#22252B]"
                >
                  Mot de passe *
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="8 caractères minimum"
                    className={`${inputClass} pr-14`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Utilisez au moins 8 caractères.
                </p>
              </Field>

              {/* ERREUR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200/50 transition hover:bg-[#3730A3] active:bg-[#312E81] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer mon compte gratuitement"
                )}
              </button>
            </form>

            {/* CONNEXION */}
            <p className="mt-7 text-center text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/connexion"
                className="font-extrabold text-[#4338CA] hover:underline"
              >
                Se connecter
              </Link>
            </p>

            <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-gray-400 lg:hidden">
              Wóolu fonctionne directement depuis votre navigateur.
              Aucune application à télécharger.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "min-h-[54px] w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-[#111318] outline-none transition placeholder:text-gray-400 focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100";

function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function SignupBenefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Check
          className="h-3.5 w-3.5 text-[#B7F34A]"
          strokeWidth={3}
        />
      </div>

      <span>{text}</span>
    </div>
  );
}