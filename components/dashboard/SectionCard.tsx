import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  status: string;
  completion: number;
  totalItems?: number;
  completedItems?: number;
  href: string;
}

const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    default:
      return "outline";
  }
};

export function SectionCard({
  title,
  icon,
  status,
  completion,
  totalItems,
  completedItems,
  href,
}: SectionCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="transition-all hover:shadow-md hover:border-primary/50 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start gap-3">
            {icon && (
              <div className="mt-1 text-muted-foreground">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold">
                {title}
              </CardTitle>
              <div className="mt-2">
                <Badge variant={getStatusVariant(status)} className="text-xs">
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completion}% complete
              </span>
              {totalItems !== undefined && completedItems !== undefined && (
                <span className="text-muted-foreground">
                  {completedItems} / {totalItems}
                </span>
              )}
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all rounded-full",
                  completion === 100
                    ? "bg-primary"
                    : completion > 0
                    ? "bg-primary/80"
                    : "bg-muted"
                )}
                style={{ width: `${Math.min(100, Math.max(0, completion))}%` }}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <div className="flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
            <span>Edit</span>
            <IconArrowRight className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

