import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

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
        <TextInput style={styles.input} placeholder="Your name" value={receiverName}
          onChangeText={(value) => handleInputChange("receiverName", value, "receiver")} />
        <TextInput style={styles.input} keyboardType="numeric" maxLength={10} placeholder="Your mobile no." value={receiverMobile}
          onChangeText={(value) => validateMobile(value)} />
        <TextInput style={styles.input} placeholder="Your pet's name" value={petName}
          onChangeText={(value) => handleInputChange("petName", value, "receiver")} />
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
    padding: 10,
    marginBottom: 12,
    borderColor: '#EAECF0',
    backgroundColor: '#fff',
    shadowColor: 'rgba(67, 71, 77, 0.08)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 60,
    elevation: 5,
    fontFamily: "Lato-Regular",
    fontSize: 12,
  },
});

export default ReceiverDetails;
