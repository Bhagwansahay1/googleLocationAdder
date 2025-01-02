import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_MAP_API_KEY } from '@env';

export const fetchCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            error => reject(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};

export const fetchAddress = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
        );
        const addressComponents = response.data.results[0]?.address_components || [];
        const formattedAddress = response.data.results[0]?.formatted_address || 'Unknown Location';
        return {
            main: addressComponents[0]?.long_name || 'Current Location',
            sub: formattedAddress,
        };
    } catch (error) {
        console.error('Error fetching address:', error);
        return { main: 'Unknown Location', sub: 'Unable to fetch address' };
    }
};

export const fetchPlaceDetails = async (placeId) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_API_KEY}`
        );
        const { lat, lng } = response.data.result.geometry.location;
        const formattedAddress = response.data.result.formatted_address || 'Unknown Address';
        return {
            locationData: { latitude: lat, longitude: lng },
            address: { main: formattedAddress, sub: formattedAddress },
        };
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};

export const fetchCoordinatesFromAddress = async (addressData) => {
    try {
        const fullAddress = `${addressData.houseNumber}, ${addressData.buildingName}, ${addressData.addressLine1}, ${addressData.city}, ${addressData.state}, ${addressData.pincode}`;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_MAP_API_KEY}`
        );
        if (response.data.status === 'OK') {
            const { lat, lng } = response.data.results[0].geometry.location;
            return {
                latitude: lat,
                longitude: lng,
                main: response.data.results[0]?.formatted_address || 'Unknown Address',
                sub: `Pincode: ${addressData.pincode}`,
            };
        } else {
            throw new Error('Geocoding failed');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

export const sortAddresses = (addresses) => {
    return [...addresses].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      
      return b.id.localeCompare(a.id);
    });
  };
