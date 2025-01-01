import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import { useLocationInitialization } from '../hooks/useLocationInitialization';
import { LocationMap } from '../components/LocationMap';
import { AddressHeader } from '../components/AddressHeader';
import { AddressForm } from '../components/AddressForm';
import { createAddressInputs, createReceiverInputs } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import { fetchAddress } from '../utils/utils';

const ConfirmLocation = ({ route, navigation }) => {
  const [mapKey, setMapKey] = useState(0);
  const { location, setLocation, address, setAddress, isLoading } = useLocationInitialization(route.params);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("Home");
  const [defaultAddressCheckBox, setDefaultAddressCheckBox] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%', '95%'], []);

  const addressInputs = createAddressInputs(addressDetails, setAddressDetails);
  const receiverInputs = createReceiverInputs(receiverDetails, setReceiverDetails);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMapKey(prev => prev + 1);
    });
    return unsubscribe;
  }, [navigation]);

  const validateForm = () => {
    const errors = {};
    
    // Validate address details
    if (!addressDetails.houseNumber.trim()) {
      errors.houseNumber = 'House/Flat no. is required';
    }
    if (!addressDetails.buildingName.trim()) {
      errors.buildingName = 'Building name is required';
    }
    if (!addressDetails.landmark.trim()) {
      errors.landmark = 'Landmark is required';
    }

    // Validate receiver details
    if (!receiverDetails.receiverName.trim()) {
      errors.receiverName = 'Name is required';
    }
    if (!receiverDetails.receiverMobile.trim()) {
      errors.receiverMobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(receiverDetails.receiverMobile)) {
      errors.receiverMobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!receiverDetails.petName.trim()) {
      errors.petName = 'Pet name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMarkerDragEnd = useCallback(async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    try {
      const addressData = await fetchAddress(latitude, longitude);
      setAddress(addressData);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }, [setLocation, setAddress]);

  const handleAddDetails = () => {
    setShowAddressForm(true);
    bottomSheetRef.current?.expand();
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newAddress = {
        id: route.params?.savedAddress?.id || uuid.v4(),
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
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      const existingIndex = updatedAddresses.findIndex((addr) => addr.id === newAddress.id);
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

  if (isLoading) {
    return <Text style={styles.loadingText}>Fetching location...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <LocationMap
          location={location}
          onMarkerDragEnd={handleMarkerDragEnd}
          mapKey={mapKey}
        />
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={(index) => {
            setShowAddressForm(index !== 0);
          }}
        >
          <BottomSheetView style={styles.addressDetails}>
            <ScrollView>
              <AddressHeader
                address={address}
                onChangePress={() => navigation.goBack()}
              />
              {!showAddressForm ? (
                <CustomButton
                  title="Add more address details"
                  onPress={handleAddDetails}
                />
              ) : (
                <AddressForm
                  addressInputs={addressInputs}
                  receiverInputs={receiverInputs}
                  selectedAddressType={selectedAddressType}
                  handleAddressTypeChange={setSelectedAddressType}
                  defaultAddressCheckBox={defaultAddressCheckBox}
                  setDefaultAddressCheckBox={setDefaultAddressCheckBox}
                  handleSaveAddress={handleSaveAddress}
                  formErrors={formErrors}
                />
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
});

export default ConfirmLocation;