import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const InputWithIcon = ({ placeholder, IconComponent, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    {IconComponent && <IconComponent style={styles.inputIcon} />}
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
});

export default InputWithIcon;
