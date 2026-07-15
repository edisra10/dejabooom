export interface Destination {
    id: number;
    name: string;
    country: string;
    image: string;
    price: number;
    rating: number;
    reviews: number;
    description: string;
}

export interface TravelBookingLandingProps {
    destinations?: Destination[];
    heroImages?: string[];
}

export interface GuestCounts {
    adults: number;
    kids: number;
    babies: number;
}

export interface TripData {
    tripType: string;
    from: string;
    travelers: number;
    guests: GuestCounts;
}

export interface SelectedTrip {
    id: string;
    title: string;
    description: string;
    priceUSD: number;
    image: string;
    region: string;
}

export interface SelectedDates {
    start: Date | null;
    end: Date | null;
}

export interface StoredSelectedDates {
    start: string | null;
    end: string | null;
}

export type PersonalizationBudget = "low" | "medium" | "high";
export type AccommodationPreference = "hotel" | "apartment" | "hostel" | "resort";
export type TravelStyle = "relaxed" | "balanced" | "adventurous";
export type GroupType = "solo" | "couple" | "family" | "friends";

export interface PersonalizationData {
    interests: string[];
    budget: PersonalizationBudget;
    accommodation: AccommodationPreference;
    activities: string[];
    travelStyle: TravelStyle;
    groupType: GroupType;
}

export interface TravelerData {
    firstName: string;
    lastName: string;
    passport: string;
}

export type TravelerFormData = Partial<TravelerData>;

export interface PaymentState {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
    email: string;
    phone: string;
    countryCode: string;
    travelers: Record<number, TravelerFormData>;
    agreeTerms: boolean;
}
