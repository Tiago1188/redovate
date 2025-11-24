'use server';

import { auth } from "@clerk/nextjs/server";
import pool from "@/lib/db";
import { getPlanLimits, PlanType } from "@/lib/plan-limits";

export interface DashboardSection {
    name: string;
    label: string;
    description: string;
    status: string;
    completion_percent: number;
    completed_items?: number;
    total_items?: number;
}

export async function getDashboardSections(): Promise<DashboardSection[]> {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    try {
        // Get the user's business ID, plan type, and services
        // Fetch plan_type from both tables to determine the effective plan
        const businessRes = await pool.query(
            `SELECT b.id, b.services, b.keywords, u.plan_type as user_plan_type, b.plan_type as business_plan_type
             FROM businesses b
             JOIN users u ON b.user_id = u.id
             WHERE u.clerk_id = $1
             LIMIT 1`,
            [userId]
        );

        if (businessRes.rows.length === 0) {
            return [];
        }

        const business = businessRes.rows[0];
        const businessId = business.id;

        // Determine effective plan type (logic mirrored from getUserPlanType)
        const userPlan = business.user_plan_type;
        const businessPlan = business.business_plan_type;

        const planWeight = (p: string | null) => {
            if (p === 'business') return 3;
            if (p === 'starter') return 2;
            if (p === 'free') return 1;
            return 0;
        };

        const userWeight = planWeight(userPlan);
        const businessWeight = planWeight(businessPlan);

        const planType = (businessWeight > userWeight ? businessPlan : (userPlan || 'free')) as PlanType;

        const services = Array.isArray(business.services) ? business.services : [];

        // Get the active template for this business
        const templateRes = await pool.query(
            `SELECT template_id 
             FROM business_templates 
             WHERE business_id = $1 AND is_active = true
             LIMIT 1`,
            [businessId]
        );

        if (templateRes.rows.length === 0) {
            return [];
        }

        const templateId = templateRes.rows[0].template_id;

        // Join template_sections with business_section_status
        // Filter by current business's active template
        const result = await pool.query(
            `SELECT 
                ts.name,
                ts.label,
                ts.description,
                COALESCE(bss.status, 'missing') as status,
                COALESCE(bss.completion_percent, 0) as completion_percent
             FROM template_sections ts
             LEFT JOIN business_section_status bss 
                ON ts.id = bss.section_id AND bss.business_id = $1
             WHERE ts.template_id = $2
             ORDER BY ts.sort_order ASC`,
            [businessId, templateId]
        );

        const sections: DashboardSection[] = result.rows.map((row) => {
            // Logic for Services card completion
            if (row.name === 'ServicesSection') {
                const serviceCount = services.length;
                const minRequired = planType === 'free' ? 3 : 5;
                const limits = getPlanLimits(planType);
                const maxAllowed = limits.maxServices;

                // Use max limit as total_items if not unlimited (999), otherwise fallback to minRequired
                const displayTotal = maxAllowed >= 999 ? minRequired : maxAllowed;

                const isCompleted = serviceCount >= minRequired;

                // Calculate percent based on minRequired for "Completion" status, 
                // but the UI might use completed_items / total_items for the text.
                // We want the progress bar to show 100% if they met the requirement, 
                // even if they haven't hit the max limit.
                // However, if we pass total_items as maxAllowed, the UI (SectionCard) probably renders a progress bar of completed/total.
                // If we want "13/15", we must send total_items=15.
                // If we want the bar to be full at 13/15 if 5 was the requirement... that's tricky without changing the UI component.
                // Assuming the user prefers seeing the Limit usage over the "Min Requirement" usage.

                // If we set total_items to 15, 13/15 is 86%.
                // If we want the status to still be "completed" (green), we rely on the `status` field.

                // Let's calculate percent for the progress bar.
                // If the status is "completed", usually users expect 100% bar. 
                // But "13/15" implies a bar that isn't full.
                // I will set the percent to match the usage of the limit if we show the limit.
                let percent = 0;
                if (maxAllowed < 999) {
                    percent = Math.min(100, Math.round((serviceCount / maxAllowed) * 100));
                } else {
                    percent = Math.min(100, Math.round((serviceCount / minRequired) * 100));
                }

                return {
                    name: row.name,
                    label: 'Services', // Rename title
                    description: row.description || '',
                    status: isCompleted ? 'completed' : (serviceCount > 0 ? 'pending' : 'missing'),
                    completion_percent: percent,
                    completed_items: serviceCount,
                    total_items: displayTotal,
                };
            }

            return {
                name: row.name,
                label: row.label || row.name,
                description: row.description || '',
                status: row.status,
                completion_percent: row.completion_percent || 0,
                completed_items: undefined,
                total_items: undefined,
            };
        });

        // Inject Keywords Section
        const keywords = Array.isArray(business.keywords) ? business.keywords : [];
        const keywordCount = keywords.length;
        const limits = getPlanLimits(planType);
        const maxKeywords = limits.maxKeywords;

        // Determine status and progress for Keywords
        // Free plan: 5 keywords. Starter: 15. Business: Unlimited.
        // We'll consider it "completed" if they have at least 1 keyword, 
        // or maybe if they used some percentage? 
        // For Services, it was minRequired (3 or 5).
        // For Keywords, let's say 3 is a good minimum to be "green".
        const minKeywordsRequired = 3;
        const isKeywordsCompleted = keywordCount >= minKeywordsRequired;

        const keywordsDisplayTotal = maxKeywords >= 999 ? minKeywordsRequired : maxKeywords;

        let keywordsPercent = 0;
        if (maxKeywords < 999) {
            keywordsPercent = Math.min(100, Math.round((keywordCount / maxKeywords) * 100));
        } else {
            keywordsPercent = Math.min(100, Math.round((keywordCount / minKeywordsRequired) * 100));
        }

        const keywordsSection: DashboardSection = {
            name: 'KeywordsSection',
            label: 'Keywords',
            description: 'Manage your SEO keywords',
            status: isKeywordsCompleted ? 'completed' : (keywordCount > 0 ? 'pending' : 'missing'),
            completion_percent: keywordsPercent,
            completed_items: keywordCount,
            total_items: keywordsDisplayTotal,
        };

        // Insert Keywords section. 
        // If ServicesSection exists, put it after that. Otherwise put it at the start.
        const servicesIndex = sections.findIndex(s => s.name === 'ServicesSection');
        if (servicesIndex !== -1) {
            sections.splice(servicesIndex + 1, 0, keywordsSection);
        } else {
            sections.unshift(keywordsSection);
        }

        return sections;
    } catch (error) {
        console.error('Error fetching dashboard sections:', error);
        return [];
    }
}
