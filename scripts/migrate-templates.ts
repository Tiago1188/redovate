import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { TEMPLATE_COMPONENT_REGISTRY } from '../lib/templates/templates-registry';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

// Helper to generate supported_props from registry
function generateSupportedProps(componentTypes: string[]) {
    const supportedProps: Record<string, any> = {};

    componentTypes.forEach(type => {
        const definition = TEMPLATE_COMPONENT_REGISTRY[type];
        if (definition) {
            supportedProps[type] = definition.allowedProps;
        }
    });

    return supportedProps;
}

// Helper to update component structure
function updateComponentStructure(oldComponents: any): any[] {
    if (!oldComponents || !Array.isArray(oldComponents)) {
        return [];
    }

    return oldComponents.map((comp: any, index: number) => ({
        type: comp.type || comp.name || comp,
        required: comp.required ?? (index < 3), // First 3 components typically required
    }));
}

// Helper to migrate fake content to new structure
function migrateFakeContent(oldContent: any, componentTypes: string[]): any {
    const newContent: Record<string, any> = {};

    componentTypes.forEach(type => {
        if (oldContent[type]) {
            // Content already exists, keep it
            newContent[type] = oldContent[type];
        } else {
            // Generate minimal fake content based on component type
            newContent[type] = generateDefaultFakeContent(type);
        }
    });

    return newContent;
}

function generateDefaultFakeContent(componentType: string): any {
    const defaults: Record<string, any> = {
        NavigationSection: {
            business_name: "Sample Business",
            nav_links: [
                { id: "hero", label: "Home" },
                { id: "services", label: "Services" },
                { id: "about", label: "About" },
                { id: "contact", label: "Contact" },
            ],
            cta_label: "Get Quote",
        },
        HeroSection: {
            headline: "Professional",
            highlight: "Services",
            tagline: "Quality work you can trust",
            subtagline: "Serving the community with excellence",
            hero_image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
            cta_primary: "Book Now",
            cta_secondary: "Learn More",
            show_phone_cta: true,
            variant: "cleaner",
        },
        ServicesSection: {
            heading: "Our Services",
            subheading: "Professional solutions for all your needs",
            services: [
                { icon: "home", title: "Service 1", description: "Professional service description" },
                { icon: "building", title: "Service 2", description: "Quality service description" },
                { icon: "zap", title: "Service 3", description: "Expert service description" },
            ],
        },
        AboutSection: {
            heading: "About Us",
            body: "We are a professional service company dedicated to excellence.",
            body_2: "With years of experience, we deliver quality results.",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070&auto=format&fit=crop",
            features: [
                { icon: "shield", title: "Licensed & Insured", description: "Fully certified" },
                { icon: "clock", title: "24/7 Available", description: "Always here" },
            ],
        },
        ServiceAreasSection: {
            heading: "Service Areas",
            subheading: "We serve the local area",
            areas: ["Area 1", "Area 2", "Area 3"],
        },
        TestimonialsSection: {
            heading: "What Our Clients Say",
            testimonials: [
                { name: "John Smith", role: "Client", content: "Excellent service!", rating: 5 },
            ],
        },
        ContactSection: {
            heading: "Get In Touch",
            subheading: "We'd love to hear from you",
        },
        FooterSection: {
            business_name: "Sample Business",
            blurb: "Professional services. Reliable and committed to excellence.",
            phone: "1300 123 456",
            email: "info@example.com",
            social: {
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
            },
        },
    };

    return defaults[componentType] || {};
}

async function migrateTemplates(dryRun: boolean = true) {
    try {
        console.log(dryRun ? '=== DRY RUN MODE ===' : '=== LIVE MIGRATION ===');
        console.log('Fetching templates...\n');

        const templates = await sql`
      SELECT id, name, slug, plan_level, components, supported_props, fake_content
      FROM templates
      WHERE status = 'active'
    `;

        if (templates.length === 0) {
            console.log('No templates found to migrate.');
            return;
        }

        console.log(`Found ${templates.length} template(s) to migrate.\n`);

        for (const template of templates) {
            console.log(`\n📋 Processing: ${template.name} (${template.slug})`);
            console.log(`   Plan Level: ${template.plan_level}`);

            // Update component structure
            const oldComponents = template.components || [];
            const newComponents = updateComponentStructure(oldComponents);
            const componentTypes = newComponents.map((c: any) => c.type);

            console.log(`   Components: ${componentTypes.join(', ')}`);

            // Generate supported_props from registry
            const newSupportedProps = generateSupportedProps(componentTypes);

            // Migrate fake content
            const newFakeContent = migrateFakeContent(template.fake_content || {}, componentTypes);

            if (dryRun) {
                console.log('   ✓ Would update components structure');
                console.log('   ✓ Would update supported_props from registry');
                console.log('   ✓ Would migrate fake_content');
            } else {
                // Perform actual update
                await sql`
          UPDATE templates
          SET 
            components = ${JSON.stringify(newComponents)},
            supported_props = ${JSON.stringify(newSupportedProps)},
            fake_content = ${JSON.stringify(newFakeContent)},
            updated_at = now()
          WHERE id = ${template.id}
        `;
                console.log('   ✅ Updated successfully');
            }
        }

        console.log('\n' + (dryRun ? '=== DRY RUN COMPLETE ===' : '=== MIGRATION COMPLETE ==='));
        if (dryRun) {
            console.log('Run with --live flag to perform actual migration.');
        }

    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
}

// Check command line args
const isLive = process.argv.includes('--live');
migrateTemplates(!isLive);
