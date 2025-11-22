'use client';

import { useState, useEffect } from 'react';
import RenderTemplate from '@/components/template-renderer/RenderTemplate';

interface ClientFrameProps {
  template: any;
  components: any[];
  // Use 'data' to be generic, but support 'fakeContent' prop name if used elsewhere
  data?: any;
  fakeContent?: any;
  initialTheme: string;
  initialFont: string;
  initialColors?: {
    primary: string;
    background: string;
  };
  // Allow disabling message listeners for production view
  enableListeners?: boolean;
  showBranding?: boolean;
}

export default function ClientFrame({
  template,
  components,
  data,
  fakeContent,
  initialTheme,
  initialFont,
  initialColors,
  enableListeners = true,
  showBranding = true
}: ClientFrameProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [font, setFont] = useState(initialFont);
  const [colors, setColors] = useState(initialColors);

  const content = data || fakeContent || {};

  useEffect(() => {
    if (!enableListeners) return;

    const handleMessage = (event: MessageEvent) => {
      const msgData = event.data;
      if (msgData.type === 'UPDATE_THEME') {
        setTheme(msgData.payload);
      } else if (msgData.type === 'UPDATE_FONT') {
        setFont(msgData.payload);
      } else if (msgData.type === 'UPDATE_COLORS') {
        setColors(msgData.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [enableListeners]);

  return (
    <RenderTemplate
      components={components}
      data={content}
      showBranding={showBranding}
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
