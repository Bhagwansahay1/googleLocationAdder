import { useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { fetchAddress, fetchCoordinatesFromAddress, fetchPlaceDetails } from '../utils/utils';

const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    try {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    } catch (err) {
      return false;
    }
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show nearby places.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  }
  return false;
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  });
};

export const useLocationInitialization = (params) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ main: '', sub: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      setIsLoading(true);
      try {
        const { placeId, isAutocomplete, addressData, savedAddress } = params || {};
        let newLocation = null;
        let newAddress = { main: '', sub: '' };

        if (savedAddress) {
          newLocation = savedAddress.location;
          newAddress = { main: savedAddress.main, sub: savedAddress.sub };
        } else if (isAutocomplete && placeId) {
          const { locationData, address } = await fetchPlaceDetails(placeId);
          newLocation = locationData;
          newAddress = address;
        } else if (addressData) {
          const locationData = await fetchCoordinatesFromAddress(addressData.addressDetails);
          newLocation = { 
            latitude: locationData.latitude, 
            longitude: locationData.longitude 
          };
          newAddress = {
            main: locationData.main,
            sub: locationData.sub
          };
        } else {
          // Handle current location with proper error handling
          const hasPermission = await requestLocationPermission();
          
          if (!hasPermission) {
            Alert.alert(
              'Location Permission Required',
              'Please enable location services to use this feature.',
              [{ text: 'OK' }]
            );
            newLocation = DEFAULT_LOCATION;
          } else {
            try {
              const position = await getCurrentPosition();
              newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
            } catch (error) {
              console.warn('Error getting current location:', error);
              Alert.alert(
                'Location Error',
                'Unable to get your current location. Using default location.',
                [{ text: 'OK' }]
              );
              newLocation = DEFAULT_LOCATION;
            }
          }

          try {
            newAddress = await fetchAddress(newLocation.latitude, newLocation.longitude);
          } catch (error) {
            console.warn('Error fetching address:', error);
            newAddress = {
              main: 'Location not found',
              sub: 'Please enter your address manually'
            };
          }
        }

        if (isMounted) {
          setLocation(newLocation);
          setAddress(newAddress);
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        if (isMounted) {
          setLocation(DEFAULT_LOCATION);
          setAddress({
            main: 'Location not found',
            sub: 'Please enter your address manually'
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, [params]); 

  return { location, setLocation, address, setAddress, isLoading };
};