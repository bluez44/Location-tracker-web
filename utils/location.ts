interface NominatimAddress {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    [key: string]: any;
}

interface NominatimResponse {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: NominatimAddress;
    boundingbox: [string, string, string, string];
    [key: string]: any;
}

const getAddressFromLatLong = async (
    lat: number,
    lon: number
): Promise<NominatimResponse> => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data: NominatimResponse = await response.json();
    return data;
}

export { getAddressFromLatLong };