"use client"

import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'
import { SiteSettingsProvider } from '@/hooks/use-site-settings'
import type { SiteSettingsState } from '@/hooks/use-site-settings'

export function Providers({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsState>({
    language: "en",
    currency: "USD",
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SiteSettingsProvider value={{ settings, setSettings }}>
        {children}
      </SiteSettingsProvider>
    </ThemeProvider>
  )
}
