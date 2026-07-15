"use client";

import * as React from "react";
import { Moon, Sun, Globe2, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useTranslations } from "@/hooks/use-translations";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type Language = "en" | "es";
export type Currency = "USD" | "MXN";

export function SiteSettings() {
    const { theme, setTheme } = useTheme();
    const { settings, setSettings } = useSiteSettings();
    const t = useTranslations(settings.language);

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:text-white/90 hover:bg-white/10">
                        <Globe2 className="h-4 w-4" />
                        <span>{settings.language.toUpperCase()}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setSettings({ ...settings, language: "en" })}
                        className={settings.language === "en" ? "bg-accent" : ""}
                    >
                        {t("english")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setSettings({ ...settings, language: "es" })}
                        className={settings.language === "es" ? "bg-accent" : ""}
                    >
                        {t("spanish")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:text-white/90 hover:bg-white/10">
                        <DollarSign className="h-4 w-4" />
                        <span>{settings.currency}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setSettings({ ...settings, currency: "USD" })}
                        className={settings.currency === "USD" ? "bg-accent" : ""}
                    >
                        {t("currency")} - USD
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setSettings({ ...settings, currency: "MXN" })}
                        className={settings.currency === "MXN" ? "bg-accent" : ""}
                    >
                        {t("currency")} - MXN
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-white hover:text-white/90"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}
