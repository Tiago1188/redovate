import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function checkTemplates() {
    try {
        console.log('Checking templates in database...\n');

        const templates = await sql`
      SELECT id, name, slug, plan_level, components, supported_props, fake_content
      FROM templates
      WHERE status = 'active'
      ORDER BY plan_level, name
    `;

        if (templates.length === 0) {
            console.log('No templates found in database.');
            console.log('You may need to seed template data first.');
            return;
        }

        console.log(`Found ${templates.length} template(s):\n`);

        templates.forEach((template, index) => {
            console.log(`${index + 1}. ${template.name} (${template.slug})`);
            console.log(`   Plan Level: ${template.plan_level}`);
            console.log(`   Components: ${JSON.stringify(template.components, null, 2)}`);
            console.log(`   Supported Props Keys: ${Object.keys(template.supported_props || {}).join(', ')}`);
            console.log(`   Fake Content Keys: ${Object.keys(template.fake_content || {}).join(', ')}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error checking templates:', error);
    }
}

checkTemplates();
