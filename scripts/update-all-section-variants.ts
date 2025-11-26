import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function updateAllSectionVariants() {
    try {
        console.log('Updating all section variants...\n');

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

            console.log(`\nUpdating ${template.name} (${template.slug})`);
            console.log(`  Variant: ${variant}`);

            // Update all sections with variant
            const sectionsToUpdate = ['HeroSection', 'ServicesSection', 'AboutSection', 'ServiceAreasSection', 'ContactSection'];

            sectionsToUpdate.forEach(section => {
                if (fakeContent[section]) {
                    fakeContent[section].variant = variant;
                    console.log(`  ✓ ${section}`);
                }
            });

            // Update the database
            await sql`
        UPDATE templates
        SET fake_content = ${JSON.stringify(fakeContent)},
            updated_at = now()
        WHERE id = ${template.id}
      `;

            console.log(`  ✅ Updated successfully`);
        }

        console.log('\n✅ All templates updated with section variants!');

    } catch (error) {
        console.error('Error updating templates:', error);
        throw error;
    }
}

updateAllSectionVariants();
