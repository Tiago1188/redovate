import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function updateTemplateVariants() {
    try {
        console.log('Updating template variants...\n');

        // Get all templates
        const templates = await sql`
      SELECT id, name, slug, fake_content
      FROM templates
      WHERE status = 'active'
    `;

        for (const template of templates) {
            const fakeContent = template.fake_content || {};

            // Determine variant based on template slug
            let variant = 'cleaner'; // default

            if (template.slug.includes('voltage')) {
                variant = 'voltage';
            } else if (template.slug.includes('cleaner')) {
                variant = 'cleaner';
            }

            // Update HeroSection fake_content with variant
            if (fakeContent.HeroSection) {
                fakeContent.HeroSection.variant = variant;

                console.log(`Updating ${template.name} (${template.slug})`);
                console.log(`  Setting HeroSection variant to: ${variant}`);

                // Update the database
                await sql`
          UPDATE templates
          SET fake_content = ${JSON.stringify(fakeContent)},
              updated_at = now()
          WHERE id = ${template.id}
        `;

                console.log(`  ✅ Updated\n`);
            }
        }

        console.log('All templates updated successfully!');

    } catch (error) {
        console.error('Error updating templates:', error);
        throw error;
    }
}

updateTemplateVariants();
