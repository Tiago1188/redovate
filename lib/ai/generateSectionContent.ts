"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateSectionContentParams {
  sectionType: string;
  businessName: string;
  category: string;
  about?: string;
  services?: string[];
  serviceAreas?: string[];
  tone?: "professional" | "friendly" | "casual";
}

export interface GeneratedContent {
  headline?: string;
  subheadline?: string;
  description?: string;
  content?: string;
  cta_text?: string;
  items?: Array<{
    title: string;
    description: string;
  }>;
}

export async function generateSectionContent(
  params: GenerateSectionContentParams
): Promise<GeneratedContent> {
  const {
    sectionType,
    businessName,
    category,
    about,
    services,
    serviceAreas,
    tone = "professional",
  } = params;

  const systemPrompt = `You are a professional copywriter creating website content for ${businessName}, a ${category} business. 
Write in a ${tone} tone. Be concise but compelling. Focus on benefits and value.
Return JSON only, no markdown.`;

  const userPrompt = buildPromptForSection(sectionType, {
    businessName,
    category,
    about,
    services,
    serviceAreas,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content) as GeneratedContent;
  } catch (error) {
    console.error("Error generating section content:", error);
    throw new Error("Failed to generate content");
  }
}

function buildPromptForSection(
  sectionType: string,
  context: {
    businessName: string;
    category: string;
    about?: string;
    services?: string[];
    serviceAreas?: string[];
  }
): string {
  const { businessName, category, about, services, serviceAreas } = context;

  const baseContext = `
Business: ${businessName}
Category: ${category}
${about ? `About: ${about}` : ""}
${services?.length ? `Services: ${services.join(", ")}` : ""}
${serviceAreas?.length ? `Service Areas: ${serviceAreas.join(", ")}` : ""}
`;

  switch (sectionType) {
    case "hero":
      return `${baseContext}
Generate a hero section with:
- headline (max 10 words, attention-grabbing)
- subheadline (max 20 words, value proposition)
- cta_text (max 4 words, action-oriented)
Return as JSON: { "headline": "", "subheadline": "", "cta_text": "" }`;

    case "about":
      return `${baseContext}
Generate an about section with:
- headline (max 6 words)
- content (2-3 paragraphs about the business, its values, and what makes it unique)
Return as JSON: { "headline": "", "content": "" }`;

    case "services":
      return `${baseContext}
Generate descriptions for the services section:
- headline (max 6 words)
- description (1-2 sentences about the services offered)
Return as JSON: { "headline": "", "description": "" }`;

    case "contact":
      return `${baseContext}
Generate a contact section with:
- headline (max 6 words)
- description (1-2 sentences encouraging visitors to get in touch)
Return as JSON: { "headline": "", "description": "" }`;

    case "cta":
      return `${baseContext}
Generate a call-to-action section with:
- headline (max 8 words, urgent/compelling)
- description (1 sentence reinforcing the value)
- cta_text (max 4 words)
Return as JSON: { "headline": "", "description": "", "cta_text": "" }`;

    default:
      return `${baseContext}
Generate content for a ${sectionType} section with appropriate headline and description.
Return as JSON: { "headline": "", "description": "" }`;
  }
}

