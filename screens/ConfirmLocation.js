import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '@env';
import CustomButton from '../components/CustomButton';
import LocationPin from '../assets/icons/mapPin.svg';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const ConfirmLocation = ({ route, navigation }) => {
  const { addressText, placeId, isAutocomplete, addressData } = route.params || {};
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ main: '', sub: '' });

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '40%'], []); // Dynamic snap points

  useEffect(() => {
    if (isAutocomplete && placeId) {
      fetchPlaceDetails(placeId);
    } else if (addressData) {
      fetchCoordinatesFromAddress(addressData);
    } else {
      fetchCurrentLocation();
    }
  }, [isAutocomplete, placeId]);

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchAddress(latitude, longitude);
      },
      error => console.error('Error fetching location:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_API_KEY}`
      );
      const { lat, lng } = response.data.result.geometry.location;
      const formattedAddress = response.data.result.formatted_address || 'Unknown Address';

      setLocation({ latitude: lat, longitude: lng });
      setAddress({ main: formattedAddress, sub: formattedAddress });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
      );
      const addressComponents = response.data.results[0]?.address_components || [];
      const formattedAddress = response.data.results[0]?.formatted_address || 'Unknown Location';

      setAddress({
        main: addressComponents[0]?.long_name || 'Current Location',
        sub: formattedAddress,
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress({ main: 'Unknown Location', sub: 'Unable to fetch address' });
    }
  };

  const fetchCoordinatesFromAddress = async (addressData) => {
    const fullAddress = `${addressData.houseNo}, ${addressData.buildingNo}, ${addressData.city}, ${addressData.state}, ${addressData.pincode}`;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_MAP_API_KEY}`
      );

      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        setAddress({
          main: response.data.results[0]?.formatted_address || 'Unknown Address',
          sub: `Pincode: ${addressData.pincode}`,
        });
      } else {
        console.error('Geocoding failed:', response.data.status);
        setAddress({ main: 'Unable to fetch location', sub: '' });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setAddress({ main: 'Error occurred', sub: '' });
    }
  };

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    fetchAddress(latitude, longitude);
  };

  if (!location) {
    return <Text style={styles.loadingText}>Fetching location...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={location}
          draggable
          title="Order will be delivered here"
          description="Move the pin to change location"
          onDragEnd={handleMarkerDragEnd}
        />
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetView style={styles.addressDetails}>
          <View style={styles.addressContainer}>
            <View style={styles.iconAndText}>
              <LocationPin style={styles.icon} />
              <View>
                <Text style={styles.addressText}>{address.main}</Text>
                <Text style={styles.addressSubText}>{address.sub}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            title="Add more address details"
            onPress={() => navigation.navigate('AddAddressScreen')}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  addressDetails: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndText: {
    flexDirection: 'row',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  addressText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressSubText: {
    color: 'gray',
    marginVertical: 4,
  },
  changeButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginTop: 8,
    backgroundColor: '#F5F6FB',
    borderRadius: 4,
  },
  changeButtonText: {
    fontSize: 12,
    color: '#EF6C00',
    fontWeight: '600',
  },
});

export default ConfirmLocation;
