interface MetaData {
    keywords?: string[];
}

export function MetaSection({ data }: { data?: MetaData }) {
    // Meta section: accepts only 3-5 keywords.
    // Render them as hidden or as meta tags if this was a real head component.
    // For visual template, we can perhaps show them as tags or just hide them.
    // Spec: "Ensure MetaSection accepts only 3–5 keywords."
    
    const keywords = Array.isArray(data?.keywords) ? data.keywords.slice(0, 5) : [];
    
    if (keywords.length === 0) return null;

    return (
        <div className="hidden">
            {/* SEO Keywords (Hidden from view but present in structure) */}
            {keywords.join(", ")}
        </div>
    );
}


