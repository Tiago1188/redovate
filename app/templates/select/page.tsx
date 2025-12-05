import { getTemplates } from "@/actions/templates";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TemplateSelectPage() {
  const templates = await getTemplates();

  // If no templates in DB, show placeholder templates
  const displayTemplates = templates.length > 0 ? templates : [
    { id: "1", name: "Starter", slug: "starter", description: "Clean, professional template for service businesses", plan_level: "free" },
    { id: "2", name: "Professional", slug: "professional", description: "Premium template with advanced sections", plan_level: "starter" },
    { id: "3", name: "Enterprise", slug: "enterprise", description: "Full-featured template for established businesses", plan_level: "business" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Choose Your Template
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            Select a template to get started. You can customize it later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-700 relative">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                  Preview
                </div>
                {template.plan_level !== "free" && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded">
                    {template.plan_level}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
                  {template.description}
                </p>
                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/templates/preview/${template.slug}`}
                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white rounded-lg text-center font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/templates/edit/${template.slug}`}
                    className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-center font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Select
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

