"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    CreditCard,
    ArrowRightLeft,
    Users,
    Package,
    Settings,
    X,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Overview",
        items: [
            { name: "Home", href: "/dashboard", icon: Home },
            { name: "Balances", href: "/dashboard/balances", icon: CreditCard },
            { name: "Transactions", href: "/dashboard/transactions", icon: ArrowRightLeft },
        ],
    },
    {
        title: "Management",
        items: [
            { name: "Customers", href: "/dashboard/customers", icon: Users },
            { name: "Product Catalog", href: "/dashboard/products", icon: Package },
            { name: "Templates", href: "/templates/select", icon: Package },
        ],
    },
    {
        title: "System",
        items: [
            { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-premium">
                        R
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-foreground">Redovate</span>
                </div>

                <nav className="flex flex-col gap-6">
                    {sidebarItems.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                                {group.title}
                            </h4>
                            <div className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-sidebar-active text-primary shadow-sm"
                                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-surface-muted border border-sidebar-border">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground">System Operational</span>
                </div>
            </div>
        </div>
    );
}
