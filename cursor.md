# Project Rules & Architecture (Next.js 16 + TypeScript + App Router)

Always follow these rules when generating code.

## 1. Tech Stack
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Clerk authentication (frontend + backend)
- Zod for validations
- React Hook Form for all forms
- Tailwind CSS (blue theme)
- Inter as the main font
- Shadcn UI components only
- Neon Serverless PostgreSQL
- Raw SQL queries using @neondatabase/serverless
- Next.js Server Actions for all data mutations
- Responsive-first layout and UI
- Use metadata object in page files
- Modern React patterns with minimal "use client"

## 2. Project Structure
src/
 ├─ app/
 │   ├─ (routes)
 │   ├─ actions/        → server actions
 │   ├─ layout.tsx
 │   └─ page.tsx
 ├─ components/
 │   ├─ ui/             → shadcn components
 │   ├─ modals/         → modal components
 │   ├─ forms/          → form components
 │   ├─ layout/         → layout-specific components
 │   └─ elements/       → small reusable elements (badges, icons, tags)
 ├─ lib/
 │   ├─ db.ts           → neon client
 │   ├─ validators/     → zod schemas
 │   ├─ utils.ts
 │   └─ auth.ts         → clerk server helpers
 ├─ hooks/
 └─ styles/

## 3. Database Rules
- Use Neon Serverless ONLY
- Use "@neondatabase/serverless" client
- All SQL must be parameterized
- Never generate Prisma/Drizzle code
- Always return typed data using TypeScript interfaces or Zod schemas

## 4. UI Rules
- Styling must use Tailwind CSS
- Blue theme (shadcn default blue palette)
- Font must be Inter
- Use shadcn components for:
  - buttons
  - cards
  - inputs
  - forms
  - dialogs
  - sheets
  - dropdown-menu
  - separators
- No inline styles
- Must be fully responsive

## 5. Form Rules
- Every form must use:
  - react-hook-form
  - zodResolver
  - Zod schema stored in lib/validators
- Form fields must be strongly typed
- Show both field and form errors
- Submissions must be done through server actions

## 6. Authentication Rules
- Use Clerk for:
  - frontend auth state
  - layout protection
  - server-side auth() in actions
- Validate `userId` inside every server action

## 7. Server Action Rules
- All mutations must be server actions
- Pattern:

"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
});

export async function createItem(data: unknown) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = schema.parse(data);
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    INSERT INTO items (name, user_id)
    VALUES (${parsed.name}, ${userId})
    RETURNING id, name
  `;

  return result[0];
}

## 8. Routing Rules
- Must use folder-based routing
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries
- Use route groups for:
  - (public)
  - (protected)
  - (dashboard)

## 9. TypeScript Rules
- Use strict typing everywhere
- Use Zod to infer types: `type FormData = z.infer<typeof Schema>`
- Avoid `any`
- Prefer:
  - unknown (for server action input)
  - explicit return types
  - React.FC discouraged → use normal functions

## 10. Additional Best Practices
- Add "use client" only when required
- Avoid business logic inside components
- Use reusable UI components
- Use absolute imports (@/)
- Keep files small and maintainable
- Use loading skeletons for better UX

## 11. Code Style
Always:
- write clean, readable, typed code
- validate all inputs with Zod
- structure UI into small reusable parts

Never:
- use Prisma or Drizzle
- create API routes for mutations
- fetch POST to mutate data
- mix SQL logic inside React components

