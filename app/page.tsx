import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck2,
  MessageCircle,
  Send,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Wallet,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#111318]">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#B7F34A]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-40 h-96 w-96 rounded-full bg-[#4338CA]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:min-h-[calc(100vh-80px)] lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          {/* TEXTE */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-2 text-xs font-extrabold text-[#4338CA] sm:px-4 sm:text-sm">
              <ShieldCheck className="h-4 w-4" />
              Simple. Clair. Traçable.
            </div>

            <h1 className="mt-5 max-w-2xl text-[42px] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Vos accords.
              <br />
              <span className="text-[#4338CA]">
                Enfin clairs.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:mt-7 sm:text-xl sm:leading-8">
              Mettez par écrit ce que vous avez convenu avec votre
              client : travail, montant, acompte et délai. Puis
              partagez l&apos;accord simplement sur WhatsApp.
            </p>

            <div className="mt-7 grid gap-3 sm:mt-9 sm:flex">
              <Link
                href="/inscription"
                className="flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-6 font-extrabold text-white shadow-lg shadow-indigo-200/60 transition hover:bg-[#3730A3] sm:px-7"
              >
                Créer mon premier accord
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href="#fonctionnement"
                className="flex min-h-[54px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 font-bold text-gray-700 transition hover:bg-gray-50 sm:px-7"
              >
                Voir comment ça marche
              </a>
            </div>

            <div className="mt-6 grid gap-2.5 text-sm text-gray-500 sm:mt-7 sm:flex sm:flex-wrap sm:gap-x-6">
              <TrustPoint text="Gratuit pour commencer" />
              <TrustPoint text="Aucun téléchargement" />
              <TrustPoint text="Partage par WhatsApp" />
            </div>
          </div>

          {/* APERÇU ACCORD */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#B7F34A]/25 blur-3xl sm:-left-16 sm:-top-16 sm:h-52 sm:w-52" />
            <div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-[#4338CA]/15 blur-3xl sm:-right-16 sm:h-64 sm:w-64" />

            <div className="relative rounded-[24px] border border-gray-200 bg-white p-4 shadow-2xl shadow-indigo-100/70 sm:rounded-[28px] sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5 sm:pb-6">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-xs sm:tracking-[0.18em]">
                    Accord #WL-28491
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">
                    Fabrication d&apos;un meuble TV
                  </h2>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B7F34A]/25 sm:h-12 sm:w-12 sm:rounded-2xl">
                  <FileCheck2 className="h-5 w-5 text-[#4338CA] sm:h-6 sm:w-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 py-5 sm:gap-4 sm:py-6">
                <div className="min-w-0 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <p className="text-[11px] text-gray-500 sm:text-xs">
                    Montant total
                  </p>
                  <p className="mt-1 break-words text-sm font-extrabold sm:text-lg">
                    350 000 FCFA
                  </p>
                </div>

                <div className="min-w-0 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <p className="text-[11px] text-gray-500 sm:text-xs">
                    Acompte
                  </p>
                  <p className="mt-1 break-words text-sm font-extrabold sm:text-lg">
                    150 000 FCFA
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Entre
                  </p>
                  <p className="mt-0.5 break-words text-sm font-bold sm:text-base">
                    Ibrahima Menuiserie ↔ Pape
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Livraison prévue
                  </p>
                  <p className="mt-0.5 text-sm font-bold sm:text-base">
                    10 août 2026
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#4338CA] p-4 text-white sm:mt-7 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B7F34A]">
                    <Check
                      className="h-5 w-5 text-[#4338CA]"
                      strokeWidth={3}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-extrabold">
                      Accord confirmé
                    </p>
                    <p className="mt-0.5 text-xs text-indigo-200 sm:text-sm">
                      Le client a confirmé l&apos;accord
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section
        id="fonctionnement"
        className="scroll-mt-24 bg-[#F7F8FC] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Comment ça marche"
            title="Un accord clair en quelques minutes."
            description="Pas de document compliqué. Vous saisissez l'essentiel, vous partagez, et votre client peut consulter l'accord depuis son téléphone."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3 sm:mt-14 sm:gap-6">
            <StepCard
              number="1"
              icon={<FileCheck2 className="h-6 w-6" />}
              title="Créez l'accord"
              description="Indiquez le travail prévu, le montant, l'acompte éventuel et la date prévue."
            />

            <StepCard
              number="2"
              icon={<MessageCircle className="h-6 w-6" />}
              title="Envoyez sur WhatsApp"
              description="Partagez simplement le lien avec votre client. Il n'a pas besoin de télécharger une application."
            />

            <StepCard
              number="3"
              icon={<UserCheck className="h-6 w-6" />}
              title="Gardez une trace"
              description="Suivez la confirmation de l'accord et les paiements que vous déclarez au même endroit."
            />
          </div>
        </div>
      </section>

      {/* POUR LES PROFESSIONNELS */}
      <section
        id="professionnels"
        className="scroll-mt-24 py-16 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
              Pour les professionnels
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Travaillez simplement.
              <span className="text-[#4338CA]">
                {" "}Gardez les choses claires.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Artisan, prestataire, indépendant ou petite entreprise :
              Wóolu vous aide à garder une trace claire de ce qui a été
              convenu avec chaque client.
            </p>

            <div className="mt-7 space-y-4">
              <Feature
                title="Moins de malentendus"
                text="Le montant, le travail et le délai restent visibles dans le même accord."
              />

              <Feature
                title="Pensé pour le téléphone"
                text="Créez et consultez vos accords sans avoir besoin d'un ordinateur."
              />

              <Feature
                title="Le client n'a pas besoin de compte"
                text="Il ouvre simplement le lien que vous lui envoyez."
              />
            </div>
          </div>

          <div className="rounded-[28px] bg-[#4338CA] p-5 text-white shadow-xl shadow-indigo-200/50 sm:p-8 lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B7F34A] text-[#4338CA]">
              <Smartphone className="h-6 w-6" />
            </div>

            <h3 className="mt-6 text-2xl font-extrabold sm:text-3xl">
              Depuis votre téléphone.
            </h3>

            <p className="mt-3 leading-7 text-indigo-100">
              Vous êtes chez le client, dans votre atelier ou sur un
              chantier ? Vous pouvez créer l&apos;accord sur place et
              l&apos;envoyer immédiatement.
            </p>

            <div className="mt-7 space-y-3">
              <MiniFeature text="Créer un accord" />
              <MiniFeature text="Partager par WhatsApp" />
              <MiniFeature text="Déclarer un paiement reçu" />
              <MiniFeature text="Voir ce qu'il reste à payer" />
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANCE / POSITIONNEMENT */}
      <section className="bg-[#111318] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B7F34A] text-[#4338CA]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Wóolu aide à garder une trace claire.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Wóolu n&apos;est ni une banque, ni un service de paiement,
            ni une garantie contre les litiges. Les paiements affichés
            sont ceux déclarés dans l&apos;accord. L&apos;objectif est
            simple : mieux documenter ce qui a été convenu et suivi.
          </p>
        </div>
      </section>

      {/* TARIFS */}
      <section
        id="tarifs"
        className="scroll-mt-24 bg-[#F7F8FC] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Tarifs"
            title="Commencez sans complication."
            description="Découvrez Wóolu et créez vos premiers accords."
          />

          <div className="mx-auto mt-10 max-w-lg rounded-[28px] border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/40 sm:mt-12 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-[#4338CA]">
                  Pour commencer
                </p>
                <h3 className="mt-1 text-2xl font-extrabold">
                  Gratuit
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4338CA]">
                <Wallet className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <PricingFeature text="Créer vos accords" />
              <PricingFeature text="Partager avec vos clients" />
              <PricingFeature text="Suivre les paiements déclarés" />
              <PricingFeature text="Utiliser Wóolu depuis votre téléphone" />
            </div>

            <Link
              href="/inscription"
              className="mt-7 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#4338CA] px-5 font-extrabold text-white transition hover:bg-[#3730A3]"
            >
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[28px] bg-[#4338CA] px-5 py-10 text-center text-white sm:px-10 sm:py-14">
            <Send className="mx-auto h-8 w-8 text-[#B7F34A]" />

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Votre prochain accord peut être plus clair.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Créez-le, envoyez-le à votre client et gardez son suivi
              au même endroit.
            </p>

            <Link
              href="/inscription"
              className="mx-auto mt-7 flex min-h-[54px] w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#B7F34A] px-6 font-extrabold text-[#28226F] transition hover:brightness-95"
            >
              Créer mon compte Wóolu
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-4 text-xs text-indigo-200">
              Déjà inscrit ?{" "}
              <Link
                href="/connexion"
                className="font-bold text-white underline underline-offset-4"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4338CA]">
                <Check
                  className="h-4 w-4 text-[#B7F34A]"
                  strokeWidth={3}
                />
              </div>

              <span className="text-lg font-extrabold text-[#4338CA]">
                Wóolu
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Des accords plus clairs, simplement.
            </p>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 Wóolu
          </p>
        </div>
      </footer>
    </main>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50">
        <Check className="h-3 w-3 text-[#4338CA]" strokeWidth={3} />
      </span>
      {text}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4338CA] sm:text-sm">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <span className="absolute right-5 top-5 text-4xl font-black text-gray-100">
        {number}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4338CA]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Feature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B7F34A]/40">
        <Check className="h-3.5 w-3.5 text-[#4338CA]" strokeWidth={3} />
      </div>

      <div>
        <p className="font-extrabold">
          {title}
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function MiniFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#B7F34A]" />
      <span className="text-sm font-semibold">
        {text}
      </span>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
        <Check className="h-3.5 w-3.5 text-green-700" strokeWidth={3} />
      </div>

      <span className="text-sm font-medium text-gray-700">
        {text}
      </span>
    </div>
  );
}