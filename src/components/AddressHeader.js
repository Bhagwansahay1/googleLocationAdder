import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LocationPin from '../../assets/icons/mapPin.svg';

export const AddressHeader = ({ address, onChangePress }) => {
  return (
    <View style={styles.addressContainer}>
      <View>
        <LocationPin style={styles.icon} />
      </View>
      <View style={styles.addressTextContainer}>
        <Text style={styles.addressText}>{address.main}</Text>
        <Text style={styles.addressSubText}>{address.sub}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.changeButton} onPress={onChangePress}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  addressText: {
    fontSize: 16,
    fontFamily: 'GothamRounded-Bold',
  },
  addressSubText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Lato-Regular',
    fontWeight: '400',
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
    fontWeight: '350',
    fontFamily: 'GothamRounded-Medium',
  },
});