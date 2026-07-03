export interface ThemeLocation {
  /** Shown under logo, e.g. "Longton · Stoke-on-Trent" */
  shortLabel: string;
  city: string;
  region: string;
}

export interface ThemeHighlight {
  label: string;
  value: string;
}

export interface ThemeMarketing {
  /** Cuisine types shown in hero, e.g. "Pizza · Burgers · Kebabs" */
  cuisineTags: string[];
  /** Hero stat row — delivery time, min order, collection time */
  highlights: ThemeHighlight[];
  /** Trust badges in hero, e.g. "Est. 30+ years" */
  trustBadges: string[];
  /** Optional emoji/icon per menu category slug for cards */
  categoryIcons: Record<string, string>;
  /** Featured food photos for hero marketing */
  heroImages?: string[];
}

export interface RestaurantTheme {
  id: string;
  name: string;
  tagline: string;
  logo: {
    text: string;
    shortText?: string;
    /** Optional image URL when white-labelling with a real logo */
    imageUrl?: string;
  };
  location: ThemeLocation;
  marketing: ThemeMarketing;
  colors: {
    primary: string;
    primaryHover: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    ring: string;
    success: string;
    warning: string;
    danger: string;
    heroGradientFrom: string;
    heroGradientTo: string;
  };
  fonts: {
    heading: string;
    body: string;
    /** Google Fonts query param, e.g. "DM+Sans:wght@400;600;700&family=Playfair+Display:wght@600;700" */
    googleFontsUrl?: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  business: {
    address: string;
    phone: string;
    email?: string;
    openingHours: string;
    deliveryAreas?: string;
  };
}

export type ThemeCssVars = Record<string, string>;
