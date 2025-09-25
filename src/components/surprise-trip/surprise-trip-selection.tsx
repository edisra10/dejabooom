"use client";

import { useState, useEffect } from "react";
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
    X
} from "lucide-react";
import Link from "next/link";

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

export function SurpriseTripSelection() {
    const { settings } = useSiteSettings();
    const t = useTranslations(settings.language);
    const { formatPrice } = useCurrencyConversion();

    const [selectedTripType, setSelectedTripType] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tripData, setTripData] = useState<any>(null);

    const tripTypes = [
        {
            id: "canada",
            title: t("surpriseTrip.canada.title"),
            description: t("surpriseTrip.canada.description"),
            priceUSD: 299,
            image: "https://images.unsplash.com/photo-1497373637916-e47a55e22d0a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Canada"
        },
        {
            id: "usa",
            title: t("surpriseTrip.usa.title"),
            description: t("surpriseTrip.usa.description"),
            priceUSD: 399,
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "USA"
        },
        {
            id: "mexico",
            title: t("surpriseTrip.mexico.title"),
            description: t("surpriseTrip.mexico.description"),
            priceUSD: 249,
            image: "https://images.unsplash.com/photo-1622870129889-f7e0ba2603a1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            region: "Mexico"
        },
        {
            id: "caribbean",
            title: t("surpriseTrip.caribbean.title"),
            description: t("surpriseTrip.caribbean.description"),
            priceUSD: 349,
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000",
            region: "Caribbean"
        }
    ];

    const selectedTrip = tripTypes.find(trip => trip.id === selectedTripType);

    // Load data from previous step
    useEffect(() => {
        const savedTripData = localStorage.getItem('tripData');
        
        // Only load tripData from step 1, not selectedTrip (that's for when user goes back)
        if (savedTripData) {
            setTripData(JSON.parse(savedTripData));
        }
    }, []);
    
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
            completed: selectedTripType !== "",
            current: selectedTripType === ""
        },
        {
            id: 3,
            title: t("timeline.step3.title"),
            description: t("timeline.step3.description"),
            icon: <Calendar className="h-5 w-5" />,
            completed: false,
            current: selectedTripType !== ""
        },
        {
            id: 4,
            title: t("timeline.step4.title"),
            description: t("timeline.step4.description"),
            icon: <Users className="h-5 w-5" />,
            completed: false,
            current: false
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
                        <a href="/#destinations" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("destinations")}
                        </a>
                        <a href="/#how-it-works" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("howItWorks")}
                        </a>
                        <a href="/#about" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("about")}
                        </a>
                        <a href="/#contact" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("contact")}
                        </a>
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
                        <a href="/#destinations" className="text-sm font-medium">{t("destinations")}</a>
                        <a href="/#how-it-works" className="text-sm font-medium">{t("howItWorks")}</a>
                        <a href="/#about" className="text-sm font-medium">{t("about")}</a>
                        <a href="/#contact" className="text-sm font-medium">{t("contact")}</a>
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
                        <Badge className="mb-4">{t("surpriseTrip.badge")}</Badge>
                    </motion.div>
                    <motion.h1 variants={itemFadeIn} className="text-4xl md:text-6xl font-bold mb-4">
                        {t("surpriseTrip.title")}
                    </motion.h1>
                    <motion.p variants={itemFadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("surpriseTrip.subtitle")}
                    </motion.p>
                </motion.div>

                {/* Trip Type Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12"
                >
                    {tripTypes.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            variants={itemFadeIn}
                            whileHover={{ y: -5 }}
                            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                                selectedTripType === trip.id 
                                    ? 'ring-2 ring-primary shadow-lg scale-105' 
                                    : 'hover:shadow-lg'
                            }`}
                            onClick={() => setSelectedTripType(trip.id)}
                        >
                            <div className="aspect-[4/3] relative">
                                <Image
                                    src={trip.image}
                                    alt={trip.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                                <div className="absolute top-4 right-4">
                                    <span className="bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-bold">
                                        {formatPrice(trip.priceUSD)}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {trip.title}
                                    </h3>
                                    <p className="text-white/90 text-sm">
                                        {trip.description}
                                    </p>
                                </div>
                                {selectedTripType === trip.id && (
                                    <div className="absolute top-4 left-4">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                            <Check className="h-5 w-5 text-primary-foreground" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Continue Button */}
                <div className="text-center">
                    <Button 
                        size="lg" 
                        className={`px-8 py-3 transition-all duration-300 ${
                            selectedTripType 
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!selectedTripType}
                        onClick={() => {
                            if (selectedTripType) {
                                const selectedTrip = tripTypes.find(trip => trip.id === selectedTripType);
                                if (selectedTrip) {
                                    // Save selected trip data to localStorage
                                    localStorage.setItem('selectedTrip', JSON.stringify(selectedTrip));
                                    window.location.href = "/surprise-trip/dates";
                                }
                            }
                        }}
                    >
                        {selectedTripType ? t("surpriseTrip.continue") : t("surpriseTrip.selectDestination")}
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
