export const FONT_OPTIONS = [
  { id: "inter", label: "Inter", plan: "starter" },
  { id: "poppins", label: "Poppins", plan: "starter" },
  { id: "lato", label: "Lato", plan: "starter" },
  { id: "nunito", label: "Nunito", plan: "starter" },
  { id: "plus-jakarta", label: "Plus Jakarta Sans", plan: "starter" },
  { id: "montserrat", label: "Montserrat", plan: "business" },
  { id: "work-sans", label: "Work Sans", plan: "business" },
  { id: "source-sans", label: "Source Sans Pro", plan: "business" },
  { id: "playfair", label: "Playfair Display", plan: "business" },
  { id: "baskerville", label: "Libre Baskerville", plan: "business" },
  { id: "dm-serif", label: "DM Serif Display", plan: "business" },
];

export const THEME_PRESETS = [
  { 
    id: 'theme-neutral', 
    name: 'Default', 
    colors: {
      primary: '#171717', // neutral-900
      secondary: '#f5f5f5', // neutral-100
      background: '#ffffff',
      foreground: '#1a1a1a'
    },
    previewClass: 'bg-neutral-700 border-neutral-800'
  },
  { 
    id: 'theme-blue', 
    name: 'Blue', 
    colors: {
      primary: '#3b82f6', // Blue
      secondary: '#eff6ff', 
      background: '#ffffff',
      foreground: '#0f172a'
    },
    previewClass: 'bg-blue-500 border-blue-600'
  },
  { 
    id: 'theme-voltage-pro', 
    name: 'Voltage Pro', 
    colors: {
      primary: '#f97316', // Orange (matches CSS)
      secondary: '#f8fafc',
      background: '#ffffff',
      foreground: '#0f172a'
    },
    previewClass: 'bg-orange-500 border-orange-600'
  },
  { 
    id: 'theme-violet', 
    name: 'Violet', 
    colors: {
      primary: '#8b5cf6', // violet-500
      secondary: '#f5f3ff', // violet-50
      background: '#ffffff',
      foreground: '#2e1065'
    },
    previewClass: 'bg-violet-500 border-violet-600'
  },
  { 
    id: 'theme-green', 
    name: 'Green', 
    colors: {
      primary: '#22c55e', // green-500
      secondary: '#f0fdf4', // green-50
      background: '#ffffff',
      foreground: '#052e16'
    },
    previewClass: 'bg-green-500 border-green-600'
  },
  { 
    id: 'theme-rose', 
    name: 'Rose', 
    colors: {
      primary: '#f43f5e', // rose-500
      secondary: '#fff1f2', // rose-50
      background: '#ffffff',
      foreground: '#881337'
    },
    previewClass: 'bg-rose-500 border-rose-600'
  },
  { 
    id: 'theme-yellow', 
    name: 'Yellow', 
    colors: {
      primary: '#eab308', // yellow-500
      secondary: '#fefce8', // yellow-50
      background: '#ffffff',
      foreground: '#422006'
    },
    previewClass: 'bg-yellow-400 border-yellow-500'
  },
];
