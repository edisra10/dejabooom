"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useCurrencyConversion } from "@/hooks/use-currency-conversion";
import { SiteSettings } from "@/components/site-settings";
import { 
    MapPin, 
    Plane, 
    Calendar, 
    Users, 
    Check,
    ArrowLeft,
    ArrowRight,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import type { SelectedDates, SelectedTrip, TripData } from "@/types";
import type { TranslationKey } from "@/hooks/use-translations";

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const durationOptions: Array<{ days: number; labelKey: TranslationKey }> = [
    { days: 2, labelKey: "dates.days2" },
    { days: 3, labelKey: "dates.days3" },
    { days: 4, labelKey: "dates.days4" },
    { days: 5, labelKey: "dates.days5" },
];

const weekdayKeys: TranslationKey[] = [
    "dates.calendar.sun",
    "dates.calendar.mon",
    "dates.calendar.tue",
    "dates.calendar.wed",
    "dates.calendar.thu",
    "dates.calendar.fri",
    "dates.calendar.sat",
];

export function SurpriseTripDates() {
    const { settings } = useSiteSettings();
    const t = useTranslations(settings.language);
    const { formatSeasonalPrice } = useCurrencyConversion();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<SelectedDates>({
        start: null,
        end: null
    });
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<number>(2); // Default to 2 nights
    const [selectedTrip, setSelectedTrip] = useState<SelectedTrip | null>(null);
    const [tripData, setTripData] = useState<TripData | null>(null);
    const today = useMemo(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }, []);

    // Load selected trip data and trip data from localStorage
    useEffect(() => {
        setCurrentMonth(new Date());
        const savedTrip = localStorage.getItem('selectedTrip');
        const savedTripData = localStorage.getItem('tripData');
        
        if (savedTrip) {
            try {
                const tripData = JSON.parse(savedTrip) as SelectedTrip;
                setSelectedTrip(tripData);
            } catch (error) {
                console.error('Error parsing saved trip data:', error);
                // Fallback to default trip if there's an error
                setSelectedTrip({
                    id: "canada",
                    title: t("surpriseTrip.canada.title"),
                    description: t("surpriseTrip.canada.description"),
                    priceUSD: 299,
                    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
                    region: "Canada"
                });
            }
        } else {
            // Default fallback if no trip is selected
            setSelectedTrip({
                id: "canada",
                title: t("surpriseTrip.canada.title"),
                description: t("surpriseTrip.canada.description"),
                priceUSD: 299,
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
                region: "Canada"
            });
        }
        
        if (savedTripData) {
            try {
                const parsedTripData = JSON.parse(savedTripData) as TripData;
                setTripData(parsedTripData);
            } catch (error) {
                console.error('Error parsing saved trip data:', error);
            }
        }
    }, [t]);

    // Clear selected dates when duration changes
    useEffect(() => {
        setSelectedDates({ start: null, end: null });
    }, [selectedDuration]);

    const timelineSteps = [
        {
            id: 1,
            title: t("timeline.step1.title"),
            description: tripData ? `${tripData.tripType}, ${tripData.travelers} ${tripData.travelers === 1 ? 'traveler' : 'travelers'}` : t("timeline.step1.description"),
            icon: <MapPin className="h-5 w-5" />,
            completed: true,
            current: false
        },
        {
            id: 2,
            title: t("timeline.step2.title"),
            description: selectedTrip ? `${selectedTrip.region} - ${selectedTrip.title}` : t("timeline.step2.description"),
            icon: <Plane className="h-5 w-5" />,
            completed: true,
            current: false
        },
        {
            id: 3,
            title: t("timeline.step3.title"),
            description: selectedDates.start && selectedDates.end ? 
                `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()} (${selectedDuration} nights)` : 
                t("timeline.step3.description"),
            icon: <Calendar className="h-5 w-5" />,
            completed: selectedDates.start && selectedDates.end,
            current: !selectedDates.start || !selectedDates.end
        },
        {
            id: 4,
            title: t("timeline.step4.title"),
            description: t("timeline.step4.description"),
            icon: <Users className="h-5 w-5" />,
            completed: false,
            current: selectedDates.start && selectedDates.end
        },
        {
            id: 5,
            title: t("timeline.step5.title"),
            description: t("timeline.step5.description"),
            icon: <Check className="h-5 w-5" />,
            completed: false,
            current: false
        }
    ];

    // Generate calendar days for two months - recalculate when currentMonth changes
    const { firstMonth, secondMonth } = useMemo(() => {
        if (!currentMonth) {
            return { firstMonth: [], secondMonth: [] };
        }

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        // Helper function to generate days for a month
        const generateMonthDays = (targetYear: number, targetMonth: number) => {
            const firstDay = new Date(targetYear, targetMonth, 1);
            const lastDay = new Date(targetYear, targetMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            const days = [];
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < startingDayOfWeek; i++) {
                days.push(null);
            }
            
            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(targetYear, targetMonth, day);
                days.push(date);
            }
            
            return days;
        };

        // Generate first month
        const firstMonthDays = generateMonthDays(year, month);

        // Generate second month
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const secondMonthDays = generateMonthDays(nextYear, nextMonth);
        
        return { firstMonth: firstMonthDays, secondMonth: secondMonthDays };
    }, [currentMonth]);

    // Check if date is in the past
    const isPastDate = (date: Date) => {
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);
        return dateToCheck < today;
    };

    // Generate seasonal prices based on date
    const getPriceForDate = (date: Date, isSelected: boolean = false) => {
        const basePriceUSD = 299;
        const seasonalPrice = formatSeasonalPrice(basePriceUSD, date, isSelected);
        return seasonalPrice;
    };

    const isDateSelected = (date: Date) => {
        if (!selectedDates.start || !selectedDates.end) return false;
        
        // Check if date is within the selected range (inclusive)
        const dateTime = date.getTime();
        const startTime = selectedDates.start.getTime();
        const endTime = selectedDates.end.getTime();
        
        return dateTime >= startTime && dateTime <= endTime;
    };

    const isDateInRange = (date: Date) => {
        if (!selectedDates.start || !selectedDates.end) return false;
        
        // Only highlight dates that are strictly between start and end (not inclusive)
        const dateTime = date.getTime();
        const startTime = selectedDates.start.getTime();
        const endTime = selectedDates.end.getTime();
        
        return dateTime > startTime && dateTime < endTime;
    };

    const handleDateClick = (date: Date) => {
        // Don't allow selection of past dates
        if (isPastDate(date)) {
            return;
        }

        // Calculate end date based on selected nights (nights = days - 1)
        const daysToAdd = selectedDuration; // 2 nights = 2 days (start + 1 more day)
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + daysToAdd);

        // Set the selected dates
        setSelectedDates({ start: date, end: endDate });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const current = prev ?? new Date();
            const newDate = new Date(current);
            if (direction === 'prev') {
                newDate.setMonth(current.getMonth() - 1);
            } else {
                newDate.setMonth(current.getMonth() + 1);
            }
            return newDate;
        });
    };

    const monthNames = [
        t("dates.calendar.january"), t("dates.calendar.february"), t("dates.calendar.march"), t("dates.calendar.april"),
        t("dates.calendar.may"), t("dates.calendar.june"), t("dates.calendar.july"), t("dates.calendar.august"),
        t("dates.calendar.september"), t("dates.calendar.october"), t("dates.calendar.november"), t("dates.calendar.december")
    ];

    const nextMonth = currentMonth?.getMonth() === 11 ? 0 : (currentMonth?.getMonth() ?? 0) + 1;
    const nextYear = currentMonth?.getMonth() === 11 ? currentMonth.getFullYear() + 1 : (currentMonth?.getFullYear() ?? today.getFullYear());

    // Don't render until selectedTrip is loaded
    if (!selectedTrip || !currentMonth) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 w-full border-b bg-navy-900 bg-[#051937]"
            >
                <div className="container flex h-16 items-center justify-between">
                    <motion.div 
                        className="flex items-center gap-3 cursor-pointer pl-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => window.location.href = '/'}
                    >
                        <Image
                            src="/2.svg"
                            alt="DejaBooom Logo"
                            width={360}
                            height={100}
                            className="h-48 w-auto"
                            style={{ 
                                objectFit: 'contain'
                            }}
                            priority
                        />
                    </motion.div>
                    
                    <nav className="hidden md:flex gap-6">
                        <Link href="/#destinations" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("destinations")}
                        </Link>
                        <Link href="/#how-it-works" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("howItWorks")}
                        </Link>
                        <Link href="/#about" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("about")}
                        </Link>
                        <Link href="/#contact" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("contact")}
                        </Link>
                    </nav>
                    
                    <div className="hidden md:flex items-center gap-8">
                        <SiteSettings />
                        <div className="flex items-center gap-4 px-4">
                            <Button size="sm" className="bg-white text-[#051937] hover:bg-white/90">
                                {t("signIn")}
                            </Button>
                        </div>
                    </div>
                    
                    <button className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-background border-b overflow-hidden"
            >
                <div className="container py-4 space-y-4">
                    <nav className="flex flex-col space-y-3">
                        <Link href="/#destinations" className="text-sm font-medium">{t("destinations")}</Link>
                        <Link href="/#how-it-works" className="text-sm font-medium">{t("howItWorks")}</Link>
                        <Link href="/#about" className="text-sm font-medium">{t("about")}</Link>
                        <Link href="/#contact" className="text-sm font-medium">{t("contact")}</Link>
                    </nav>
                    <div className="flex flex-col gap-3">
                        <Button className="w-full bg-white text-[#051937] hover:bg-white/90">{t("signIn")}</Button>
                    </div>
                </div>
            </motion.div>

            <div className="container py-12">
                {/* Timeline */}
                <div className="mb-16">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        {timelineSteps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                                        ${step.completed ? 'bg-primary text-primary-foreground' : 
                                          step.current ? 'bg-primary/20 text-primary border-2 border-primary' : 
                                          'bg-muted text-muted-foreground'}
                                    `}>
                                        {step.completed ? <Check className="h-5 w-5" /> : step.icon}
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-sm font-medium ${step.current ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground hidden md:block">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                {index < timelineSteps.length - 1 && (
                                    <div className={`w-16 h-0.5 mx-4 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.div variants={itemFadeIn}>
                        <Badge className="mb-4">{t("dates.badge")}</Badge>
                    </motion.div>
                    <motion.h1 variants={itemFadeIn} className="text-4xl md:text-6xl font-bold mb-4">
                        {t("dates.title")}
                    </motion.h1>
                    <motion.p variants={itemFadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        {t("dates.subtitle")}
                    </motion.p>

                    {/* Trip Duration Selector */}
                    <motion.div variants={itemFadeIn} className="max-w-2xl mx-auto mb-12">
                        <h3 className="text-lg font-semibold mb-4 text-center">{t("dates.duration")}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {durationOptions.map((option) => (
                                <Button
                                    key={option.days}
                                    variant={selectedDuration === option.days ? "default" : "outline"}
                                    className={`p-4 h-auto ${
                                        selectedDuration === option.days 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-background hover:bg-muted'
                                    }`}
                                    onClick={() => setSelectedDuration(option.days)}
                                >
                                    <div className="text-center">
                                        <div className="font-semibold">{t(option.labelKey)}</div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Calendar */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto mb-12"
                >
                    <motion.div variants={itemFadeIn} className="bg-card border border-border rounded-2xl p-6">
                        {/* Calendar Header with Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateMonth('prev')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="w-8" /> {/* Spacer */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateMonth('next')}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Two Month Calendar Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* First Month */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                
                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {weekdayKeys.map((dayKey) => (
                                        <div key={dayKey} className="text-center text-xs font-medium text-muted-foreground py-1">
                                            {t(dayKey)}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {firstMonth.map((day, index) => {
                                        if (!day) {
                                            return <div key={`empty-${index}`} className="h-10" />;
                                        }

                                        const isSelected = isDateSelected(day);
                                        const isInRange = isDateInRange(day);
                                        const isToday = day.toDateString() === today.toDateString();
                                        const isPast = isPastDate(day);
                                        const priceData = getPriceForDate(day, isSelected);

                                        return (
                                            <div
                                                key={`first-${day.toISOString()}`}
                                                className={`
                                                    h-10 flex flex-col items-center justify-center rounded-lg transition-all duration-200 text-xs cursor-pointer
                                                    ${isPast ? 'bg-muted/50 text-muted-foreground/50' :
                                                      isSelected ? 'bg-primary text-primary-foreground' :
                                                      isInRange ? 'bg-primary/20 text-primary' :
                                                      isToday ? 'bg-accent text-accent-foreground' :
                                                      'hover:bg-muted'}
                                                `}
                                                onClick={() => handleDateClick(day)}
                                            >
                                                <span className="font-medium">{day.getDate()}</span>
                                                <span className={`text-xs opacity-75 ${priceData.colorClass}`}>{priceData.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Second Month */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    {monthNames[nextMonth]} {nextYear}
                                </h3>
                                
                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {weekdayKeys.map((dayKey) => (
                                        <div key={dayKey} className="text-center text-xs font-medium text-muted-foreground py-1">
                                            {t(dayKey)}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {secondMonth.map((day, index) => {
                                        if (!day) {
                                            return <div key={`empty-${index}`} className="h-10" />;
                                        }

                                        const isSelected = isDateSelected(day);
                                        const isInRange = isDateInRange(day);
                                        const isToday = day.toDateString() === today.toDateString();
                                        const isPast = isPastDate(day);
                                        const priceData = getPriceForDate(day, isSelected);

                                        return (
                                            <div
                                                key={`second-${day.toISOString()}`}
                                                className={`
                                                    h-10 flex flex-col items-center justify-center rounded-lg transition-all duration-200 text-xs cursor-pointer
                                                    ${isPast ? 'bg-muted/50 text-muted-foreground/50' :
                                                      isSelected ? 'bg-primary text-primary-foreground' :
                                                      isInRange ? 'bg-primary/20 text-primary' :
                                                      isToday ? 'bg-accent text-accent-foreground' :
                                                      'hover:bg-muted'}
                                                `}
                                                onClick={() => handleDateClick(day)}
                                            >
                                                <span className="font-medium">{day.getDate()}</span>
                                                <span className={`text-xs opacity-75 ${priceData.colorClass}`}>{priceData.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                            // Clear any saved trip data when going back
                            localStorage.removeItem('selectedTrip');
                            window.location.href = "/surprise-trip";
                        }}
                        className="flex items-center gap-2 px-8 py-3"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        {t("dates.goBack")}
                    </Button>
                    
                    <Button 
                        size="lg" 
                        className={`px-8 py-3 transition-all duration-300 ${
                            selectedDates.start && selectedDates.end
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!selectedDates.start || !selectedDates.end}
                        onClick={() => {
                            if (selectedDates.start && selectedDates.end) {
                                // Save data for next step
                                localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
                                localStorage.setItem('selectedDuration', selectedDuration.toString());
                                // Navigate to personalize page
                                window.location.href = "/surprise-trip/personalize";
                            }
                        }}
                    >
                        {selectedDates.start && selectedDates.end ? t("dates.continue") : t("dates.selectDates")}
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
