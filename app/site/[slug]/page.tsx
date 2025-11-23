import { notFound } from "next/navigation";

// Placeholder for database fetch
async function getWebsiteBySlug(slug: string) {
  // Simulate DB call
  // In real implementation, fetch from database using slug
  // const website = await db.query(...)
  
  console.log(`Fetching website for slug: ${slug}`);
  
  // Simulate 404 for specific slug for testing
  if (slug === "missing") return null;

  return {
    slug,
    name: `${slug.charAt(0).toUpperCase() + slug.slice(1)}'s Website`,
    content: "Welcome to this generated website.",
  };
}

export default async function SitePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const website = await getWebsiteBySlug(slug);

  if (!website) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 font-sans">
      <h1 className="text-4xl font-bold mb-4">{website.name}</h1>
      <p className="text-xl text-gray-600">{website.content}</p>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
        <p className="font-mono text-sm">Loaded from slug: {slug}</p>
      </div>
    </div>
  );
}

