"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    Plane,
    MapPin,
    Calendar,
    Users,
    Star,
    ArrowRight,
    Search,
    Menu,
    X,
    Globe,
    Phone,
    Mail,
    Shield,
    Clock,
    Award,
    MapPin as MapPinIcon,
    Zap,
    Minus,
    Plus,
    Bed
} from "lucide-react";
import { SiteSettings } from "@/components/site-settings";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/use-translations";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ElegantShape } from "./elegant-shape";
import { ImagesSlider } from "./images-slider";
import type { Destination, TravelBookingLandingProps } from "@/types";

const defaultDestinations: Destination[] = [
  {
      id: 1,
      name: "Mystery Destination A",
      country: "Southern Europe",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000",
      price: 799,
      rating: 4.9,
      reviews: 2847,
      description: "Experience the charm of Southern Europe"
  },
  {
      id: 2,
      name: "Mystery Destination B",
      country: "Southeast Asia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1000",
      price: 899,
      rating: 4.8,
      reviews: 3521,
      description: "Discover the wonders of Southeast Asia"
  },
  {
      id: 3,
      name: "Mystery Destination C",
      country: "East Asia",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000",
      price: 999,
      rating: 4.9,
      reviews: 4123,
      description: "Immerse yourself in East Asian culture"
  },
  {
      id: 4,
      name: "Mystery Destination D",
      country: "Western Europe",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=1000",
      price: 699,
      rating: 4.7,
      reviews: 5672,
      description: "Explore the heart of Western Europe"
  }
];

const defaultHeroImages = [
  
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2h8ZW58MHx8MHx8fDA%3D",
    //"https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000"
];

