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
    X,
    Heart,
    Star,
    Camera,
    Mountain,
    Waves,
    Building,
    TreePine,
    Sparkles
} from "lucide-react";

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function PersonalizeTrip() {
    const { settings } = useSiteSettings();
    const t = useTranslations(settings.language);
    const { formatPrice } = useCurrencyConversion();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<any>(null);
    const [selectedDates, setSelectedDates] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
    const [selectedDuration, setSelectedDuration] = useState<number>(2);
    const [tripData, setTripData] = useState<any>(null);
    const [personalizationData, setPersonalizationData] = useState({
        interests: [] as string[],
        budget: "medium",
        accommodation: "hotel",
        activities: [] as string[],
        travelStyle: "balanced",
        groupType: "couple"
    });

    // Load data from previous steps
    useEffect(() => {
        const savedTrip = localStorage.getItem('selectedTrip');
        const savedDates = localStorage.getItem('selectedDates');
        const savedDuration = localStorage.getItem('selectedDuration');
        const savedTripData = localStorage.getItem('tripData');
        
        if (savedTrip) {
            try {
                setSelectedTrip(JSON.parse(savedTrip));
            } catch (error) {
                console.error('Error parsing saved trip data:', error);
            }
        }
        
        if (savedDates) {
            try {
                const parsedDates = JSON.parse(savedDates);
                // Convert string dates back to Date objects
                setSelectedDates({
                    start: parsedDates.start ? new Date(parsedDates.start) : null,
                    end: parsedDates.end ? new Date(parsedDates.end) : null
                });
            } catch (error) {
                console.error('Error parsing saved dates data:', error);
            }
        }
        
        if (savedDuration) {
            setSelectedDuration(parseInt(savedDuration));
        }
        
        if (savedTripData) {
            try {
                setTripData(JSON.parse(savedTripData));
            } catch (error) {
                console.error('Error parsing saved trip data:', error);
            }
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
            completed: true,
            current: false
        },
        {
            id: 3,
            title: t("timeline.step3.title"),
            description: selectedDates.start && selectedDates.end && 
                         selectedDates.start instanceof Date && selectedDates.end instanceof Date ? 
                `${selectedDates.start.toLocaleDateString()} - ${selectedDates.end.toLocaleDateString()} (${selectedDuration} nights)` : 
                t("timeline.step3.description"),
            icon: <Calendar className="h-5 w-5" />,
            completed: true,
            current: false
        },
        {
            id: 4,
            title: t("timeline.step4.title"),
            description: t("timeline.step4.description"),
            icon: <Users className="h-5 w-5" />,
            completed: false,
            current: true
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

    const interestOptions = [
        { id: "adventure", label: "Adventure", icon: <Mountain className="h-5 w-5" /> },
        { id: "beach", label: "Beach & Relaxation", icon: <Waves className="h-5 w-5" /> },
        { id: "culture", label: "Culture & History", icon: <Building className="h-5 w-5" /> },
        { id: "nature", label: "Nature & Wildlife", icon: <TreePine className="h-5 w-5" /> },
        { id: "photography", label: "Photography", icon: <Camera className="h-5 w-5" /> },
        { id: "food", label: "Food & Dining", icon: <Heart className="h-5 w-5" /> },
        { id: "nightlife", label: "Nightlife", icon: <Star className="h-5 w-5" /> }
    ];

    const activityOptions = [
        { id: "hiking", label: "Hiking & Trekking" },
        { id: "water_sports", label: "Water Sports" },
        { id: "city_tours", label: "City Tours" },
        { id: "museums", label: "Museums & Galleries" },
        { id: "cooking", label: "Cooking Classes" },
        { id: "spa", label: "Spa & Wellness" },
        { id: "shopping", label: "Shopping" },
        { id: "festivals", label: "Festivals & Events" }
    ];

    const handleInterestToggle = (interestId: string) => {
        setPersonalizationData(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(id => id !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    const handleActivityToggle = (activityId: string) => {
        setPersonalizationData(prev => ({
            ...prev,
            activities: prev.activities.includes(activityId)
                ? prev.activities.filter(id => id !== activityId)
                : [...prev.activities, activityId]
        }));
    };

    const handleContinue = () => {
        // Save personalization data
        localStorage.setItem('personalizationData', JSON.stringify(personalizationData));
        
        // Navigate to payment page (next step)
        window.location.href = "/surprise-trip/payment";
    };

    // Check if personalization is complete
    const isPersonalizationComplete = () => {
        return personalizationData.interests.length > 0 && 
               personalizationData.activities.length > 0;
    };

    const handleGoBack = () => {
        // Save current data and go back to dates
        localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
        localStorage.setItem('selectedDuration', selectedDuration.toString());
        window.location.href = "/surprise-trip/dates";
    };

    if (!selectedTrip) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground">Loading...</p>
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <motion.div
                            className="flex items-center cursor-pointer"
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

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                {t("nav.home")}
                            </a>
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                {t("nav.about")}
                            </a>
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                {t("nav.services")}
                            </a>
                            <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                {t("nav.contact")}
                            </a>
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center space-x-6">
                            <SiteSettings />
                            
                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center space-x-6 px-4">
                                <Button 
                                    size="sm" 
                                    className="bg-white text-[#051937] hover:bg-white/90"
                                >
                                    {t("nav.signIn")}
                                </Button>
                            </div>

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-white"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/10"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <a href="#" className="block px-3 py-2 text-white hover:text-blue-300 transition-colors">
                                    {t("nav.home")}
                                </a>
                                <a href="#" className="block px-3 py-2 text-white hover:text-blue-300 transition-colors">
                                    {t("nav.about")}
                                </a>
                                <a href="#" className="block px-3 py-2 text-white hover:text-blue-300 transition-colors">
                                    {t("nav.services")}
                                </a>
                                <a href="#" className="block px-3 py-2 text-white hover:text-blue-300 transition-colors">
                                    {t("nav.contact")}
                                </a>
                                <div className="border-t border-white/10 pt-2 mt-2">
                                    <Button 
                                        className="w-full bg-white text-[#051937] hover:bg-white/90 mb-2"
                                    >
                                        {t("nav.signIn")}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.header>

            {/* Main Content */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
                {/* Timeline */}
                <motion.div variants={itemFadeIn} className="mb-16">
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
                </motion.div>

                {/* Page Header */}
                <motion.div variants={itemFadeIn} className="text-center mb-12">
                    <Badge className="mb-4">
                        {t("personalize.badge")}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t("personalize.title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("personalize.subtitle")}
                    </p>
                </motion.div>


                {/* Personalization Form */}
                <motion.div variants={itemFadeIn} className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Interests */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">{t("personalize.interests")}</h3>
                            <p className="text-muted-foreground mb-6">{t("personalize.interestsDescription")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {interestOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleInterestToggle(option.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                            personalizationData.interests.includes(option.id)
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        {option.icon}
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">{t("personalize.activities")}</h3>
                            <p className="text-muted-foreground mb-6">{t("personalize.activitiesDescription")}</p>
                            <div className="grid grid-cols-1 gap-3">
                                {activityOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleActivityToggle(option.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                            personalizationData.activities.includes(option.id)
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget & Preferences */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">{t("personalize.budget")}</h3>
                            <p className="text-muted-foreground mb-6">{t("personalize.budgetDescription")}</p>
                            <div className="grid grid-cols-3 gap-3">
                                {['low', 'medium', 'high'].map((budget) => (
                                    <button
                                        key={budget}
                                        onClick={() => setPersonalizationData(prev => ({ ...prev, budget }))}
                                        className={`p-3 rounded-lg border transition-all duration-200 ${
                                            personalizationData.budget === budget
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-sm font-medium capitalize">{budget}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Travel Style */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">{t("personalize.travelStyle")}</h3>
                            <p className="text-muted-foreground mb-6">{t("personalize.travelStyleDescription")}</p>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: "relaxed", label: "Relaxed & Slow-paced" },
                                    { id: "balanced", label: "Balanced" },
                                    { id: "adventurous", label: "Adventurous & Fast-paced" }
                                ].map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setPersonalizationData(prev => ({ ...prev, travelStyle: style.id }))}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                            personalizationData.travelStyle === style.id
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{style.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemFadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-8 py-3"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        {t("personalize.goBack")}
                    </Button>
                    <Button 
                        size="lg" 
                        className={`px-8 py-3 transition-all duration-300 ${
                            isPersonalizationComplete()
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!isPersonalizationComplete()}
                        onClick={handleContinue}
                    >
                        {isPersonalizationComplete() ? t("personalize.continue") : t("personalize.selectOptions")}
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
