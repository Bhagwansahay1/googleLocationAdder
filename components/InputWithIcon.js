import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const InputWithIcon = ({ placeholder, IconComponent, value, onChangeText, keyboardType, maxLength, isError }) => (
  <View style={styles.inputContainerOuter}>
  <View style={[styles.inputContainer, isError ? { borderColor: 'red' } : {borderColor: '#ddd'}]}>
    {IconComponent && <IconComponent style={styles.inputIcon} />}
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
    />
  </View>
  {isError && (
    <Text style={styles.errorText}>{isError}</Text>
  )}
  </View>
);

const styles = StyleSheet.create({
  inputContainerOuter: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});

export default InputWithIcon;
