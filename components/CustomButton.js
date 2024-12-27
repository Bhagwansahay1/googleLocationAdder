import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ size = 'full', title = 'Button', onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        size === 'full' && styles.full,
        size === 'small' && styles.small,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EF6C00',
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  full: {
    width: '100%',
  },
  small: {
    width: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 325,
    fontSize: 16,
  },
});

export default CustomButton;
