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
