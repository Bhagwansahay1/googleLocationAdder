import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from "../assets/icons/backArrow.svg";

const Header = ({ title, isBackIcon, onBackPress }) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={onBackPress}>
            {isBackIcon && <BackArrow/> }
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1D',
    fontFamily: 'GothamRounded-Medium',
    marginLeft: 12,
  },
});

export default Header;