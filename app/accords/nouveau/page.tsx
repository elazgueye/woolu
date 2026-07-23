import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppSidebar from "@/components/layout/AppSidebar";
import NewAgreementForm from "./NewAgreementForm";

export default async function NewAgreementPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "Utilisateur";

  const businessName =
    profile?.business_name || "Compte personnel";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#15171C]">
      <AppSidebar
        fullName={fullName}
        businessName={businessName}
      />

      <main className="min-h-screen lg:ml-[260px]">
        <NewAgreementForm />
      </main>
    </div>
  );
}