import { useCallback } from 'react';
import type { Language } from '@/components/site-settings';

export const translations = {
    en: {
        language: "Language",
        currency: "Currency",
        english: "English",
        spanish: "Spanish",
        destinations: "Destinations",
        howItWorks: "How It Works",
        about: "About",
        contact: "Contact",
        signIn: "Sign In",
        bookNow: "Book Now",
        nav: {
            home: "Home",
            about: "About",
            services: "Services",
            contact: "Contact",
            signIn: "Sign In",
            bookNow: "Book Now"
        },
        bookMysteryTrip: "Book Mystery Trip",
        findMyMysteryTrip: "Find My Mystery Trip",
        searchPlaceholder: "Enter your search...",
        priceStartingAt: "Starting at",
        reviews: "Reviews",
        quickLinks: "Quick Links",
        aboutUs: "About Us",
        footer: {
            trusted: "Your trusted partner for unforgettable surprise travel experiences.",
            quickLinks: "Quick Links",
            contacts: "Contacts",
            subscribeButton: "Subscribe",
            subscribeText: "Subscribe to our newsletter for travel updates and special offers.",
            enterEmail: "Enter your email"
        },
        hero: {
            tagline: "The Ultimate Surprise Travel Experience",
            title: "Your Next Adventure",
            titleHighlight: "Is A Mystery",
            description: "Book a surprise trip and discover your destination just 48 hours before departure. Let us create an unforgettable adventure for you.",
            cta: "Start Your Adventure"
        },
        search: {
            anywhere: "Anywhere",
            searchDestination: "Search destinations...",
            dateRange: "Select dates",
            guests: "Add guests",
            search: "Search",
            startDate: "Start date",
            endDate: "End date",
            guestsCount: "Guests",
            departureCity: "Departure City",
            surpriseTrip: "Surprise Trip",
            classicTrip: "Classic Trip",
            surpriseTripType: "Surprise trip type:",
            tripType: "Trip type:",
            from: "From:",
            howManyAreYou: "How many are you?",
            surpriseMe: "Surprise me!",
            selectDepartureCity: "Select departure city",
            travelers: "travellers",
            adults: "Adults",
            kids: "Kids",
            babies: "Babies",
            adultsAge: "12 years or older",
            kidsAge: "2 to 11 years",
            babiesAge: "0 to 2 years",
            to: "To:",
            selectDestination: "Select destination",
            bookNow: "Book now",
            flight: "Flight",
            hotel: "Hotel",
            flightAndHotel: "Flight + Hotel",
            rooms: "Rooms"
        },
        features: {
            title: "Why Choose Us",
            subtitle: "Discover what makes our mystery trips special",
            feature1: {
                title: "Curated Destinations",
                description: "Carefully selected locations that promise unique experiences"
            },
            feature2: {
                title: "Best Value",
                description: "Competitive prices with no compromise on quality"
            },
            feature3: {
                title: "24/7 Support",
                description: "Round-the-clock assistance for peace of mind"
            }
        },
        howItWorksSteps: {
            title: "How It Works",
            subtitle: "Your journey to an unforgettable surprise adventure in 4 simple steps",
            step1: {
                title: "Set your trip up",
                description: "Choose your departure city and let us know your travel preferences"
            },
            step2: {
                title: "Choose your dates",
                description: "Select your travel dates and we'll handle the rest of the planning"
            },
            step3: {
                title: "Personalize it",
                description: "Tell us about your interests and we'll customize your experience"
            },
            step4: {
                title: "Surprise",
                description: "Discover your destination just 48 hours before departure"
            }
        },
        popularDestinations: {
            title: "Popular Destinations",
            subtitle: "Explore our most loved mystery locations",
            viewAll: "View All Destinations",
            mysteryDestination: "Mystery Destination",
            southernEurope: "Southern Europe",
            southeastAsia: "Southeast Asia",
            eastAsia: "East Asia",
            westernEurope: "Western Europe",
            experienceCharm: "Experience the charm of Southern Europe",
            discoverWonders: "Discover the wonders of Southeast Asia",
            immerseCulture: "Immerse yourself in East Asian culture",
            exploreHeart: "Explore the heart of Western Europe"
        },
        surpriseTrip: {
            badge: "Surprise Trip",
            title: "Choose Your Adventure",
            subtitle: "Select your surprise destination and let us create an unforgettable experience for you",
            continue: "Continue",
            selectDestination: "Select a destination to continue",
            canada: {
                title: "Surprise in Canada",
                description: "Discover the beauty of the Great White North",
                price: "from $299"
            },
            usa: {
                title: "Surprise in USA",
                description: "Experience the American dream in iconic cities",
                price: "from $399"
            },
            mexico: {
                title: "Surprise in Mexico",
                description: "Explore vibrant culture and stunning beaches",
                price: "from $249"
            },
            caribbean: {
                title: "Surprise in the Caribbean",
                description: "Relax in paradise with crystal clear waters",
                price: "from $349"
            }
        },
        // Personalize page translations
        personalize: {
            badge: "Personalize",
            title: "Personalize Your Trip",
            subtitle: "Tell us about your preferences so we can create the perfect surprise trip for you",
            continue: "Get My Surprise Trip",
            goBack: "Go Back",
            selectOptions: "Select Options",
            interests: "Your Interests",
            interestsDescription: "What type of experiences are you looking for?",
            activities: "Preferred Activities",
            activitiesDescription: "What activities would you like to include?",
            budget: "Budget Preference",
            budgetDescription: "How much would you like to spend on activities and extras?",
            travelStyle: "Travel Style",
            travelStyleDescription: "How do you prefer to travel?"
        },
        // Payment page translations
        payment: {
            badge: "Payment",
            title: "Complete Your Payment",
            subtitle: "Secure payment to confirm your surprise trip booking",
            paymentDetails: "Payment Details",
            cardNumber: "Card Number",
            expiryDate: "Expiry Date",
            cvv: "CVV",
            cardName: "Cardholder Name",
            cardNamePlaceholder: "John Doe",
            contactInfo: "Contact Information",
            email: "Email Address",
            phone: "Phone Number",
            agreeTerms: "I agree to the Terms and Conditions and Privacy Policy",
            orderSummary: "Order Summary",
            dates: "Travel Dates",
            duration: "Duration",
            interests: "Your Interests",
            security: "Security Features",
            securePayment: "Secure payment processing",
            encryptedData: "Your data is encrypted and protected",
            guarantee: "100% money-back guarantee",
            goBack: "Go Back",
            payNow: "Pay Now",
            completeForm: "Complete Form",
            successMessage: "Payment successful! Your surprise trip is confirmed.",
            basePrice: "Base Price",
            datePrice: "Date Price",
            travelers: "Travelers",
            adults: "adults",
            totalNights: "Total Nights",
            nights: "nights",
            total: "Total",
            traveler1: "Traveler 1",
            traveler2: "Traveler 2",
            traveler3: "Traveler 3",
            traveler4: "Traveler 4",
            firstName: "First Name",
            lastName: "Last Name",
            passportNumber: "Passport Number",
            confirmationTitle: "Booking Confirmed!",
            confirmationSubtitle: "Your surprise trip has been successfully booked. Get ready for an amazing adventure!",
            viewBooking: "View Booking",
            exploreMore: "Explore More"
        },
        timeline: {
            step1: {
                title: "Trip Type",
                description: "Flight + Hotel, 2 travelers"
            },
            step2: {
                title: "Surprise Trip",
                description: "Choose destination"
            },
            step3: {
                title: "Dates",
                description: "Select travel dates"
            },
            step4: {
                title: "Personalize it",
                description: "Customize your trip"
            },
            step5: {
                title: "Payment",
                description: "Complete booking",
                completed: "Payment completed"
            }
        },
        dates: {
            badge: "Select Dates",
            title: "Choose Your Travel Dates",
            subtitle: "Select your departure and return dates to see available prices",
            continue: "Continue",
            selectDates: "Select your travel dates to continue",
            goBack: "Go Back",
            duration: "Trip Duration",
            days2: "2 nights",
            days3: "3 nights",
            days4: "4 nights",
            days5: "5 nights",
            calendar: {
                january: "January",
                february: "February",
                march: "March",
                april: "April",
                may: "May",
                june: "June",
                july: "July",
                august: "August",
                september: "September",
                october: "October",
                november: "November",
                december: "December",
                sun: "Sun",
                mon: "Mon",
                tue: "Tue",
                wed: "Wed",
                thu: "Thu",
                fri: "Fri",
                sat: "Sat"
            }
        }
    },
    es: {
        language: "Idioma",
        currency: "Moneda",
        english: "Inglés",
        spanish: "Español",
        destinations: "Destinos",
        howItWorks: "Cómo Funciona",
        about: "Nosotros",
        contact: "Contacto",
        signIn: "Iniciar Sesión",
        bookNow: "Reservar Ahora",
        nav: {
            home: "Inicio",
            about: "Acerca de",
            services: "Servicios",
            contact: "Contacto",
            signIn: "Iniciar Sesión",
            bookNow: "Reservar Ahora"
        },
        bookMysteryTrip: "Reservar Viaje Sorpresa",
        findMyMysteryTrip: "Encontrar Mi Viaje Sorpresa",
        searchPlaceholder: "Ingresa tu búsqueda...",
        priceStartingAt: "Desde",
        reviews: "Reseñas",
        quickLinks: "Enlaces Rápidos",
        aboutUs: "Sobre Nosotros",
        footer: {
            trusted: "Tu socio de confianza para experiencias de viajes sorpresa inolvidables.",
            quickLinks: "Enlaces Rápidos",
            contacts: "Contactos",
            subscribeButton: "Suscríbete",
            subscribeText: "Suscríbete a nuestro boletín para recibir actualizaciones de viajes y ofertas especiales.",
            enterEmail: "Ingresa tu correo"
        },
        hero: {
            tagline: "La Última Experiencia en Viajes Sorpresa",
            title: "Tu Próxima Aventura",
            titleHighlight: "Es Un Misterio",
            description: "Reserva un viaje sorpresa y descubre tu destino solo 48 horas antes de la salida. Déjanos crear una aventura inolvidable para ti.",
            cta: "Comienza tu Aventura"
        },
        search: {
            anywhere: "Cualquier destino",
            searchDestination: "Buscar destinos...",
            dateRange: "Seleccionar fechas",
            guests: "Agregar huéspedes",
            search: "Buscar",
            startDate: "Fecha de inicio",
            endDate: "Fecha de fin",
            guestsCount: "Huéspedes",
            departureCity: "Ciudad de Salida",
            surpriseTrip: "Viaje Sorpresa",
            classicTrip: "Viaje Clásico",
            surpriseTripType: "Tipo de viaje sorpresa:",
            tripType: "Tipo de viaje:",
            from: "Desde:",
            howManyAreYou: "¿Cuántos son ustedes?",
            surpriseMe: "¡Sorpréndeme!",
            selectDepartureCity: "Seleccionar ciudad de salida",
            travelers: "viajeros",
            adults: "Adultos",
            kids: "Niños",
            babies: "Bebés",
            adultsAge: "12 años o más",
            kidsAge: "2 a 11 años",
            babiesAge: "0 a 2 años",
            to: "Hacia:",
            selectDestination: "Seleccionar destino",
            bookNow: "Reservar ahora",
            flight: "Vuelo",
            hotel: "Hotel",
            flightAndHotel: "Vuelo + Hotel",
            rooms: "Habitaciones"
        },
        features: {
            title: "¿Por Qué Elegirnos?",
            subtitle: "Descubre qué hace especiales nuestros viajes sorpresa",
            feature1: {
                title: "Destinos Seleccionados",
                description: "Ubicaciones cuidadosamente elegidas que prometen experiencias únicas"
            },
            feature2: {
                title: "Mejor Valor",
                description: "Precios competitivos sin comprometer la calidad"
            },
            feature3: {
                title: "Soporte 24/7",
                description: "Asistencia las 24 horas para tu tranquilidad"
            }
        },
        howItWorksSteps: {
            title: "Cómo Funciona",
            subtitle: "Tu viaje hacia una aventura sorpresa inolvidable en 4 simples pasos",
            step1: {
                title: "Configura tu viaje",
                description: "Elige tu ciudad de salida y cuéntanos tus preferencias de viaje"
            },
            step2: {
                title: "Elige tus fechas",
                description: "Selecciona tus fechas de viaje y nosotros nos encargamos del resto de la planificación"
            },
            step3: {
                title: "Personalízalo",
                description: "Cuéntanos sobre tus intereses y personalizaremos tu experiencia"
            },
            step4: {
                title: "Sorpresa",
                description: "Descubre tu destino solo 48 horas antes de la salida"
            }
        },
        popularDestinations: {
            title: "Destinos Populares",
            subtitle: "Explora nuestras ubicaciones misteriosas más amadas",
            viewAll: "Ver Todos los Destinos",
            mysteryDestination: "Destino Misterioso",
            southernEurope: "Europa del Sur",
            southeastAsia: "Sudeste Asiático",
            eastAsia: "Asia Oriental",
            westernEurope: "Europa Occidental",
            experienceCharm: "Experimenta el encanto de Europa del Sur",
            discoverWonders: "Descubre las maravillas del Sudeste Asiático",
            immerseCulture: "Sumérgete en la cultura de Asia Oriental",
            exploreHeart: "Explora el corazón de Europa Occidental"
        },
        surpriseTrip: {
            badge: "Viaje Sorpresa",
            title: "Elige Tu Aventura",
            subtitle: "Selecciona tu destino sorpresa y déjanos crear una experiencia inolvidable para ti",
            continue: "Continuar",
            selectDestination: "Selecciona un destino para continuar",
            canada: {
                title: "Sorpresa en Canadá",
                description: "Descubre la belleza del Gran Norte Blanco",
                price: "desde $299"
            },
            usa: {
                title: "Sorpresa en USA",
                description: "Vive el sueño americano en ciudades icónicas",
                price: "desde $399"
            },
            mexico: {
                title: "Sorpresa en México",
                description: "Explora la vibrante cultura y playas impresionantes",
                price: "desde $249"
            },
            caribbean: {
                title: "Sorpresa en el Caribe",
                description: "Relájate en el paraíso con aguas cristalinas",
                price: "desde $349"
            }
        },
        // Personalize page translations (Spanish)
        personalize: {
            badge: "Personaliza",
            title: "Personaliza Tu Viaje",
            subtitle: "Cuéntanos sobre tus preferencias para crear el viaje sorpresa perfecto para ti",
            continue: "Obtener Mi Viaje Sorpresa",
            goBack: "Regresar",
            selectOptions: "Seleccionar Opciones",
            interests: "Tus Intereses",
            interestsDescription: "¿Qué tipo de experiencias buscas?",
            activities: "Actividades Preferidas",
            activitiesDescription: "¿Qué actividades te gustaría incluir?",
            budget: "Preferencia de Presupuesto",
            budgetDescription: "¿Cuánto te gustaría gastar en actividades y extras?",
            travelStyle: "Estilo de Viaje",
            travelStyleDescription: "¿Cómo prefieres viajar?"
        },
        // Payment page translations (Spanish)
        payment: {
            badge: "Pago",
            title: "Completa Tu Pago",
            subtitle: "Pago seguro para confirmar tu reserva de viaje sorpresa",
            paymentDetails: "Detalles del Pago",
            cardNumber: "Número de Tarjeta",
            expiryDate: "Fecha de Vencimiento",
            cvv: "CVV",
            cardName: "Nombre del Titular",
            cardNamePlaceholder: "Juan Pérez",
            contactInfo: "Información de Contacto",
            email: "Correo Electrónico",
            phone: "Número de Teléfono",
            agreeTerms: "Acepto los Términos y Condiciones y la Política de Privacidad",
            orderSummary: "Resumen del Pedido",
            dates: "Fechas de Viaje",
            duration: "Duración",
            interests: "Tus Intereses",
            security: "Características de Seguridad",
            securePayment: "Procesamiento de pago seguro",
            encryptedData: "Tus datos están encriptados y protegidos",
            guarantee: "Garantía de devolución del 100%",
            goBack: "Regresar",
            payNow: "Pagar Ahora",
            completeForm: "Completar Formulario",
            successMessage: "¡Pago exitoso! Tu viaje sorpresa está confirmado.",
            basePrice: "Precio Base",
            datePrice: "Precio de Fecha",
            travelers: "Viajeros",
            adults: "adultos",
            totalNights: "Noches Totales",
            nights: "noches",
            total: "Total",
            traveler1: "Viajero 1",
            traveler2: "Viajero 2",
            traveler3: "Viajero 3",
            traveler4: "Viajero 4",
            firstName: "Nombre",
            lastName: "Apellido",
            passportNumber: "Número de Pasaporte",
            confirmationTitle: "¡Reserva Confirmada!",
            confirmationSubtitle: "Tu viaje sorpresa ha sido reservado exitosamente. ¡Prepárate para una aventura increíble!",
            viewBooking: "Ver Reserva",
            exploreMore: "Explorar Más"
        },
        timeline: {
            step1: {
                title: "Tipo de Viaje",
                description: "Vuelo + Hotel, 2 viajeros"
            },
            step2: {
                title: "Viaje Sorpresa",
                description: "Elegir destino"
            },
            step3: {
                title: "Fechas",
                description: "Seleccionar fechas de viaje"
            },
            step4: {
                title: "Personalízalo",
                description: "Personaliza tu viaje"
            },
            step5: {
                title: "Pago",
                description: "Completar reserva",
                completed: "Pago completado"
            }
        },
        dates: {
            badge: "Seleccionar Fechas",
            title: "Elige Tus Fechas de Viaje",
            subtitle: "Selecciona tus fechas de salida y regreso para ver los precios disponibles",
            continue: "Continuar",
            selectDates: "Selecciona tus fechas de viaje para continuar",
            goBack: "Regresar",
            duration: "Duración del Viaje",
            days2: "2 noches",
            days3: "3 noches",
            days4: "4 noches",
            days5: "5 noches",
            calendar: {
                january: "Enero",
                february: "Febrero",
                march: "Marzo",
                april: "Abril",
                may: "Mayo",
                june: "Junio",
                july: "Julio",
                august: "Agosto",
                september: "Septiembre",
                october: "Octubre",
                november: "Noviembre",
                december: "Diciembre",
                sun: "Dom",
                mon: "Lun",
                tue: "Mar",
                wed: "Mié",
                thu: "Jue",
                fri: "Vie",
                sat: "Sáb"
            }
        }
    }
};

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof translations.en>;

export function useTranslations(language: Language) {
    const t = useCallback((key: TranslationKey) => {
        const keys = key.split('.');
        let translation: any = translations[language];
        for (const k of keys) {
            translation = translation[k];
        }
        return translation || key;
    }, [language]);

    return t;
}
