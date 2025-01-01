import { useState, useEffect } from 'react';
import { fetchAddress, fetchCoordinatesFromAddress, fetchCurrentLocation, fetchPlaceDetails } from '../utils/utils';

export const useLocationInitialization = (params) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ main: '', sub: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLocation = async () => {
      setIsLoading(true);
      try {
        const { placeId, isAutocomplete, addressData, savedAddress } = params || {};
        
        // Reset states when params change
        setLocation(null);
        setAddress({ main: '', sub: '' });

        if (savedAddress) {
          const { main, sub, location } = savedAddress;
          setAddress({ main, sub });
          setLocation(location);
        } else if (isAutocomplete && placeId) {
          const { locationData, address } = await fetchPlaceDetails(placeId);
          setLocation(locationData);
          setAddress(address);
        } else if (addressData) {
          const locationData = await fetchCoordinatesFromAddress(addressData.addressDetails);
          setLocation({ 
            latitude: locationData.latitude, 
            longitude: locationData.longitude 
          });
          setAddress({
            main: locationData.main,
            sub: locationData.sub
          });
        } else {
          const currentLocation = await fetchCurrentLocation();
          setLocation(currentLocation);
          const addressData = await fetchAddress(
            currentLocation.latitude, 
            currentLocation.longitude
          );
          setAddress(addressData);
        }
      } catch (error) {
        console.error('Error initializing location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [params]); // Depend on params to reinitialize when navigation params change

  return { location, setLocation, address, setAddress, isLoading };
};