import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { theme } from "../utils/theme";

const AddressDetails = ({ addressInputs, handleInputChange }) => {
  const { pincode, city, state, houseNumber, buildingName, addressLine1 } = addressInputs;
  return (
    <>
      <View>
        <Text style={styles.title}>Address</Text>
      </View>
      <View style={styles.container}>
        <TextInput style={[styles.input, theme.shadow.input]} keyboardType="numeric" placeholder="Pincode" value={pincode}
          onChangeText={(value) => handleInputChange("pincode", value)} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.halfInput, theme.shadow.input]} editable={false} value={city} placeholder="City"
            onChangeText={(value) => handleInputChange("city", value)} />
          <TextInput style={[styles.input, styles.halfInput, theme.shadow.input]} editable={false} placeholder="State" value={state}
            onChangeText={(value) => handleInputChange("state", value)} />
        </View>
        <TextInput style={[styles.input, theme.shadow.input]} placeholder="House/Flat no." value={houseNumber}
          onChangeText={(value) => handleInputChange("houseNumber", value)} />
        <TextInput style={[styles.input, theme.shadow.input]} placeholder="Building name." value={buildingName}
          onChangeText={(value) => handleInputChange("buildingName", value)} />
        <TextInput style={[styles.input, theme.shadow.input]} placeholder="Address line 1" value={addressLine1}
          onChangeText={(value) => handleInputChange("addressLine1", value)} multiline={true} />
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
});

export default AddressDetails;
