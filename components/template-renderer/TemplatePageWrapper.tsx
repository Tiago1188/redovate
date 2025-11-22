export default function TemplatePageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen w-full bg-background text-foreground ${className || ''}`}>
      {/* Sections handle their own spacing and containers */}
      {children}
    </div>
  );
}

