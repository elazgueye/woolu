"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";

export default function PasswordForm() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess("");
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

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("PASSWORD UPDATE ERROR:", error);

      setErrorMessage(
        "Le mot de passe n'a pas pu être modifié. Veuillez réessayer."
      );

      setSaving(false);
      return;
    }

    setPassword("");
    setConfirmation("");
    setSaving(false);

    setSuccess("Votre mot de passe a bien été modifié.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
          <KeyRound className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="font-extrabold">
            Modifier mon mot de passe
          </h2>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Choisissez un nouveau mot de passe pour votre compte Wóolu.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 md:grid-cols-2">
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
          onToggle={() =>
            setShowConfirmation(!showConfirmation)
          }
        />
      </div>

      <p className="mt-3 text-xs font-medium text-gray-400">
        8 caractères minimum.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-5 flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      <div className="mt-6 sm:flex sm:justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 text-sm font-extrabold text-white transition hover:bg-[#3730A3] active:bg-[#312E81] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Modification...
            </>
          ) : (
            <>
              <KeyRound className="h-5 w-5" />
              Modifier le mot de passe
            </>
          )}
        </button>
      </div>
    </form>
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
      <label className="text-sm font-bold text-gray-700">
        {label} *
      </label>

      <div className="mt-2 flex min-h-[52px] items-center rounded-xl border border-gray-300 bg-white transition focus-within:border-[#4338CA] focus-within:ring-4 focus-within:ring-indigo-100">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-gray-900 outline-none sm:text-sm"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={8}
        />

        <button
          type="button"
          onClick={onToggle}
          className="mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
          aria-label={
            visible
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
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