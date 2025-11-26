# Template Creation Guide

This guide provides step-by-step instructions for creating new templates in the Redovate system. Follow these steps to ensure consistency with the unified component architecture.

## Architecture Overview

### Component Structure
```
components/
├── templates/           # New unified structure
│   ├── free/           # Free plan components
│   ├── starter/        # Starter plan components
│   ├── business/       # Business plan components (future)
│   └── component-map.ts # Component registry mapping
└── template-renderer/
    └── RenderTemplate.tsx # Main renderer
```

### Key Files
- **Component Registry**: `lib/templates/templates-registry.ts` - Defines all components and their props
- **Component Map**: `components/templates/component-map.ts` - Maps component names to implementations
- **Database Schema**: `schema.sql` - Templates table structure

## Step-by-Step Template Creation

### Step 1: Define Component in Registry

**File**: `lib/templates/templates-registry.ts`

Add your component definition to `TEMPLATE_COMPONENT_REGISTRY`:

```typescript
export const TEMPLATE_COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  // ... existing components ...
  
  YourNewComponent: {
    label: "Your Component Label",
    allowedPlans: ["free", "starter", "business"], // Which plans can use it
    allowedProps: {
      // Define all props the component accepts
      heading: { type: "string", required: true },
      subheading: { type: "string", required: false },
      items: { type: "array", required: false },
      image: { type: "string", required: false },
      variant: { type: "string", required: false }, // For different styles
    },
    requiredProps: ["heading"], // Props that must be provided
  },
};
```

**Prop Types:**
- `string` - Text content
- `number` - Numeric values
- `boolean` - True/false flags
- `array` - Lists of items
- `object` - Complex nested data

### Step 2: Create Component Implementation

**File**: `components/templates/{plan}/YourNewComponent/index.tsx`

Create the component file in the appropriate plan directory:

```typescript
"use client"; // If using hooks or interactivity

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// ... other imports

// Define the data interface matching your registry props
export interface YourNewComponentData {
  heading?: string;
  subheading?: string;
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  image?: string;
  variant?: "default" | "compact" | "featured";
}

export function YourNewComponent({ data }: { data?: YourNewComponentData }) {
  // Provide sensible defaults
  const heading = data?.heading ?? "Default Heading";
  const subheading = data?.subheading;
  const items = data?.items ?? [];
  const variant = data?.variant ?? "default";

  // Implement variant logic if needed
  const variantStyles = {
    default: "py-24 bg-background",
    compact: "py-12 bg-secondary/50",
    featured: "py-32 bg-gradient-to-b from-primary/10 to-background",
  };

  return (
    <section 
      id="your-component" 
      className={variantStyles[variant]}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Best Practices:**
- Always provide default values for optional props
- Use semantic HTML (`<section>`, `<article>`, etc.)
- Include `id` attribute for navigation
- Support theme variables (primary, background, etc.)
- Make responsive with Tailwind classes
- Use UI components from `@/components/ui/`

### Step 3: Register in Component Map

**File**: `components/templates/component-map.ts`

Import and add your component to the map:

```typescript
import { YourNewComponent as StarterYourComponent } from "@/components/templates/starter/YourNewComponent";

export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // ... existing components ...
  YourNewComponent: StarterYourComponent,
};
```

**For Plan-Specific Components:**
```typescript
// Free plan version
import { YourNewComponent as FreeYourComponent } from "@/components/templates/free/YourNewComponent";

// Starter plan version (more features)
import { YourNewComponent as StarterYourComponent } from "@/components/templates/starter/YourNewComponent";

export const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  // Use the most feature-rich version by default
  YourNewComponent: StarterYourComponent,
  
  // Or conditionally based on plan (if needed in the future)
};
```

### Step 4: Create Database Template Entry

**Option A: Via Migration Script**

Create `scripts/add-template.ts`:

```typescript
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function addTemplate() {
  const components = [
    { type: "NavigationSection", required: true },
    { type: "HeroSection", required: true },
    { type: "YourNewComponent", required: false }, // Add your component
    { type: "ContactSection", required: true },
    { type: "FooterSection", required: true },
  ];

  const supportedProps = {
    NavigationSection: { /* ... */ },
    HeroSection: { /* ... */ },
    YourNewComponent: {
      heading: "string",
      subheading: "string",
      items: "array",
      variant: "string",
    },
    // ... other components
  };

  const fakeContent = {
    NavigationSection: { /* ... */ },
    HeroSection: { /* ... */ },
    YourNewComponent: {
      heading: "Sample Heading",
      subheading: "Sample subheading text",
      items: [
        { title: "Item 1", description: "Description 1" },
        { title: "Item 2", description: "Description 2" },
      ],
      variant: "default",
    },
    // ... other components
  };

  await sql`
    INSERT INTO templates (
      name, 
      slug, 
      description, 
      plan_level, 
      components, 
      supported_props, 
      fake_content
    )
    VALUES (
      'Your Template Name',
      'your-template-slug',
      'Description of your template',
      'starter',
      ${JSON.stringify(components)},
      ${JSON.stringify(supportedProps)},
      ${JSON.stringify(fakeContent)}
    )
  `;

  console.log('Template added successfully!');
}

