import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const AddressListScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem('addresses');
      setAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const deleteAddress = async (index) => {
    try {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const confirmDelete = (index) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteAddress(index) },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => navigation.navigate('Confirm Location', { savedAddress: item })}
    >
      <Text style={styles.addressText}>{item.main}</Text>
      <Text style={styles.addressSubText}>{item.sub}</Text>
      <CustomButton title="Delete" onPress={() => confirmDelete(index)} size='small'/>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No saved addresses</Text>}
      />
      <CustomButton
        onPress={() => navigation.navigate('Add address')}
        title="Add New Address"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addressItem: { padding: 16, marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  addressText: { fontSize: 16, color: '#333' },
  addressSubText: { fontSize: 14, color: '#666', marginBottom: 8 },
  deleteText: { color: 'red', marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#666' },
});

export default AddressListScreen;