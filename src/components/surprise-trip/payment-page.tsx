"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useCurrencyConversion, getSeasonalPrice } from "@/hooks/use-currency-conversion";
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
    CreditCard,
    Lock,
    Shield,
    Star
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

export function PaymentPage() {
    const { settings } = useSiteSettings();
    const t = useTranslations(settings.language);
    const { formatPrice, formatSeasonalPrice, convertCurrency } = useCurrencyConversion();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<any>(null);
    const [selectedDates, setSelectedDates] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
    const [selectedDuration, setSelectedDuration] = useState<number>(2);
    const [personalizationData, setPersonalizationData] = useState<any>(null);
    const [tripData, setTripData] = useState<any>(null);
    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        email: "",
        phone: "",
        countryCode: "+1",
        travelers: {} as {[key: string]: {firstName: string, lastName: string, passport: string}},
        agreeTerms: false
    });
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    // Load data from previous steps
    useEffect(() => {
        const savedTrip = localStorage.getItem('selectedTrip');
        const savedDates = localStorage.getItem('selectedDates');
        const savedDuration = localStorage.getItem('selectedDuration');
        const savedPersonalization = localStorage.getItem('personalizationData');
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

        if (savedPersonalization) {
            try {
                setPersonalizationData(JSON.parse(savedPersonalization));
            } catch (error) {
                console.error('Error parsing personalization data:', error);
            }
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
            description: personalizationData && personalizationData.interests.length > 0 ? 
                `${personalizationData.interests.length} interests selected` : 
                t("timeline.step4.description"),
            icon: <Users className="h-5 w-5" />,
            completed: true,
            current: false
        },
        {
            id: 5,
            title: t("timeline.step5.title"),
            description: paymentCompleted ? t("timeline.step5.completed") : t("timeline.step5.description"),
            icon: <Check className="h-5 w-5" />,
            completed: paymentCompleted,
            current: !paymentCompleted
        }
    ];

    const handleInputChange = (field: string, value: string | boolean) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTravelerChange = (travelerIndex: number, field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            travelers: {
                ...prev.travelers,
                [travelerIndex]: {
                    ...prev.travelers[travelerIndex],
                    [field]: value
                }
            }
        }));
    };

    // Calculate the real price for the selected date
    const getRealPriceForSelectedDate = () => {
        if (!selectedDates.start) return selectedTrip?.priceUSD || 0;
        
        // Use the same logic as in the dates page to calculate seasonal price
        const basePriceUSD = selectedTrip?.priceUSD || 299;
        const seasonalPriceUSD = getSeasonalPrice(basePriceUSD, selectedDates.start);
        
        // Convert to the current currency and return the numeric value
        const { amount } = convertCurrency(seasonalPriceUSD);
        return amount;
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const isFormValid = () => {
        const travelers = tripData ? tripData.travelers : 2;
        
        let baseValidation = paymentData.cardNumber.length >= 19 && // 4 groups of 4 digits
                           paymentData.expiryDate.length === 5 && // MM/YY
                           paymentData.cvv.length >= 3 &&
                           paymentData.cardName.trim() !== "" &&
                           paymentData.email.trim() !== "" &&
                           paymentData.phone.trim() !== "" &&
                           paymentData.agreeTerms;
        
        // Validate all travelers dynamically
        for (let i = 1; i <= travelers; i++) {
            const traveler = paymentData.travelers[i];
            if (!traveler || 
                !traveler.firstName?.trim() || 
                !traveler.lastName?.trim() || 
                !traveler.passport?.trim()) {
                return false;
            }
        }
        
        return baseValidation;
    };

    const handlePayment = () => {
        if (isFormValid()) {
            // TODO: Integrate with Stripe
            console.log('Payment data:', paymentData);
            console.log('Trip data:', { selectedTrip, selectedDates, selectedDuration, personalizationData });
            
            // Simulate payment processing
            setTimeout(() => {
                setPaymentCompleted(true);
                // Show confirmation modal
                const modal = document.getElementById('booking-confirmation-modal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            }, 1500);
        }
    };

    const handleGoBack = () => {
        window.location.href = "/surprise-trip/personalize";
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
                        {t("payment.badge")}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t("payment.title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("payment.subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left Column - Order Summary */}
                    <motion.div variants={itemFadeIn} className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-6">{t("payment.orderSummary")}</h3>

                            {/* Trip Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                                        <Image
                                            src={selectedTrip.image}
                                            alt={selectedTrip.title}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{selectedTrip.title}</h4>
                                        <p className="text-muted-foreground text-sm">{selectedTrip.region}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatPrice(getRealPriceForSelectedDate())}</p>
                                    </div>
                                </div>

                                {selectedDates.start && selectedDates.end && selectedDates.start instanceof Date && selectedDates.end instanceof Date && (
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-muted-foreground">{t("payment.dates")}</span>
                                            <span className="text-sm font-medium">
                                                {selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">{t("payment.duration")}</span>
                                            <span className="text-sm font-medium">{selectedDuration} nights</span>
                                        </div>
                                    </div>
                                )}

                                {personalizationData && personalizationData.interests.length > 0 && (
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground mb-2">{t("payment.interests")}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {personalizationData.interests.slice(0, 3).map((interest: string) => (
                                                <span key={interest} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                    {interest}
                                                </span>
                                            ))}
                                            {personalizationData.interests.length > 3 && (
                                                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                                    +{personalizationData.interests.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Cost Calculation */}
                                {selectedDates.start && selectedDates.end && selectedDates.start instanceof Date && selectedDates.end instanceof Date && (
                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">{t("payment.datePrice")}</span>
                                            <span className="text-sm font-medium">{formatPrice(getRealPriceForSelectedDate())}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">{t("payment.travelers")}</span>
                                            <span className="text-sm font-medium">{tripData ? tripData.travelers : 2} {t("payment.adults")}</span>
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-lg">{t("payment.total")}</span>
                                                <span className="font-bold text-lg text-primary">{formatPrice(getRealPriceForSelectedDate() * (tripData ? tripData.travelers : 2))}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">{t("payment.security")}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-muted-foreground">{t("payment.securePayment")}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-muted-foreground">{t("payment.encryptedData")}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-muted-foreground">{t("payment.guarantee")}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Payment Form */}
                    <motion.div variants={itemFadeIn} className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-6">{t("payment.contactInfo")}</h3>
                            
                            <div className="space-y-4">
                                {/* Primary Contact */}
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        {t("payment.email")} *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={paymentData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium">
                                        {t("payment.phone")} *
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <select
                                            value={paymentData.countryCode || "+1"}
                                            onChange={(e) => handleInputChange('countryCode', e.target.value)}
                                            className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm min-w-[100px]"
                                        >
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+52">🇲🇽 +52</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+33">🇫🇷 +33</option>
                                            <option value="+49">🇩🇪 +49</option>
                                            <option value="+39">🇮🇹 +39</option>
                                            <option value="+34">🇪🇸 +34</option>
                                            <option value="+81">🇯🇵 +81</option>
                                            <option value="+86">🇨🇳 +86</option>
                                            <option value="+91">🇮🇳 +91</option>
                                        </select>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="(555) 123-4567"
                                            value={paymentData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Traveler Information */}
                                {Array.from({ length: tripData ? tripData.travelers : 2 }, (_, index) => {
                                    const travelerNumber = index + 1;
                                    return (
                                        <div key={travelerNumber} className="border-t pt-4">
                                            <h4 className="font-semibold mb-4">
                                                {t(`payment.traveler${travelerNumber}`)}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor={`firstName${travelerNumber}`} className="text-sm font-medium">
                                                        {t("payment.firstName")} *
                                                    </Label>
                                                    <Input
                                                        id={`firstName${travelerNumber}`}
                                                        type="text"
                                                        placeholder={travelerNumber === 1 ? "John" : "Jane"}
                                                        value={paymentData.travelers[travelerNumber]?.firstName || ""}
                                                        onChange={(e) => handleTravelerChange(travelerNumber, 'firstName', e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`lastName${travelerNumber}`} className="text-sm font-medium">
                                                        {t("payment.lastName")} *
                                                    </Label>
                                                    <Input
                                                        id={`lastName${travelerNumber}`}
                                                        type="text"
                                                        placeholder="Doe"
                                                        value={paymentData.travelers[travelerNumber]?.lastName || ""}
                                                        onChange={(e) => handleTravelerChange(travelerNumber, 'lastName', e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Label htmlFor={`passport${travelerNumber}`} className="text-sm font-medium">
                                                    {t("payment.passportNumber")} *
                                                </Label>
                                                <Input
                                                    id={`passport${travelerNumber}`}
                                                    type="text"
                                                    placeholder={`${String.fromCharCode(64 + travelerNumber)}12345678`}
                                                    value={paymentData.travelers[travelerNumber]?.passport || ""}
                                                    onChange={(e) => handleTravelerChange(travelerNumber, 'passport', e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold">{t("payment.paymentDetails")}</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Card Number */}
                                <div>
                                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                                        {t("payment.cardNumber")} *
                                    </Label>
                                    <Input
                                        id="cardNumber"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={paymentData.cardNumber}
                                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                        maxLength={19}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiryDate" className="text-sm font-medium">
                                            {t("payment.expiryDate")} *
                                        </Label>
                                        <Input
                                            id="expiryDate"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={paymentData.expiryDate}
                                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                            maxLength={5}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv" className="text-sm font-medium">
                                            {t("payment.cvv")} *
                                        </Label>
                                        <Input
                                            id="cvv"
                                            type="text"
                                            placeholder="123"
                                            value={paymentData.cvv}
                                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                            maxLength={4}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div>
                                    <Label htmlFor="cardName" className="text-sm font-medium">
                                        {t("payment.cardName")} *
                                    </Label>
                                    <Input
                                        id="cardName"
                                        type="text"
                                        placeholder={t("payment.cardNamePlaceholder")}
                                        value={paymentData.cardName}
                                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={paymentData.agreeTerms}
                                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                                    className="mt-1"
                                />
                                <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                                    {t("payment.agreeTerms")}
                                </Label>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div variants={itemFadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-8 py-3"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        {t("payment.goBack")}
                    </Button>
                    <Button 
                        size="lg" 
                        className={`px-8 py-3 transition-all duration-300 ${
                            isFormValid()
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!isFormValid()}
                        onClick={handlePayment}
                    >
                        <Lock className="h-5 w-5 mr-2" />
                        {isFormValid() ? t("payment.payNow") : t("payment.completeForm")}
                    </Button>
                </motion.div>
            </motion.div>

            {/* Booking Confirmation Modal */}
            <div
                id="booking-confirmation-modal"
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                style={{ display: 'none' }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.currentTarget.style.display = 'none';
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                    
                    {/* Success Icon */}
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                            {t("payment.confirmationTitle")}
                        </h2>
                        
                        {/* Subtitle */}
                        <p className="text-muted-foreground mb-6">
                            {t("payment.confirmationSubtitle")}
                        </p>
                        
                        {/* Trip Summary */}
                        <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedTrip?.image || ""}
                                        alt={selectedTrip?.title || ""}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{selectedTrip?.title}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedTrip?.region}</p>
                                </div>
                            </div>
                            
                            {selectedDates.start && selectedDates.end && selectedDates.start instanceof Date && selectedDates.end instanceof Date && (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t("payment.dates")}</span>
                                        <span className="font-medium">{selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t("payment.travelers")}</span>
                                        <span className="font-medium">{tripData?.travelers || 2} {t("payment.adults")}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="font-semibold">{t("payment.total")}</span>
                                        <span className="font-bold text-primary">{formatPrice(getRealPriceForSelectedDate() * (tripData ? tripData.travelers : 2))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    const modal = document.getElementById('booking-confirmation-modal');
                                    if (modal) {
                                        modal.style.display = 'none';
                                    }
                                }}
                            >
                                {t("payment.viewBooking")}
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                {t("payment.exploreMore")}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
