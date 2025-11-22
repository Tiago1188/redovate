'use client';

import { useState, useEffect } from 'react';
import RenderTemplate from '@/components/template-renderer/RenderTemplate';

interface ClientFrameProps {
  template: any;
  components: any[];
  fakeContent: any;
  initialTheme: string;
  initialFont: string;
  initialColors?: {
    primary: string;
    background: string;
  };
}

export default function ClientFrame({
  template,
  components,
  fakeContent,
  initialTheme,
  initialFont,
  initialColors,
}: ClientFrameProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [font, setFont] = useState(initialFont);
  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.type === 'UPDATE_THEME') {
        setTheme(data.payload);
      } else if (data.type === 'UPDATE_FONT') {
        setFont(data.payload);
      } else if (data.type === 'UPDATE_COLORS') {
        setColors(data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <RenderTemplate
      components={components}
      data={fakeContent}
      showBranding={true}
      templateSlug={template.slug}
      customTheme={theme}
      customFont={font}
      customColors={colors ? {
        primary: colors.primary,
        background: colors.background,
        secondary: '#f8fafc',
        foreground: '#0f172a'
      } : undefined}
    />
  );
}

