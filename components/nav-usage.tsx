"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconSparkles } from "@tabler/icons-react"
import { useAIUsageStore } from "@/stores/use-ai-usage-store"

export function NavUsage() {
    const { usage, limit, planType } = useAIUsageStore()

    // If limit is huge (unlimited), don't show usage bar
    if (limit >= 999) return null

    const percentage = Math.min(100, (usage / limit) * 100)

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>AI Usage</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-2 py-1.5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                    <IconSparkles className="h-3 w-3" />
                                    <span className="font-medium">{usage} / {limit}</span>
                                </div>
                                <span className="uppercase">{planType}</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary transition-all duration-300 ease-in-out" 
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
