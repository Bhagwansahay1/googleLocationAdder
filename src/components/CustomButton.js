import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../utils/theme';

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
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.white,
    fontWeight: 350,
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regularGotham,
  },
});

export default CustomButton;
