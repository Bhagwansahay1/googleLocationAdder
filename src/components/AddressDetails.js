import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const AddressDetails = ({ addressInputs, handleInputChange }) => {
  const { pincode, city, state, houseNumber, buildingName, addressLine1 } = addressInputs;
  return (
    <>
      <View>
        <Text style={styles.title}>Address</Text>
      </View>
      <View style={styles.container}>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="Pincode" value={pincode}
          onChangeText={(value) => handleInputChange("pincode", value)} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.halfInput]} editable={false} value={city} placeholder="City"
            onChangeText={(value) => handleInputChange("city", value)} />
          <TextInput style={[styles.input, styles.halfInput]} editable={false} placeholder="State" value={state}
            onChangeText={(value) => handleInputChange("state", value)} />
        </View>
        <TextInput style={styles.input} placeholder="House/Flat no." value={houseNumber}
          onChangeText={(value) => handleInputChange("houseNumber", value)} />
        <TextInput style={styles.input} placeholder="Building name." value={buildingName}
          onChangeText={(value) => handleInputChange("buildingName", value)} />
        <TextInput style={styles.input} placeholder="Address line 1" value={addressLine1}
          onChangeText={(value) => handleInputChange("addressLine1", value)} multiline={true} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 325,
    marginBottom: 12,
    fontFamily: "GothamRounded-Medium",
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderColor: '#EAECF0',
    backgroundColor: '#fff',
    shadowColor: 'rgba(67, 71, 77, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 5,
    fontFamily: "Lato-Regular",
    fontSize: 12,
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
