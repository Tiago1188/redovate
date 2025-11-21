export default function TemplatePageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* Sections handle their own spacing and containers */}
      {children}
    </div>
  );
}

