export default function TemplatePageWrapper({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`min-h-screen w-full bg-background text-foreground ${className || ''}`} style={style}>
      {/* Sections handle their own spacing and containers */}
      {children}
    </div>
  );
}

