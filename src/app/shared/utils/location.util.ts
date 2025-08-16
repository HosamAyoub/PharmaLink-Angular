/**
 * Location utility functions for getting city information from coordinates
 */

export interface LocationInfo {
  houseNumber?: string;
  road?: string;
  state: string;
  country: string;
  fullAddress: string;
}

/**
 * Core function to fetch geocoding data from coordinates
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns Promise with raw geocoding data
 */
async function fetchGeocodingData(lat: number, lng: number): Promise<any> {
  const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
  const response = await fetch(geocodingUrl);
  return response.json();
}

/**
 * Parse address data from geocoding response
 * @param data - Raw geocoding response
 * @returns Parsed location info
 */
function parseLocationData(data: any): LocationInfo {
  if (!data?.address) {
    return {
      state: 'Unknown state',
      country: 'Unknown country',
      fullAddress: 'Unknown address',
    };
  }

  return {
    houseNumber: data.address.house_number || undefined,
    road: data.address.road || undefined,
    state: data.address.state || data.address.state_district || 'Unknown state',
    country: data.address.country || 'Unknown country',
    fullAddress: data.display_name || 'Unknown address',
  };
}

/**
 * Get detailed location information with house_number, road, state, country
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns Promise with detailed location information
 */
export async function getLocationInfo(
  lat: number,
  lng: number
): Promise<LocationInfo> {
  try {
    const data = await fetchGeocodingData(lat, lng);
    return parseLocationData(data);
  } catch (error) {
    console.error('Error getting location information:', error);
    return {
      state: 'Error getting location',
      country: 'Error getting location',
      fullAddress: 'Error getting location',
    };
  }
}

/**
 * Print accurate user location with house_number, road, state, country
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 */
export async function printFullAddress(
  lat: number,
  lng: number
): Promise<void> {
  try {
    const locationInfo = await getLocationInfo(lat, lng);

    const locationParts = [
      locationInfo.houseNumber,
      locationInfo.road,
      locationInfo.state,
      locationInfo.country,
    ].filter((part) => part && part.trim() !== '');

    const userLocation = locationParts.join(', ');
    console.log(`User City: ${userLocation}`);
  } catch (error) {
    console.error('Error getting city information:', error);
    console.log('User City: Error getting location');
  }
}

/**
 * Get state/governorate name from coordinates
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns Promise with state name
 */
export async function getStateName(lat: number, lng: number): Promise<string> {
  try {
    const locationInfo = await getLocationInfo(lat, lng);
    return locationInfo.state;
  } catch (error) {
    console.error('Error getting state information:', error);
    return 'Error getting state';
  }
}