addTemplate();
```

Run: `npx tsx scripts/add-template.ts`

**Option B: Via SQL**

```sql
INSERT INTO templates (
  name, 
  slug, 
  description, 
  plan_level, 
  components, 
  supported_props, 
  fake_content,
  status
)
VALUES (
  'Your Template Name',
  'your-template-slug',
  'Description of your template',
  'starter',
  '[
    {"type": "NavigationSection", "required": true},
    {"type": "HeroSection", "required": true},
    {"type": "YourNewComponent", "required": false},
    {"type": "ContactSection", "required": true},
    {"type": "FooterSection", "required": true}
  ]'::jsonb,
  '{
    "YourNewComponent": {
      "heading": "string",
      "subheading": "string",
      "items": "array"
    }
  }'::jsonb,
  '{
    "YourNewComponent": {
      "heading": "Sample Heading",
      "subheading": "Sample subheading",
      "items": [
        {"title": "Item 1", "description": "Description 1"}
      ]
    }
  }'::jsonb,
  'active'
);
```

### Step 5: Test Your Component

**Create Test Page**: `app/test-your-component/page.tsx`

```typescript
import RegistryRenderer from "@/components/template-renderer/RegistryRenderer";

export default function TestYourComponentPage() {
  const sections = [
    {
      type: "YourNewComponent",
      data: {
        heading: "Test Heading",
        subheading: "Test subheading",
        items: [
          { title: "Test 1", description: "Description 1" },
          { title: "Test 2", description: "Description 2" },
        ],
        variant: "default",
      },
    },
  ];

  return <RegistryRenderer sections={sections} />;
}
```

**Test Checklist:**
- [ ] Component renders without errors
- [ ] All props work correctly
- [ ] Defaults are sensible
- [ ] Responsive on mobile/tablet/desktop
- [ ] Theme variables apply correctly
- [ ] Variant styles work (if applicable)

### Step 6: Verify in Template Preview

1. Navigate to `/dashboard/templates`
2. Select your new template
3. Click "Preview"
4. Test customization features:
   - Theme changes
   - Font changes
   - Color customization
5. Verify all sections render correctly

## Component Variants

To support multiple visual styles of the same component:

```typescript
export interface YourComponentData {
  // ... other props
  variant?: "style1" | "style2" | "style3";
}

export function YourComponent({ data }: { data?: YourComponentData }) {
  const variant = data?.variant ?? "style1";

  // Different layouts based on variant
  if (variant === "style1") {
    return <Style1Layout data={data} />;
  }
  
  if (variant === "style2") {
    return <Style2Layout data={data} />;
  }

  return <Style3Layout data={data} />;
}
```

## Plan-Specific Features

To restrict features by plan:

```typescript
export function YourComponent({ 
  data, 
  plan 
}: { 
  data?: YourComponentData;
  plan?: "free" | "starter" | "business";
}) {
  const isPremium = plan === "starter" || plan === "business";

  return (
    <section>
      {/* Always available */}
      <BasicFeature data={data} />
      
      {/* Only for paid plans */}
      {isPremium && <PremiumFeature data={data} />}
    </section>
  );
}
```

## Common Patterns

### Icon Mapping
```typescript
import { Home, Building, Zap, Shield } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  building: Building,
  zap: Zap,
  shield: Shield,
};

const Icon = ICONS[item.icon] || Home;
<Icon className="w-6 h-6" />
```

### Image Handling
```typescript
import Image from "next/image";

{data?.image && (
  <div className="relative aspect-video">
    <Image
      src={data.image}
      alt={data.heading || "Image"}
      fill
      className="object-cover rounded-lg"
    />
  </div>
)}
```

### Show More/Less Toggle
```typescript
const [showAll, setShowAll] = useState(false);
const LIMIT = 6;
const displayed = showAll ? items : items.slice(0, LIMIT);
const hasMore = items.length > LIMIT;

{hasMore && (
  <Button onClick={() => setShowAll(!showAll)}>
    {showAll ? "Show Less" : "Show All"}
  </Button>
)}
```

## Troubleshooting

### Component Not Rendering
1. Check `COMPONENT_MAP` includes your component
2. Verify component name matches exactly (case-sensitive)
3. Check browser console for errors
4. Ensure component is exported correctly

### Props Not Working
1. Verify props are defined in registry
2. Check data interface matches registry
3. Ensure defaults are provided
4. Check for typos in prop names

### Styling Issues
1. Verify Tailwind classes are correct
2. Check theme variables are applied
3. Test in different themes
4. Verify responsive classes

## Checklist for New Components

- [ ] Component defined in `templates-registry.ts`
- [ ] Component implemented in `components/templates/{plan}/`
- [ ] Component added to `component-map.ts`
- [ ] Database template entry created
- [ ] Test page created and verified
- [ ] Responsive design tested
- [ ] Theme compatibility verified
- [ ] Default values provided
- [ ] Documentation updated (if needed)
- [ ] Build passes (`npm run build`)

## Example: Complete Component

See `components/templates/starter/ServicesSection/index.tsx` for a complete, production-ready example that demonstrates:
- Proper TypeScript interfaces
- Default values
- Responsive design
- Icon mapping
- Show more/less functionality
- Theme compatibility

## Questions?

Refer to:
- `lib/templates/templates-registry.ts` - Component definitions
- `components/templates/` - Example implementations
- `schema.sql` - Database structure
- This guide for step-by-step instructions
