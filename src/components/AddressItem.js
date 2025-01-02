import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const AddressItem = ({ address, onPress, onDelete }) => (
  <TouchableOpacity 
    style={[
      styles.addressItem,
      address.isDefault && styles.defaultAddressItem
    ]} 
    onPress={onPress}
  >
    <View style={styles.addressContent}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Text style={styles.addressType}>{address.addressType}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.addressText}>{address.main}</Text>
      <Text style={styles.addressSubText}>{address.sub}</Text>
      <View style={styles.buttonContainer}>
      <CustomButton 
            title="Delete" 
            onPress={onDelete} 
            size='small'
            style={styles.deleteButton}
          />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  addressItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  defaultAddressItem: {
    backgroundColor: '#FFEAD8',
    borderWidth: 1,
    borderColor: '#EF6C00',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  addressType: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'GothamRounded-Medium',
  },
  addressText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'GothamRounded-Medium',
    marginBottom: 4,
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Lato-Regular',
  },
  defaultBadge: {
    backgroundColor: '#EF6C00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'GothamRounded-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  deleteButton: {
    minWidth: 80,
  },
});

export default AddressItem;