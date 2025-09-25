import { createContext, useContext } from 'react';
import type { Language, Currency } from '@/components/site-settings';

export interface SiteSettingsState {
    language: Language;
    currency: Currency;
}

const SiteSettingsContext = createContext<{
    settings: SiteSettingsState;
    setSettings: (settings: SiteSettingsState) => void;
} | null>(null);

export const SiteSettingsProvider = SiteSettingsContext.Provider;

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
}
