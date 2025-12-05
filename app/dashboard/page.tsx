import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getBusinessForUser } from "@/actions/businesses";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const business = await getBusinessForUser();
  
  if (!business) {
    redirect("/onboarding");
  }

  const sections = [
    { name: "Basic Info", href: "/dashboard/sections/basic-info", status: "complete" },
    { name: "Services", href: "/dashboard/sections/services", status: "complete" },
    { name: "Service Areas", href: "/dashboard/sections/service-areas", status: "pending" },
    { name: "Contact", href: "/dashboard/sections/contact", status: "complete" },
    { name: "Images", href: "/dashboard/sections/images", status: "pending" },
    { name: "Domain", href: "/dashboard/sections/domain", status: "pending" },
    { name: "SEO", href: "/dashboard/sections/seo", status: "pending" },
    { name: "Template", href: "/dashboard/sections/template", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {business.business_name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your website content and settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="block p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {section.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {section.status === "complete" ? "✓ Complete" : "Needs attention"}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Preview Your Website
          </h2>
          <div className="flex gap-4">
            <Link
              href={`/preview/${business.slug}`}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Preview Site
            </Link>
            <Link
              href="/templates/select"
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Change Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

