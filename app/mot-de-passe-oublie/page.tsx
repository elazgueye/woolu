"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import WooluLogo from "@/components/WooluLogo";
import {
  ArrowLeft,
  Loader2,
  Mail,
  MailCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
      }
    );

    setLoading(false);

    if (error) {
      console.error("RESET PASSWORD ERROR:", error);

      setErrorMessage(
        "Impossible d'envoyer le lien pour le moment. Veuillez réessayer."
      );
      return;
    }

    setSuccess(true);
  }

  return (
    <main className="min-h-screen bg-[#F7F7FB] px-4 py-6 text-[#111318] sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <WooluLogo className="h-11 w-[130px]" />
            </Link>

          <Link
            href="/connexion"
            aria-label="Retour à la connexion"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <section className="mt-12 rounded-[24px] border border-gray-200 bg-white p-5 shadow-xl shadow-indigo-100/30 sm:p-8">
          {!success ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4338CA]">
                <Mail className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA]">
                Récupération
              </p>

              <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-3xl">
                Mot de passe oublié ?
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Entrez l&apos;adresse email associée à votre compte.
                Nous vous enverrons un lien pour choisir un nouveau
                mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="mt-7">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@exemple.com"
                  className="min-h-[54px] w-full rounded-xl border border-gray-300 bg-white px-4 text-base outline-none transition placeholder:text-gray-400 focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100"
                />

                {errorMessage && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 font-extrabold text-white transition hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Recevoir le lien"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link
                  href="/connexion"
                  className="font-bold text-[#4338CA]"
                >
                  Se connecter
                </Link>
              </p>
            </>
          ) : (
            <div className="py-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <MailCheck className="h-8 w-8" />
              </div>

              <h1 className="mt-6 text-2xl font-extrabold">
                Consultez votre boîte mail
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Si un compte correspond à cette adresse, vous recevrez
                un lien permettant de modifier votre mot de passe.
              </p>

              <p className="mt-2 break-all text-sm font-bold">
                {email.trim().toLowerCase()}
              </p>

              <Link
                href="/connexion"
                className="mt-7 flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#4338CA] px-5 font-extrabold text-white"
              >
                Retour à la connexion
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}