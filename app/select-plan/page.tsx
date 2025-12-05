import { redirect } from "next/navigation";
import { syncUser } from "@/actions/user";
import { PlanSelection } from "./PlanSelection";

export const metadata = {
  title: "Select a Plan - Redovate",
  description: "Choose the plan that fits your business needs",
};

export default async function SelectPlanPage() {
  const user = await syncUser();
  
  if (user && user.plan_type) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-muted/40 py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your business needs. You can upgrade or downgrade at any time.
          </p>
        </div>
        <PlanSelection />
      </div>
    </div>
  );
}
