import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { theme } from "../utils/theme";

const ReceiverDetails = ({ receiverInputs, handleInputChange }) => {
  const { receiverName, receiverMobile, petName } = receiverInputs;
  const validateMobile = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    handleInputChange("receiverMobile", numericValue, "receiver");
  };
  return (
    <>
      <View>
        <Text style={styles.title}>Receiver's details</Text>
      </View>
      <View style={styles.container}>
        <TextInput style={[styles.input, theme.shadow.input]} placeholder="Receiver name" value={receiverName}
          onChangeText={(value) => handleInputChange("receiverName", value, "receiver")} />
        <TextInput style={[styles.input, theme.shadow.input]} keyboardType="numeric" maxLength={10} placeholder="Receiver's mobile no." value={receiverMobile}
          onChangeText={(value) => validateMobile(value)} />
        <TextInput style={[styles.input, theme.shadow.input]} placeholder="Your pet's name" value={petName}
          onChangeText={(value) => handleInputChange("petName", value, "receiver")} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  title: {
    fontSize: theme.fontSizes.base,
    fontWeight: 325,
    marginBottom: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.sm,
  },
});

export default ReceiverDetails;
