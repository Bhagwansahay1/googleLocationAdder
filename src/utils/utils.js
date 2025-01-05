import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_MAP_API_KEY, IP_GEO_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// export const fetchUserLocationWithIP = async () => {
//     try {
//         const response = await axios.get(
//             `https://api.ipgeolocation.io/ipgeo?apiKey=${IP_GEO_API_KEY}`
//         );
//         if (response.data) {
//             console.log(response.data);
//             const { latitude, longitude } = response.data;
//             return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
//         }
//     } catch (error) {
//         console.error('Error fetching user location by IP:', error);
//         alert('Unable to fetch location.');
//     }
// };

export const fetchUserLocationWithIP = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('userLocation');
      
      if (storedLocation) {
        const location = JSON.parse(storedLocation);
        return location;
      }
      const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${IP_GEO_API_KEY}`);
      if (response.data) {
        const { latitude, longitude } = response.data;
        const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        await AsyncStorage.setItem('userLocation', JSON.stringify(location));
        return location;
      }
    } catch (error) {
      console.error('Error fetching user location by IP:', error);
      alert('Unable to fetch location.');
    }
  };

export const fetchAddressSuggestions = async (text, userLocation) => {
    console.log("here is run",text,userLocation)
    if (text.length > 2 && userLocation) {
        const { latitude, longitude } = userLocation;
        const locationBias = `${latitude},${longitude}`;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&location=${locationBias}&radius=5000&key=${GOOGLE_MAP_API_KEY}`;
        try {
            const response = await axios.get(url);
            console.log(response,"response")
            return response.data.predictions || [];
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            return [];
        }
    } else {
        return [];
    }
};

export const fetchCityAndState = async (pincode) => {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
            const { District, State } = data[0].PostOffice[0];
            return { city: District, state: State };
        } else {
            Alert.alert("Invalid Pincode", "Please enter a valid pincode.");
            return { city: "", state: "" };
        }
    } catch (error) {
        console.error("Error fetching city and state:", error);
        return { city: "", state: "" };
    }
};

// Debounce function
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const sortAddresses = (addresses) => {
    return [...addresses].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;

        return b.id.localeCompare(a.id);
    });
};
