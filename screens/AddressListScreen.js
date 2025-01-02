import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import AddressItem from '../components/AddressItem';
import EmptyState from '../components/EmptyState';
import { sortAddresses } from '../utils/utils';
import Header from '../components/Header';

const AddressListScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);

  const loadAddresses = useCallback(async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem('addresses');
      const parsedAddresses = storedAddresses ? JSON.parse(storedAddresses) : [];
      console.log(parsedAddresses, 'parsedAddresses');
      setAddresses(sortAddresses(parsedAddresses));
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAddresses);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, loadAddresses]);

  const handleDeleteAddress = async (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedAddresses = await AsyncStorage.getItem('addresses');
              if (!storedAddresses) return;

              const currentAddresses = JSON.parse(storedAddresses);
              const updatedAddresses = currentAddresses.filter(
                (addr) => addr.id !== addressId
              );

              await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
              
              setAddresses(sortAddresses(updatedAddresses));
              Alert.alert('Success', 'Address deleted successfully!');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
      ]
    );
  }


  const renderItem = useCallback(({ item }) => (
    <AddressItem
      address={item}
      onPress={() => navigation.navigate('Confirm Location', { savedAddress: item })}
      onDelete={() => handleDeleteAddress(item.id)}
    />
  ), [navigation]);

  return (
    <>
    <Header title="Address List" isBackIcon={true} onBackPress={handleBackPress} />
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState message="No saved addresses" />}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={() => navigation.navigate('Add address')}
          title="Add New Address"
        />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    paddingVertical: 16,
  },
});

export default AddressListScreen;