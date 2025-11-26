import { neon } from '@neondatabase/serverless';
import RegistryRenderer from "@/components/template-renderer/RegistryRenderer";

const sql = neon(process.env.DATABASE_URL!);

export default async function TestMigratedTemplatesPage() {
    // Fetch a template from the database
    const templates = await sql`
    SELECT id, name, slug, components, fake_content
    FROM templates
    WHERE status = 'active'
    ORDER BY plan_level, name
    LIMIT 1
  `;

    if (templates.length === 0) {
        return <div className="p-8">No templates found in database.</div>;
    }

    const template = templates[0];
    const components = template.components || [];

    // Transform to sections format for RegistryRenderer
    const sections = components.map((comp: any) => ({
        type: comp.type,
        data: template.fake_content?.[comp.type] || {},
    }));

    return (
        <div>
            <div className="bg-gray-100 p-4 border-b">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">Template Migration Test</h1>
                    <p className="text-sm text-gray-600">
                        Template: {template.name} ({template.slug})
                    </p>
                    <p className="text-xs text-gray-500">
                        Components: {components.map((c: any) => c.type).join(', ')}
                    </p>
                </div>
            </div>
            <RegistryRenderer sections={sections} />
        </div>
    );
}
