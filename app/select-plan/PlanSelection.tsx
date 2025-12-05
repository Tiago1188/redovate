"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PLANS } from "@/constants/plan-limits";
import { updateUserPlan } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlanType } from "@/types";
import { cn } from "@/lib/utils";

export function PlanSelection() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = (planType: PlanType) => {
    if (planType === "business") return; // Coming soon
    setSelectedPlan(planType);
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;
    
    try {
      setLoading(true);
      const result = await updateUserPlan(selectedPlan);
      
      if (result.success) {
        toast.success("Plan selected successfully!");
        
        // Use window.location.href to force a full reload and navigation
        // This is more reliable for clearing state/cache than router.push in this specific case
        window.location.href = "/onboarding";
      } else {
        toast.error(result.error || "Failed to select plan");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.type;
          const isBusiness = plan.type === "business";
          
          return (
            <Card 
              key={plan.type}
              className={cn(
                "relative flex flex-col cursor-pointer transition-all duration-200",
                isSelected 
                  ? "border-primary ring-2 ring-primary ring-offset-2 shadow-xl scale-[1.02]" 
                  : "border-border hover:border-primary/50 hover:shadow-md",
                isBusiness && "opacity-80 cursor-not-allowed hover:border-border hover:shadow-none"
              )}
              onClick={() => handleSelectPlan(plan.type)}
            >
              {/* Selection Check Circle */}
              {!isBusiness && (
                <div className={cn(
                  "absolute top-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
              )}

              {plan.type === "starter" && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                 {isBusiness ? (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                 ) : (
                    <div className={cn(
                      "w-full text-center py-2 rounded-md text-sm font-medium transition-colors",
                      isSelected 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {isSelected ? "Selected" : "Select Plan"}
                    </div>
                 )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          className="px-12 text-lg"
          disabled={!selectedPlan || loading}
          onClick={handleContinue}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  );
}
