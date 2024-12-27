import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const AddressDetails = ({ addressInputs, handleInputChange }) => {
  const { pincode, city, state, houseNo, buildingNo } = addressInputs;
  return (
    <>
      <View>
        <Text style={styles.title}>Address</Text>
      </View>
      <View style={styles.container}>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="Pincode" value={pincode} onChangeText={(value) => handleInputChange("pincode", value)} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.halfInput]} editable={false} value={city} placeholder="City" onChangeText={(value) => handleInputChange("city", value)} />
          <TextInput style={[styles.input, styles.halfInput]} editable={false} placeholder="State" value={state} onChangeText={(value) => handleInputChange("state", value)} />
        </View>
        <TextInput style={styles.input} placeholder="House/Flat no." value={houseNo} onChangeText={(value) => handleInputChange("houseNo", value)} />
        <TextInput style={styles.input} placeholder="Building no." value={buildingNo} onChangeText={(value) => handleInputChange("buildingNo", value)} />
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderColor: '#EAECF0',
    backgroundColor: '#fff',
    shadowColor: 'rgba(67, 71, 77, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
});

export default AddressDetails;
