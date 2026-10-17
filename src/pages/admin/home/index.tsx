import { useState } from "react";
import { useAuth } from "@/components/context/use-auth";
import { PageHeader } from "@/components/common/page-header";
import { AdminRecipes } from "@/components/features/admin/admin-recipes";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  return (
    <Section>
      <PageHeader title="All recipes" description="Browse recipes across every account.">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span>{user?.name}</span>
          <Button variant="tertiary" onClick={handleLogout}>Sign out</Button>
        </div>
      </PageHeader>

      {error && <p role="alert" className="mb-6 text-tomato">{error}</p>}

      <AdminRecipes />
    </Section>
  );
}
