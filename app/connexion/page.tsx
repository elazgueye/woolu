"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import WooluLogo from "@/components/WooluLogo";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("email not confirmed")) {
        setError(
          "Votre adresse email n'est pas encore confirmée. Consultez votre boîte mail."
        );
      } else if (
        message.includes("invalid login") ||
        message.includes("invalid credentials")
      ) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError(error.message);
      }

      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

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
              <LockKeyhole className="h-7 w-7 text-[#4338CA]" />
            </div>

            <h2 className="text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
              Retrouvez tous
              <br />
              vos accords.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-100">
              Connectez-vous pour créer de nouveaux accords,
              suivre ceux en cours et retrouver l&apos;historique
              de votre activité.
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-[#B7F34A]" />
              Votre espace Wóolu, accessible à tout moment.
            </div>
          </div>

          <p className="relative text-sm text-indigo-200">
            Wóolu — Des accords plus clairs, simplement.
          </p>
        </section>

        {/* CONNEXION */}
        <section className="flex min-h-screen justify-center bg-[#F7F7FB] px-4 py-5 sm:items-center sm:px-8 sm:py-10 lg:px-12">
          <div className="w-full max-w-[440px]">
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

            {/* DESKTOP RETOUR */}
            <Link
              href="/"
              className="mb-8 hidden w-fit items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#4338CA] lg:flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            {/* FORM CARD */}
            <div className="mt-10 sm:mt-8 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
                Bon retour
              </p>

              <h1 className="mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-[#111318] sm:text-4xl">
                Connectez-vous
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                Accédez à votre espace Wóolu et retrouvez vos accords.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5 sm:mt-8"
              >
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#22252B]"
                  >
                    Adresse email
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="vous@exemple.com"
                    className="min-h-[54px] w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-[#111318] outline-none transition placeholder:text-gray-400 focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-[#22252B]"
                    >
                      Mot de passe
                    </label>

                    {/*
                      La récupération de mot de passe sera
                      branchée dans une étape dédiée.
                    */}
                    <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs font-bold text-[#4338CA] hover:underline sm:text-sm"
                    >
                    Mot de passe oublié ?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Votre mot de passe"
                      className="min-h-[54px] w-full rounded-xl border border-gray-300 bg-white px-4 pr-14 text-base text-[#111318] outline-none transition placeholder:text-gray-400 focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
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
                </div>

                {/* ERROR */}
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
                  className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 font-extrabold text-white shadow-lg shadow-indigo-200/50 transition hover:bg-[#3730A3] active:bg-[#312E81] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>

              {/* INSCRIPTION */}
              <div className="my-7 flex items-center gap-3 sm:my-8">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:text-xs">
                  Nouveau sur Wóolu ?
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Link
                href="/inscription"
                className="flex min-h-[54px] w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-center text-sm font-extrabold text-[#22252B] transition hover:border-[#4338CA] hover:text-[#4338CA]"
              >
                Créer un compte gratuitement
              </Link>

              {/* MOBILE TRUST */}
              <p className="mt-6 text-center text-xs leading-5 text-gray-400 lg:hidden">
                Accédez à vos accords depuis votre téléphone,
                sans application à télécharger.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}