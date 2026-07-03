import type { Metadata } from 'next';
import { createThemeCssVars } from '@flames/theme';
import { activeTheme } from '@/theme.config';
import { ClientLayout } from '@/components/client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: `${activeTheme.name} | Order Online`,
  description: activeTheme.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = createThemeCssVars(activeTheme);

  return (
    <html lang="en-GB" style={themeVars} data-theme={activeTheme.id}>
      <head>
        {activeTheme.fonts.googleFontsUrl ? (
          <link rel="stylesheet" href={activeTheme.fonts.googleFontsUrl} />
        ) : null}
      </head>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
