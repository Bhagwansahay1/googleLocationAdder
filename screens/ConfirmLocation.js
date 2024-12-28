import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
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
import { ScrollView } from 'react-native-gesture-handler';
import CustomCheckbox from '../components/CustomCheckbox';
import HouseFillIcon from '../assets/icons/houseFill.svg';
import OfficeIcon from '../assets/icons/work.svg';
import MapPinBlackIcon from '../assets/icons/mapPinBlack.svg';
import uuid from 'react-native-uuid';

const ConfirmLocation = ({ route, navigation }) => {
  const { addressText, placeId, isAutocomplete, addressData, savedAddress } = route.params || {};
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({ main: '', sub: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("Home");
  const [defaultAddressCheckBox, setDefaultAddressCheckBox] = useState(false);
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

  const addressTypes = [
    { label: 'Home', IconComponent: HouseFillIcon },
    { label: 'Work', IconComponent: OfficeIcon },
    { label: 'Other', IconComponent: MapPinBlackIcon }
  ];

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '95%'], []);

  useEffect(() => {
    console.log("userEffect call",savedAddress);
    if (savedAddress) {
      const { main, sub, details, receiver, location, isDefault, addressType } = savedAddress;
      setAddress({ main, sub });
      setAddressDetails(details || {});
      setReceiverDetails(receiver || {});
      setLocation(location);
      setDefaultAddressCheckBox(isDefault);
      setSelectedAddressType(addressType);
    }
    else if (isAutocomplete && placeId) {
      fetchPlaceDetails(placeId);
    } else if (addressData) {
      setAddressDetails(addressData.addressDetails);
      setReceiverDetails(addressData.receiverDetails);
      setDefaultAddressCheckBox(addressData.isDefault);
      fetchCoordinatesFromAddress(addressData.addressDetails);
    } else {
      fetchCurrentLocation();
    }
  }, [isAutocomplete, placeId, addressData, savedAddress]);

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
    const fullAddress = `${addressData.houseNumber}, ${addressData.buildingName}, ${addressData.addressLine1}, ${addressData.city}, ${addressData.state}, ${addressData.pincode}`;

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
    try {
    const newAddress = {
      id: savedAddress?.id || uuid.v4(),
      main: address.main,
      sub: address.sub,
      details: addressDetails,
      receiver: receiverDetails,
      isDefault: defaultAddressCheckBox,
      addressType: selectedAddressType,
      location,
    };
      const storedAddresses = await AsyncStorage.getItem('addresses');
      let updatedAddresses = storedAddresses ? JSON.parse(storedAddresses) : [];

      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((address) => ({
          ...address,
          isDefault: false,
        }));
      }

      const existingIndex = updatedAddresses.findIndex((address) => address.id === newAddress.id);
      if (existingIndex !== -1) {
        updatedAddresses[existingIndex] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }

      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));

      alert('Address saved successfully!');
      navigation.navigate('AddressList');
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <MapView
          key={location && `${location.latitude}-${location.longitude}`}
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
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={(index) => {
            setShowAddressForm(index !== 0);
          }}
        >
          <BottomSheetView style={styles.addressDetails}>
            <ScrollView>
              <View style={styles.addressContainer}>
                <View>
                  <LocationPin style={styles.icon} />
                </View>
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressText}>{address.main}</Text>
                  <Text style={styles.addressSubText}>{address.sub}</Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.changeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>

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
                      {addressTypes.map((type) => (
                        <TouchableOpacity
                          key={type.label}
                          style={[
                            styles.saveOption,
                            selectedAddressType === type.label && styles.selectedOption,
                          ]}
                          onPress={() => handleAddressTypeChange(type.label)}
                        >
                          <type.IconComponent />
                          <Text
                            style={[
                              styles.optionText,
                              selectedAddressType === type.label && styles.selectedOptionText,
                            ]}
                          >
                            {type.label}
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
                  <CustomCheckbox
                    value={defaultAddressCheckBox}
                    onValueChange={(newValue) => setDefaultAddressCheckBox(newValue)}
                  />
                  <CustomButton title="Save address" onPress={handleSaveAddress} />
                </View>
              )}
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </KeyboardAvoidingView>
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
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressTextContainer: {
    flexDirection: 'column',
    width: '70%',
  },
  icon: {
    marginRight: 8,
  },
  selectedOptionText: {
    color: '#EF6C00',
  },
  selectedOption: {
    backgroundColor: '#FFEAD8',
    borderColor: '#EF6C00',
    borderRadius: 4,
    borderWidth: .4,
  },
  optionText: {
    color: '#374151',
    fontFamily: 'GothamRounded-Medium',
    fontSize: 12,
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'GothamRounded-Bold',
  },
  addressSubText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Lato-Regular',
    fontWeight: 400,
  },
  changeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFEEE6',
    borderRadius: 4,
  },
  changeButtonText: {
    fontSize: 12,
    color: '#EF6C00',
    fontWeight: 350,
    fontFamily: 'GothamRounded-Medium',
  },
  formContainer: {
    marginTop: 16,
  },
  saveAsContainer: {
    marginBottom: 12,
  },
  saveAsText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
    fontWeight: 325,
    fontFamily: 'GothamRounded-Medium',
  },
  saveAsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
