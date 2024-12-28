import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { GOOGLE_MAP_API_KEY } from '@env';
import CustomButton from '../components/CustomButton';
import LocationPin from '../assets/icons/mapPin.svg';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import HomeIcon from '../assets/icons/homeIcon.svg';
import InputWithIcon from '../components/InputWithIcon';
import BuildingIcon from '../assets/icons/buildingIcon.svg';
import LandmarkIcon from '../assets/icons/landmarkIcon.svg';
import UserIcon from '../assets/icons/userIcon.svg';
import PhoneIcon from '../assets/icons/phoneIcon.svg';
import PetNameIcon from '../assets/icons/petNameIcon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmLocation = ({ route, navigation }) => {
  const { addressText, placeId, isAutocomplete, addressData, savedAddress } = route.params || {};
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ main: '', sub: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("Home");
  const [addressDetails, setAddressDetails] = useState({
    houseNumber: "",
    buildingName: "",
    landmark: "",
  });
  const [receiverDetails, setReceiverDetails] = useState({
    receiverName: "",
    receiverMobile: "",
    petName: "",
  });
  const addressInputs = [
    { placeholder: 'House/Flat no.', value: addressDetails.houseNumber, IconComponent: HomeIcon, onChangeText: (value) => setAddressDetails({ ...addressDetails, houseNumber: value }) },
    { placeholder: 'Building name', value: addressDetails.buildingName, IconComponent: BuildingIcon, onChangeText: (value) => setAddressDetails({ ...addressDetails, buildingName: value }) },
    { placeholder: 'Landmark', value: addressDetails.landmark, IconComponent: LandmarkIcon, onChangeText: (value) => setAddressDetails({ ...addressDetails, landmark: value }) },
  ];

  const receiverInputs = [
    { placeholder: 'Your name', value: receiverDetails.receiverName, IconComponent: UserIcon, onChangeText: (value) => setReceiverDetails({ ...receiverDetails, receiverName: value }) },
    { placeholder: 'Your mobile no.', value: receiverDetails.receiverMobile, IconComponent: PhoneIcon, onChangeText: (value) => setReceiverDetails({ ...receiverDetails, receiverMobile: value }) },
    { placeholder: 'Your pet name', value: receiverDetails.petName, IconComponent: PetNameIcon, onChangeText: (value) => setReceiverDetails({ ...receiverDetails, petName: value }) },
  ];

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  useEffect(() => {
    if (savedAddress) {
      const { main, sub, details, receiver, location } = savedAddress;
      setAddress({ main, sub });
      setAddressDetails(details || {});
      setReceiverDetails(receiver || {});
      setLocation(location);
    }
    else if (isAutocomplete && placeId) {
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
      console.log(latitude, longitude, fetchAddress);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
      );
      console.log(response.data.results[0]?.address_components);
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

  const handleAddDetails = () => {
    setShowAddressForm(true);
    bottomSheetRef.current?.expand();
  };

  const handleSaveAddress = async () => {
    const newAddress = {
      main: address.main,
      sub: address.sub,
      details: addressDetails,
      receiver: receiverDetails,
      isDefault: false,
      addressType: selectedAddressType,
      location,
    };

    try {
      const storedAddresses = await AsyncStorage.getItem('addresses');
      const updatedAddresses = storedAddresses ? JSON.parse(storedAddresses) : [];
      updatedAddresses.push(newAddress);

      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      alert('Address saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleAddressTypeChange = (type) => {
    setSelectedAddressType(type);
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
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={(index) => {
        if (index === 0) {
          setShowAddressForm(false);
        } else if (index === 2) {
          setShowAddressForm(true);
        }
      }}>
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
          {!showAddressForm ? (
            <CustomButton
              title="Add more address details"
              onPress={handleAddDetails}
            />
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.saveAsText}>Enter complete address</Text>
              {addressInputs.map((input, index) => (
                <InputWithIcon
                  key={index}
                  placeholder={input.placeholder}
                  IconComponent={input.IconComponent}
                  value={input.value}
                  onChangeText={input.onChangeText}
                />
              ))}
              <View style={styles.saveAsContainer}>
                <Text style={styles.saveAsText}>Save address as</Text>
                <View style={styles.saveAsOptions}>
              {["Home", "Office", "Others"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.saveOption,
                    selectedAddressType === type && styles.selectedOption,
                  ]}
                  onPress={() => handleAddressTypeChange(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAddressType === type && styles.selectedOptionText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
              </View>
              {receiverInputs.map((input, index) => (
                <InputWithIcon
                  key={index}
                  placeholder={input.placeholder}
                  IconComponent={input.IconComponent}
                  value={input.value}
                  onChangeText={input.onChangeText}
                />
              ))}
              <CustomButton title="Save address" onPress={() => handleSaveAddress()} />
            </View>
          )}
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
    color: '#888',
  },
  addressDetails: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  selectedOptionText: {
    color: '#fff',
  },
  selectedOption: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  optionText: {
    color: '#333',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FF5722',
    borderRadius: 16,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 16,
  },
  saveAsContainer: {
    marginBottom: 12,
  },
  saveAsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  saveAsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 4,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
});

export default ConfirmLocation;
