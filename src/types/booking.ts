export interface PartyComposition {
    adults: number
    childAges: number[]
    infants: number
}

export interface BookingRequest {
    bookingType: string
    location: string
    departureDate: string
    duration: number
    gateway: string
    partyCompositions: PartyComposition[]
}

export interface BookingResponse {
    holidays: Holiday[]
}

export interface Sector {
    airline: string;
    airlineName: string;
    cabinClass: string;
    flightNumber: string;
    stops: number;
    operatingAirline: string;
    operatingAirlineName: string;
    from: string;
    to: string;
    departureAirport: string;
    departureAirportCode: string;
    arrivalAirport: string;
    arrivalAirportCode: string;
}

export interface FlightInfo {
    airline: string;
    airlineName: string;
    cabinClass: string;
    departureAirport: string;
    departureAirportCode: string;
    arrivalAirport: string;
    arrivalAirportCode: string;
    sectors: Sector[];
}

export interface Holiday {
    totalPrice: number
    pricePerPerson: number
    flyingClubMiles: number
    virginPoints: number
    tierPoints: number
    departureDate: string
    selectedDate: string
    hotel: Hotel
    inboundFlight: FlightInfo
    outboundFlight: FlightInfo
    webDiscount: number
    transfer: TransferInfo
}

export interface TransferInfo {
    name: string;
    transferMode: string;
}

export interface Hotel {
    id: string
    name: string
    boardBasis: string
    content: HotelContent
    tripAdvisor: TripAdvisor;
}

export interface TripAdvisor {
    numReviews: number;
    ratingImageUrl: string;
}

export interface HotelContent {
    name: string
    vRating: number | string
    hotelDescription: string
    atAGlance: string[]
    parentLocation: string
    images: HotelImage[]
    holidayType: string[]
    boardBasis: string[]
    hotelLocation: string[]
    accommodationType: string[]
    hotelFacilities: string[]
    starRating: number | string
    propertyType: string
}

export interface HotelImage {
    IMAGE_DESCRIPTION: string
    RESULTS_CAROUSEL: Image
}

export interface Image {
    url: string
}