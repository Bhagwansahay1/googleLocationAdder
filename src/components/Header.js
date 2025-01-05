import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from "../../assets/icons/backArrow.svg";
import { theme } from '../utils/theme';

const Header = ({ title, isBackIcon, onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        {isBackIcon && <BackArrow />}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    color: '#1A1A1D',
    fontFamily: theme.fonts.bold,
    marginLeft: 12,
  },
});

export default Header;