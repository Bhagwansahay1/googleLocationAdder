import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputWithIcon from './InputWithIcon';
import CustomCheckbox from './CustomCheckbox';
import CustomButton from './CustomButton';
import { addressTypes } from '../utils/constants';
import { theme } from '../utils/theme';

export const AddressForm = ({
  addressInputs,
  receiverInputs,
  selectedAddressType,
  handleAddressTypeChange,
  defaultAddressCheckBox,
  setDefaultAddressCheckBox,
  handleSaveAddress,
  formErrors
}) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.saveAsText}>Enter complete address</Text>
      {addressInputs.map((input, index) => (
        <View key={index}>
          <InputWithIcon
            placeholder={input.placeholder}
            IconComponent={input.IconComponent}
            value={input.value}
            onChangeText={input.onChangeText}
            keyboardType={input.keyboardType}
            maxLength={input.maxLength}
            isError={formErrors[input.name]}
          />
        </View>
      ))}
      <View style={styles.saveAsContainer}>
        <Text style={styles.saveAsText}>Save address as</Text>
        <View style={styles.saveAsOptions}>
          {addressTypes.map((type) => (
            <TouchableOpacity
              key={type.label}
              style={[
                styles.saveOption,
                selectedAddressType === type.label && styles.selectedOption,
              ]}
              onPress={() => handleAddressTypeChange(type.label)}
            >
              <type.IconComponent />
              <Text
                style={[
                  styles.optionText,
                  selectedAddressType === type.label && styles.selectedOptionText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {receiverInputs.map((input, index) => (
        <View key={index}>
          <InputWithIcon
            placeholder={input.placeholder}
            IconComponent={input.IconComponent}
            value={input.value}
            onChangeText={input.onChangeText}
            keyboardType={input.keyboardType}
            maxLength={input.maxLength}
            isError={formErrors[input.name]}
          />
        </View>
      ))}
      <CustomCheckbox
        value={defaultAddressCheckBox}
        onValueChange={(newValue) => setDefaultAddressCheckBox(newValue)}
      />
      <CustomButton title="Save address" onPress={handleSaveAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 16,
  },
  saveAsContainer: {
    marginBottom: 12,
  },
  saveAsText: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontWeight: '325',
    fontFamily: theme.fonts.medium,
  },
  saveAsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: theme.colors.white,
  },
  selectedOption: {
    backgroundColor: theme.colors.peachPuff,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    borderWidth: 0.4,
  },
  optionText: {
    color: '#374151',
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSizes.sm,
  },
  selectedOptionText: {
    color: theme.colors.primary,
  },
});