export default function TravelBookingLanding({
    destinations = defaultDestinations,
    heroImages = defaultHeroImages
}: TravelBookingLandingProps) {
    const { settings } = useSiteSettings();
    const t = useTranslations(settings.language);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDestination, setSelectedDestination] = useState<string>("anywhere");
    const [checkIn, setCheckIn] = useState("");
    const [guests, setGuests] = useState({
        adults: 2,
        kids: 0,
        babies: 0
    });
    const [isTravelerDropdownOpen, setIsTravelerDropdownOpen] = useState(false);
    const travelerDropdownRef = useRef<HTMLDivElement>(null);
    const [travelerDropdownPosition, setTravelerDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    // Aeropuertos para el campo From (Flight y Flight + Hotel)
    const airports = [
        { code: "YYZ", name: "Toronto Pearson", city: "Toronto, Canada" },
        { code: "YVR", name: "Vancouver International", city: "Vancouver, Canada" },
        { code: "YUL", name: "Montreal Trudeau", city: "Montreal, Canada" },
        { code: "YYC", name: "Calgary International", city: "Calgary, Canada" },
        { code: "YOW", name: "Ottawa Macdonald-Cartier", city: "Ottawa, Canada" },
        { code: "JFK", name: "John F. Kennedy", city: "New York, USA" },
        { code: "LGA", name: "LaGuardia", city: "New York, USA" },
        { code: "LAX", name: "Los Angeles International", city: "Los Angeles, USA" },
        { code: "ORD", name: "O'Hare International", city: "Chicago, USA" },
        { code: "MIA", name: "Miami International", city: "Miami, USA" },
        { code: "LAS", name: "McCarran International", city: "Las Vegas, USA" },
        { code: "SFO", name: "San Francisco International", city: "San Francisco, USA" },
        { code: "DFW", name: "Dallas/Fort Worth", city: "Dallas, USA" },
        { code: "ATL", name: "Hartsfield-Jackson", city: "Atlanta, USA" },
        { code: "DEN", name: "Denver International", city: "Denver, USA" },
        { code: "MEX", name: "Mexico City International", city: "Mexico City, Mexico" },
        { code: "CUN", name: "Cancun International", city: "Cancun, Mexico" },
        { code: "GDL", name: "Guadalajara International", city: "Guadalajara, Mexico" },
        { code: "PVR", name: "Puerto Vallarta International", city: "Puerto Vallarta, Mexico" },
        { code: "CDG", name: "Charles de Gaulle", city: "Paris, France" },
        { code: "LHR", name: "Heathrow", city: "London, UK" },
        { code: "FCO", name: "Leonardo da Vinci", city: "Rome, Italy" },
        { code: "BCN", name: "Barcelona-El Prat", city: "Barcelona, Spain" },
        { code: "AMS", name: "Schiphol", city: "Amsterdam, Netherlands" },
        { code: "TXL", name: "Tegel", city: "Berlin, Germany" },
        { code: "NRT", name: "Narita", city: "Tokyo, Japan" },
        { code: "BKK", name: "Suvarnabhumi", city: "Bangkok, Thailand" },
        { code: "SIN", name: "Changi", city: "Singapore" },
        { code: "ICN", name: "Incheon", city: "Seoul, South Korea" },
        { code: "HKG", name: "Hong Kong International", city: "Hong Kong" },
        { code: "DXB", name: "Dubai International", city: "Dubai, UAE" }
    ];

    // Tipo para destinos locales (diferente al tipo Destination de las props)
    type LocalDestination = {
        code: string;
        name: string;
        country: string;
        type: string;
    };

    // Destinos para el campo To (todos los tipos de viaje)
    const destinationsList: LocalDestination[] = [
        { code: "PAR", name: "Paris", country: "France", type: "city" },
        { code: "LON", name: "London", country: "UK", type: "city" },
        { code: "ROM", name: "Rome", country: "Italy", type: "city" },
        { code: "BCN", name: "Barcelona", country: "Spain", type: "city" },
        { code: "AMS", name: "Amsterdam", country: "Netherlands", type: "city" },
        { code: "BER", name: "Berlin", country: "Germany", type: "city" },
        { code: "TOK", name: "Tokyo", country: "Japan", type: "city" },
        { code: "BKK", name: "Bangkok", country: "Thailand", type: "city" },
        { code: "SIN", name: "Singapore", country: "Singapore", type: "city" },
        { code: "SEO", name: "Seoul", country: "South Korea", type: "city" },
        { code: "HKG", name: "Hong Kong", country: "Hong Kong", type: "city" },
        { code: "DUB", name: "Dubai", country: "UAE", type: "city" },
        { code: "CUN", name: "Cancun", country: "Mexico", type: "resort" },
        { code: "JAM", name: "Jamaica", country: "Jamaica", type: "island" },
        { code: "BAH", name: "Bahamas", country: "Bahamas", type: "island" },
        { code: "DR", name: "Dominican Republic", country: "Dominican Republic", type: "country" },
        { code: "CUB", name: "Cuba", country: "Cuba", type: "country" },
        { code: "RIO", name: "Rio de Janeiro", country: "Brazil", type: "city" },
        { code: "BUE", name: "Buenos Aires", country: "Argentina", type: "city" },
        { code: "LIM", name: "Lima", country: "Peru", type: "city" },
        { code: "BOG", name: "Bogota", country: "Colombia", type: "city" },
        { code: "SCL", name: "Santiago", country: "Chile", type: "city" },
        { code: "NYC", name: "New York", country: "USA", type: "city" },
        { code: "LAX", name: "Los Angeles", country: "USA", type: "city" },
        { code: "CHI", name: "Chicago", country: "USA", type: "city" },
        { code: "MIA", name: "Miami", country: "USA", type: "city" },
        { code: "LV", name: "Las Vegas", country: "USA", type: "city" },
        { code: "SF", name: "San Francisco", country: "USA", type: "city" },
        { code: "TOR", name: "Toronto", country: "Canada", type: "city" },
        { code: "VAN", name: "Vancouver", country: "Canada", type: "city" },
        { code: "MTL", name: "Montreal", country: "Canada", type: "city" }
    ];

    const countriesAndCities = {
        "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
        "USA": ["New York", "Los Angeles", "Chicago", "Miami", "Las Vegas", "San Francisco"],
        "Mexico": ["Mexico City", "Cancun", "Guadalajara", "Playa del Carmen", "Puerto Vallarta"]
    };

    const tripTypes = ["Flight", "Hotel", "Flight + Hotel"];

    // Para el modo Surprise Trip - organizar destinos por región
    const destinationOptions = {
        "Europe": ["Paris", "London", "Rome", "Barcelona", "Amsterdam", "Berlin"],
        "Asia": ["Tokyo", "Bangkok", "Singapore", "Seoul", "Hong Kong", "Dubai"],
        "Caribbean": ["Cancun", "Jamaica", "Bahamas", "Dominican Republic", "Cuba"],
        "South America": ["Rio de Janeiro", "Buenos Aires", "Lima", "Bogota", "Santiago"]
    };

    const [activeTab, setActiveTab] = useState<"surprise" | "classic">("surprise");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
    const [selectedTripType, setSelectedTripType] = useState<string>("Flight + Hotel");
    const [selectedToCountry, setSelectedToCountry] = useState<string>("");
    const [selectedToCity, setSelectedToCity] = useState<string>("");
    const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const [toDropdownPosition, setToDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    
    // Estados para búsqueda de aeropuertos y destinos
    const [fromSearchText, setFromSearchText] = useState<string>("");
    const [toSearchText, setToSearchText] = useState<string>("");
    const [filteredAirports, setFilteredAirports] = useState(airports);
    const [filteredDestinations, setFilteredDestinations] = useState<LocalDestination[]>(destinationsList);
    
    // Estado para habitaciones
    const [rooms, setRooms] = useState<number>(1);
    const [isTripTypeDropdownOpen, setIsTripTypeDropdownOpen] = useState(false);
    const tripTypeDropdownRef = useRef<HTMLDivElement>(null);
    const [tripTypeDropdownPosition, setTripTypeDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef<HTMLInputElement>(null);

    const totalTravelers = guests.adults + guests.kids + guests.babies;

    // Función para filtrar aeropuertos
    const filterAirports = (searchText: string) => {
        if (searchText.length < 3) {
            setFilteredAirports([]);
            return;
        }
        const filtered = airports.filter(airport => 
            airport.name.toLowerCase().includes(searchText.toLowerCase()) ||
            airport.code.toLowerCase().includes(searchText.toLowerCase()) ||
            airport.city.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAirports(filtered);
    };

    // Función para filtrar destinos
    const filterDestinations = (searchText: string) => {
        if (searchText.length < 3) {
            setFilteredDestinations([]);
            return;
        }
        const filtered = destinationsList.filter(destination => 
            destination.name.toLowerCase().includes(searchText.toLowerCase()) ||
            destination.country.toLowerCase().includes(searchText.toLowerCase()) ||
            destination.code.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredDestinations(filtered);
    };

    // Función para manejar cambio en búsqueda From
    const handleFromSearchChange = (value: string) => {
        setFromSearchText(value);
        filterAirports(value);
        if (value.length >= 3) {
            setIsFromDropdownOpen(true);
        } else {
            setIsFromDropdownOpen(false);
        }
    };

    // Función para manejar cambio en búsqueda To
    const handleToSearchChange = (value: string) => {
        setToSearchText(value);
        filterDestinations(value);
        if (value.length >= 3) {
            setIsToDropdownOpen(true);
        } else {
            setIsToDropdownOpen(false);
        }
    };

    const updateTravelers = (type: 'adults' | 'kids' | 'babies', delta: number) => {
        setGuests(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    // Update dropdown position on scroll and resize
    useEffect(() => {
        const updatePosition = () => {
            if (dropdownRef.current && isFromDropdownOpen) {
                const rect = dropdownRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width
                });
            }
        };

        if (isFromDropdownOpen) {
            updatePosition();
            // Use both capture and bubble phases for scroll events
            window.addEventListener('scroll', updatePosition, { passive: true });
            document.addEventListener('scroll', updatePosition, { passive: true });
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition);
            document.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isFromDropdownOpen]);

    // Force position update when dropdown opens
    useEffect(() => {
        if (isFromDropdownOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isFromDropdownOpen]);

    // Update traveler dropdown position on scroll and resize
    useEffect(() => {
        const updateTravelerPosition = () => {
            if (travelerDropdownRef.current && isTravelerDropdownOpen) {
                const rect = travelerDropdownRef.current.getBoundingClientRect();
                setTravelerDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width
                });
            }
        };

        if (isTravelerDropdownOpen) {
            updateTravelerPosition();
            window.addEventListener('scroll', updateTravelerPosition, { passive: true });
            document.addEventListener('scroll', updateTravelerPosition, { passive: true });
            window.addEventListener('resize', updateTravelerPosition);
        }

        return () => {
            window.removeEventListener('scroll', updateTravelerPosition);
            document.removeEventListener('scroll', updateTravelerPosition);
            window.removeEventListener('resize', updateTravelerPosition);
        };
    }, [isTravelerDropdownOpen]);

    // Force traveler position update when dropdown opens
    useEffect(() => {
        if (isTravelerDropdownOpen && travelerDropdownRef.current) {
            const rect = travelerDropdownRef.current.getBoundingClientRect();
            setTravelerDropdownPosition({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isTravelerDropdownOpen]);

    // Update trip type dropdown position
    useEffect(() => {
        const updateTripTypePosition = () => {
            if (tripTypeDropdownRef.current && isTripTypeDropdownOpen) {
                const rect = tripTypeDropdownRef.current.getBoundingClientRect();
                setTripTypeDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width
                });
            }
        };

        if (isTripTypeDropdownOpen) {
            updateTripTypePosition();
            window.addEventListener('scroll', updateTripTypePosition, { passive: true });
            document.addEventListener('scroll', updateTripTypePosition, { passive: true });
            window.addEventListener('resize', updateTripTypePosition);
        }

        return () => {
            window.removeEventListener('scroll', updateTripTypePosition);
            document.removeEventListener('scroll', updateTripTypePosition);
            window.removeEventListener('resize', updateTripTypePosition);
        };
    }, [isTripTypeDropdownOpen]);

    // Update To dropdown position
    useEffect(() => {
        const updateToPosition = () => {
            if (toDropdownRef.current && isToDropdownOpen) {
                const rect = toDropdownRef.current.getBoundingClientRect();
                setToDropdownPosition({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width
                });
            }
        };

        if (isToDropdownOpen) {
            updateToPosition();
            window.addEventListener('scroll', updateToPosition, { passive: true });
            document.addEventListener('scroll', updateToPosition, { passive: true });
            window.addEventListener('resize', updateToPosition);
        }

        return () => {
            window.removeEventListener('scroll', updateToPosition);
            document.removeEventListener('scroll', updateToPosition);
            window.removeEventListener('resize', updateToPosition);
        };
    }, [isToDropdownOpen]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            // Handle From dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                const dropdownElement = document.querySelector('[data-dropdown="from-field"]');
                if (!dropdownElement?.contains(target)) {
                    setIsFromDropdownOpen(false);
                }
            }
            
            // Handle Traveler dropdown
            if (travelerDropdownRef.current && !travelerDropdownRef.current.contains(target)) {
                const travelerDropdownElement = document.querySelector('[data-dropdown="traveler-field"]');
                if (!travelerDropdownElement?.contains(target)) {
                    setIsTravelerDropdownOpen(false);
                }
            }
            
            // Handle Trip Type dropdown
            if (tripTypeDropdownRef.current && !tripTypeDropdownRef.current.contains(target)) {
                const tripTypeDropdownElement = document.querySelector('[data-dropdown="trip-type-field"]');
                if (!tripTypeDropdownElement?.contains(target)) {
                    setIsTripTypeDropdownOpen(false);
                }
            }
            
            // Handle To dropdown
            if (toDropdownRef.current && !toDropdownRef.current.contains(target)) {
                const toDropdownElement = document.querySelector('[data-dropdown="to-field"]');
                if (!toDropdownElement?.contains(target)) {
                    setIsToDropdownOpen(false);
                }
            }
        };

        if (isFromDropdownOpen || isTravelerDropdownOpen || isTripTypeDropdownOpen || isToDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFromDropdownOpen, isTravelerDropdownOpen, isTripTypeDropdownOpen, isToDropdownOpen]);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemFadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

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
                        <a href="#destinations" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("destinations")}
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("howItWorks")}
                        </a>
                        <a href="#about" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
                            {t("about")}
                        </a>
                        <a href="#contact" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
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
                        <a href="#destinations" className="text-sm font-medium">{t("destinations")}</a>
                        <a href="#how-it-works" className="text-sm font-medium">{t("howItWorks")}</a>
                        <a href="#about" className="text-sm font-medium">{t("about")}</a>
                        <a href="#contact" className="text-sm font-medium">{t("contact")}</a>
                    </nav>
                    <div className="flex flex-col gap-3">
                        <Button className="w-full bg-white text-[#051937] hover:bg-white/90">{t("signIn")}</Button>
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-orange-500/[0.05] blur-3xl" />

                <div className="absolute inset-0 overflow-hidden">
                    <ElegantShape
                        delay={0.3}
                        width={600}
                        height={140}
                        rotate={12}
                        gradient="from-blue-500/[0.15]"
                        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                    />
                    <ElegantShape
                        delay={0.5}
                        width={500}
                        height={120}
                        rotate={-15}
                        gradient="from-orange-500/[0.15]"
                        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                    />
                    <ElegantShape
                        delay={0.4}
                        width={300}
                        height={80}
                        rotate={-8}
                        gradient="from-purple-500/[0.15]"
                        className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                    />
                </div>

                <ImagesSlider className="h-screen" images={heroImages}>
                        <motion.div
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="z-50 flex flex-col justify-center items-center text-center px-4"
                        >
                            <motion.div
                                custom={0}
                                variants={fadeUpVariants}
                                initial="hidden"
                                animate="visible"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.2] mb-8"
                            >
                                <Globe className="h-4 w-4 text-white" />
                                <span className="text-sm text-white/90 tracking-wide">
                                    {t("hero.tagline")}
                                </span>
                            </motion.div>

                            <motion.h1
                                custom={1}
                                variants={fadeUpVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                    {t("hero.title")}
                                </span>
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-orange-300">
                                    {t("hero.titleHighlight")}
                                </span>
                            </motion.h1>

                            <motion.p
                                custom={2}
                                variants={fadeUpVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed"
                            >
                                {t("hero.description")}
                            </motion.p>                        <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full max-w-4xl"
                        >
                            <div className="bg-background border border-border rounded-2xl shadow-lg overflow-hidden">
                                {/* Tabs */}
                                <div className="flex border-b border-border">
                                    <button
                                        onClick={() => setActiveTab("surprise")}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors",
                                            activeTab === "surprise"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <Zap className="h-4 w-4" />
                                        {t("search.surpriseTrip")}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("classic")}
                                        className={cn(
                                            "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors",
                                            activeTab === "classic"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <MapPinIcon className="h-4 w-4" />
                                        {t("search.classicTrip")}
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="p-6">
                                    <div className={cn(
                                        "grid gap-4",
                                        activeTab === "surprise" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-4"
                                    )}>
                                        {/* Trip Type Field */}
                                        <div className="space-y-2 relative" ref={tripTypeDropdownRef}>
                                            <label className="text-sm font-medium text-foreground">
                                                {activeTab === "surprise" ? t("search.surpriseTripType") : t("search.tripType")}
                                            </label>
                                        <div className="relative">
                                            <Input
                                                    value={activeTab === "surprise" ? "Flight + Hotel" : selectedTripType}
                                                    readOnly
                                                    onClick={() => {
                                                        if (activeTab === "classic") {
                                                            if (tripTypeDropdownRef.current) {
                                                                const rect = tripTypeDropdownRef.current.getBoundingClientRect();
                                                                setTripTypeDropdownPosition({
                                                                    top: rect.bottom,
                                                                    left: rect.left,
                                                                    width: rect.width
                                                                });
                                                            }
                                                            setIsTripTypeDropdownOpen(!isTripTypeDropdownOpen);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "bg-card border-border text-card-foreground cursor-pointer",
                                                        activeTab === "surprise" ? "cursor-not-allowed opacity-75" : ""
                                                    )}
                                                />
                                                {activeTab === "classic" && (
                                                    <div className="absolute right-3 top-3 h-4 w-4 text-muted-foreground text-xs">
                                                        {isTripTypeDropdownOpen ? "▲" : "▼"}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    
                                        {/* From Field */}
                                        <div className="space-y-2 relative" ref={dropdownRef}>
                                            <label className="text-sm font-medium text-foreground">{t("search.from")}</label>
                                        <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                    ref={inputRef}
                                                    placeholder={activeTab === "surprise" ? t("search.selectDepartureCity") : "Search airports..."}
                                                    value={activeTab === "surprise" 
                                                        ? (selectedCity ? `${selectedCity}, ${selectedCountry}` : "")
                                                        : fromSearchText
                                                    }
                                                    onChange={activeTab === "classic" ? (e) => handleFromSearchChange(e.target.value) : undefined}
                                                    onClick={() => {
                                                        if (activeTab === "surprise") {
                                                            if (dropdownRef.current) {
                                                                const rect = dropdownRef.current.getBoundingClientRect();
                                                                setDropdownPosition({
                                                                    top: rect.bottom,
                                                                    left: rect.left,
                                                                    width: rect.width
                                                                });
                                                            }
                                                            setIsFromDropdownOpen(!isFromDropdownOpen);
                                                        }
                                                    }}
                                                    readOnly={activeTab === "surprise"}
                                                    className="pl-10 bg-card border-border text-card-foreground placeholder:text-muted-foreground cursor-pointer"
                                                />
                                                <div className="absolute right-3 top-3 h-4 w-4 text-muted-foreground">
                                                    {isFromDropdownOpen ? "▲" : "▼"}
                                                </div>
                                        </div>
                                    </div>
                                    
                                        {/* To Field - Only for Classic Trip */}
                                        {activeTab === "classic" && (
                                            <div className="space-y-2 relative" ref={toDropdownRef}>
                                                <label className="text-sm font-medium text-foreground">{t("search.to")}</label>
                                        <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                        placeholder="Search destinations..."
                                                        value={toSearchText}
                                                        onChange={(e) => handleToSearchChange(e.target.value)}
                                                        className="pl-10 bg-card border-border text-card-foreground placeholder:text-muted-foreground"
                                                    />
                                                    <div className="absolute right-3 top-3 h-4 w-4 text-muted-foreground text-xs">
                                                        {isToDropdownOpen ? "▲" : "▼"}
                                        </div>
                                    </div>
                                            </div>
                                        )}

                                        {/* Travelers Field - Only for Flight and Flight + Hotel in Classic Trip */}
                                        {activeTab === "surprise" || (activeTab === "classic" && (selectedTripType === "Flight" || selectedTripType === "Flight + Hotel")) ? (
                                            <div className="space-y-2 relative" ref={travelerDropdownRef}>
                                                <label className="text-sm font-medium text-foreground">{t("search.howManyAreYou")}</label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <div
                                                        className="pl-10 pr-10 h-9 bg-card border border-border text-card-foreground cursor-pointer rounded-md flex items-center justify-between text-sm"
                                                        onClick={() => {
                                                            if (travelerDropdownRef.current) {
                                                                const rect = travelerDropdownRef.current.getBoundingClientRect();
                                                                setTravelerDropdownPosition({
                                                                    top: rect.bottom,
                                                                    left: rect.left,
                                                                    width: rect.width
                                                                });
                                                            }
                                                            setIsTravelerDropdownOpen(!isTravelerDropdownOpen);
                                                        }}
                                                    >
                                                        <span>
                                                            {totalTravelers} {t("search.travelers")}
                                                        </span>
                                                        <div className="text-muted-foreground text-xs">
                                                            {isTravelerDropdownOpen ? "▲" : "▼"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Rooms Field - Only for Hotel and Flight + Hotel */}
                                        {activeTab === "classic" && (selectedTripType === "Hotel" || selectedTripType === "Flight + Hotel") && (
                                            <div className="space-y-2 relative">
                                                <label className="text-sm font-medium text-foreground">{t("search.rooms")}</label>
                                                <div className="relative">
                                                    <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <div
                                                        className="pl-10 pr-10 h-9 bg-card border border-border text-card-foreground cursor-pointer rounded-md flex items-center justify-between text-sm"
                                                        onClick={() => {
                                                            // Simple room selector - could be enhanced with dropdown
                                                            setRooms(prev => prev === 5 ? 1 : prev + 1);
                                                        }}
                                                    >
                                                        <span>
                                                            {rooms} {rooms === 1 ? "Room" : "Rooms"}
                                                        </span>
                                                        <div className="text-muted-foreground text-xs">
                                                            {rooms === 5 ? "1" : ">"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                                
                                <Button 
                                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl"
                                    onClick={() => {
                                        if (activeTab === "surprise") {
                                            // Save traveler information to localStorage
                                            const tripData = {
                                                tripType: "Flight + Hotel",
                                                from: selectedCity && selectedCountry ? `${selectedCity}, ${selectedCountry}` : "",
                                                travelers: totalTravelers,
                                                guests: guests
                                            };
                                            localStorage.setItem('tripData', JSON.stringify(tripData));
                                            window.location.href = "/surprise-trip";
                                        }
                                        // For classic trip, handle booking logic here
                                    }}
                                >
                                        {activeTab === "surprise" ? (
                                            <>
                                                <Zap className="mr-2 h-5 w-5" />
                                                {t("search.surpriseMe")}
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="mr-2 h-5 w-5" />
                                                {t("search.bookNow")}
                                            </>
                                        )}
                                </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </ImagesSlider>
            </section>

                        {/* How It Works */}
            <section id="how-it-works" className="py-20">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemFadeIn}>
                            <Badge className="mb-4">{t("howItWorks")}</Badge>
                        </motion.div>
                        <motion.h2 variants={itemFadeIn} className="text-3xl md:text-5xl font-bold mb-4">
                            {t("howItWorksSteps.title")}
                        </motion.h2>
                        <motion.p variants={itemFadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("howItWorksSteps.subtitle")}
                        </motion.p>
                    </motion.div>
                    
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            {
                                icon: <MapPin className="h-8 w-8 text-primary" />,
                                title: t("howItWorksSteps.step1.title"),
                                description: t("howItWorksSteps.step1.description")
                            },
                            {
                                icon: <Calendar className="h-8 w-8 text-primary" />,
                                title: t("howItWorksSteps.step2.title"),
                                description: t("howItWorksSteps.step2.description")
                            },
                            {
                                icon: <Users className="h-8 w-8 text-primary" />,
                                title: t("howItWorksSteps.step3.title"),
                                description: t("howItWorksSteps.step3.description")
                            },
                            {
                                icon: <Zap className="h-8 w-8 text-primary" />,
                                title: t("howItWorksSteps.step4.title"),
                                description: t("howItWorksSteps.step4.description")
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                variants={itemFadeIn}
                                whileHover={{ y: -5 }}
                                className="text-center p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mystery Destinations */}
            <section id="destinations" className="py-20 bg-muted/30">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemFadeIn}>
                            <Badge className="mb-4">{t("destinations")}</Badge>
                        </motion.div>
                        <motion.h2 variants={itemFadeIn} className="text-3xl md:text-5xl font-bold mb-4">
                            {t("popularDestinations.title")}
                        </motion.h2>
                        <motion.p variants={itemFadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("popularDestinations.subtitle")}
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {destinations.map((destination) => (
                            <motion.div
                                key={destination.id}
                                variants={itemFadeIn}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">{destination.name}</h3>
                                            <p className="text-sm text-white/80">{destination.country}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{destination.rating}</span>
                                            </div>
                                            <p className="text-xs text-white/70">({destination.reviews} reviews)</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/90 mb-3">{destination.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">{t("priceStartingAt")} ${destination.price}</span>
                                        <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                                            {t("bookMysteryTrip")}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemFadeIn}>
                            <Badge className="mb-4">{t("features.title")}</Badge>
                        </motion.div>
                        <motion.h2 variants={itemFadeIn} className="text-3xl md:text-5xl font-bold mb-4">
                            {t("features.subtitle")}
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: <Shield className="h-8 w-8 text-primary" />,
                                title: t("features.feature1.title"),
                                description: t("features.feature1.description")
                            },
                            {
                                icon: <Clock className="h-8 w-8 text-primary" />,
                                title: t("features.feature2.title"),
                                description: t("features.feature2.description")
                            },
                            {
                                icon: <Award className="h-8 w-8 text-primary" />,
                                title: t("features.feature3.title"),
                                description: t("features.feature3.description")
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemFadeIn}
                                whileHover={{ y: -5 }}
                                className="text-center p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center text-primary-foreground"
                    >
                        <motion.h2 variants={itemFadeIn} className="text-3xl md:text-5xl font-bold mb-4">
                            Ready for Your Mystery Adventure?
                        </motion.h2>
                        <motion.p variants={itemFadeIn} className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                            Join thousands of adventurers who have discovered amazing destinations with us. Your next surprise awaits!
                        </motion.p>
                        <motion.div variants={itemFadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="font-semibold">
                                <Phone className="mr-2 h-5 w-5" />
                                Contact Us
                            </Button>
                            <Button size="lg" variant="outline" className="font-semibold border-white text-white hover:bg-white hover:text-primary">
                                Book Mystery Trip
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t py-12">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div 
                                className="flex items-center gap-3 cursor-pointer pl-4"
                                onClick={() => window.location.href = '/'}
                            >
                                <Image
                                    src="/2.svg"
                                    alt="DejaBooom Logo"
                                    width={200}
                                    height={80}
                                    className="h-36 w-auto"
                                    style={{ 
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <p className="text-muted-foreground">
                                {t("footer.trusted")}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#destinations" className="hover:text-foreground transition-colors">{t("destinations")}</a></li>
                                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                                <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Cancellation Policy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Travel Insurance</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-4">Contact Info</h3>
                            <div className="space-y-3 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>hello@dejabooom.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>123 Adventure St, Mystery City</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} DejaBooom. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Dropdown Portal */}
            {isFromDropdownOpen && createPortal(
                <div 
                    data-dropdown="from-field"
                    className="fixed bg-popover border border-border rounded-md shadow-2xl z-[99999] max-h-80 overflow-y-auto"
                    style={{
                        top: `${dropdownPosition.top + 4}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`
                    }}
                >
                    {activeTab === "surprise" ? (
                        <div className="flex">
                            {/* Countries Column */}
                            <div className="flex-1 border-r border-border">
                                <div className="p-2 bg-muted/30">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {settings.language === "es" ? "Países" : "Countries"}
                                    </div>
                                </div>
                                {Object.keys(countriesAndCities).map((country) => (
                                    <button
                                        key={country}
                                        onClick={() => setSelectedCountry(country)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                            selectedCountry === country ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                                        )}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Cities Column */}
                            <div className="flex-1">
                                <div className="p-2 bg-muted/30">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {settings.language === "es" ? "Ciudades" : "Cities"}
                                    </div>
                                </div>
                                {selectedCountry && countriesAndCities[selectedCountry as keyof typeof countriesAndCities]?.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setIsFromDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="p-2 bg-muted/30">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {settings.language === "es" ? "Aeropuertos" : "Airports"}
                                </div>
                            </div>
                            {filteredAirports.length > 0 ? (
                                filteredAirports.map((airport) => (
                                    <button
                                        key={airport.code}
                                        onClick={() => {
                                            setFromSearchText(`${airport.name} (${airport.code})`);
                                            setIsFromDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors"
                                    >
                                        <div className="font-medium">{airport.name} ({airport.code})</div>
                                        <div className="text-xs text-muted-foreground">{airport.city}</div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                    {fromSearchText.length < 3 
                                        ? "Type at least 3 characters to search airports"
                                        : "No airports found"
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Trip Type Dropdown Portal */}
            {isTripTypeDropdownOpen && createPortal(
                <div 
                    data-dropdown="trip-type-field"
                    className="fixed bg-popover border border-border rounded-md shadow-2xl z-[99999]"
                    style={{
                        top: `${tripTypeDropdownPosition.top + 4}px`,
                        left: `${tripTypeDropdownPosition.left}px`,
                        width: `${tripTypeDropdownPosition.width}px`
                    }}
                >
                    {tripTypes.map((tripType) => (
                        <button
                            key={tripType}
                            onClick={() => {
                                setSelectedTripType(tripType);
                                setIsTripTypeDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors"
                        >
                            {tripType}
                        </button>
                    ))}
                </div>,
                document.body
            )}

            {/* To Dropdown Portal */}
            {isToDropdownOpen && createPortal(
                <div 
                    data-dropdown="to-field"
                    className="fixed bg-popover border border-border rounded-md shadow-2xl z-[99999] max-h-80 overflow-y-auto"
                    style={{
                        top: `${toDropdownPosition.top + 4}px`,
                        left: `${toDropdownPosition.left}px`,
                        width: `${toDropdownPosition.width}px`
                    }}
                >
                    <div className="flex">
                        {/* Regions Column */}
                        <div className="flex-1 border-r border-border">
                            <div className="p-2 bg-muted/30">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {settings.language === "es" ? "Regiones" : "Regions"}
                                </div>
                            </div>
                            {Object.keys(destinationOptions).map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setSelectedToCountry(region)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                        selectedToCountry === region ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                                    )}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                        
                        {/* Destinations Column */}
                        <div className="flex-1">
                            <div className="p-2 bg-muted/30">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {settings.language === "es" ? "Destinos" : "Destinations"}
                                </div>
                            </div>
                            {selectedToCountry && destinationOptions[selectedToCountry as keyof typeof destinationOptions]?.map((destination) => (
                                <button
                                    key={destination}
                                    onClick={() => {
                                        setSelectedToCity(destination);
                                        setIsToDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-popover-foreground transition-colors"
                                >
                                    {destination}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Traveler Dropdown Portal */}
            {isTravelerDropdownOpen && createPortal(
                <div 
                    data-dropdown="traveler-field"
                    className="fixed bg-popover border border-border rounded-md shadow-2xl z-[99999] w-80 overflow-hidden"
                    style={{
                        top: `${travelerDropdownPosition.top + 4}px`,
                        left: `${travelerDropdownPosition.left}px`,
                        width: `${travelerDropdownPosition.width}px`
                    }}
                >
                    {/* Adults Section */}
                    <div className="p-3 border-b border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-foreground text-sm">{t("search.adults")}</div>
                                <div className="text-xs text-muted-foreground">{t("search.adultsAge")}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateTravelers('adults', -1)}
                                    disabled={guests.adults <= 0}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center font-medium text-sm">{guests.adults}</span>
                                <button
                                    onClick={() => updateTravelers('adults', 1)}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Kids Section */}
                    <div className="p-3 border-b border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-foreground text-sm">{t("search.kids")}</div>
                                <div className="text-xs text-muted-foreground">{t("search.kidsAge")}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateTravelers('kids', -1)}
                                    disabled={guests.kids <= 0}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center font-medium text-sm">{guests.kids}</span>
                                <button
                                    onClick={() => updateTravelers('kids', 1)}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Babies Section */}
                    <div className="p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-foreground text-sm">{t("search.babies")}</div>
                                <div className="text-xs text-muted-foreground">{t("search.babiesAge")}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateTravelers('babies', -1)}
                                    disabled={guests.babies <= 0}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center font-medium text-sm">{guests.babies}</span>
                                <button
                                    onClick={() => updateTravelers('babies', 1)}
                                    className="w-7 h-7 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
