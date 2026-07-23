"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import WooluLogo from "@/components/WooluLogo";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (password !== confirmation) {
      setErrorMessage(
        "Les deux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      console.error("PASSWORD RESET ERROR:", error);

      setErrorMessage(
        "Le lien est invalide ou a expiré. Demandez un nouveau lien."
      );
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/connexion");
      router.refresh();
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-[#F7F7FB] px-4 py-6 text-[#111318] sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="flex w-fit items-center">
        <WooluLogo className="h-11 w-[130px]" />
        </Link>

        <section className="mt-12 rounded-[24px] border border-gray-200 bg-white p-5 shadow-xl shadow-indigo-100/30 sm:p-8">
          {!success ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-[#4338CA]">
                <LockKeyhole className="h-7 w-7" />
              </div>

              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA]">
                Sécurité
              </p>

              <h1 className="mt-2 text-[28px] font-extrabold leading-tight">
                Nouveau mot de passe
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Choisissez un nouveau mot de passe pour votre compte
                Wóolu.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <PasswordInput
                  label="Nouveau mot de passe"
                  value={password}
                  onChange={setPassword}
                  visible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <PasswordInput
                label="Confirmer le mot de passe"
                value={confirmation}
                onChange={setConfirmation}
                visible={showConfirmation}
                onToggle={() => setShowConfirmation(!showConfirmation)}
                />

                <p className="text-xs text-gray-400">
                  8 caractères minimum.
                </p>

                {errorMessage && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 font-extrabold text-white transition hover:bg-[#3730A3] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    "Modifier mon mot de passe"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-5 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

              <h1 className="mt-5 text-2xl font-extrabold">
                Mot de passe modifié
              </h1>

              <p className="mt-3 text-sm text-gray-600">
                Vous allez être redirigé vers la connexion.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="8 caractères minimum"
          className="min-h-[54px] w-full rounded-xl border border-gray-300 bg-white px-4 pr-14 text-base outline-none transition focus:border-[#4338CA] focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-500"
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}