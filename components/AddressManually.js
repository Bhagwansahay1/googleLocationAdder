import React, { useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AddressDetails from "./AddressDetails";
import ReceiverDetails from "./ReceiverDetails";
import LocationPermissionBanner from "./LocationPremissionBanner";
import CustomButton from "./CustomButton";
import CustomCheckbox from "./CustomCheckbox";
import { useLocation } from "../context/LocationContext";

const AddressManually = () => {
    const [defaultAddressCheckBox, setDefaultAddressCheckBox] = useState(false);
    const [addressDetails, setAddressDetails] = useState({
        pincode: "",
        city: "",
        state: "",
        houseNumber: "",
        buildingName: "",
        addressLine1: "",
    });
    const [receiverDetails, setReceiverDetails] = useState({
        receiverName: "",
        receiverMobile: "",
        petName: "",
    });
    const navigation = useNavigation();
    const { locationPermissionGranted } = useLocation();

    const handleInputChange = (field, value, type = "address") => {
        if (type === "address") {
            setAddressDetails((prev) => ({ ...prev, [field]: value }));
            if (field === "pincode" && value.length === 6) {
                fetchCityAndState(value);
            }
        } else {
            setReceiverDetails((prev) => ({ ...prev, [field]: value }));
        }
    };
    const handleSubmit = async () => {
        const fullData = {
            addressDetails,
            receiverDetails,
            isDefault: defaultAddressCheckBox,
        };
        navigation.navigate("Confirm Location", {
            addressData: fullData,
        });
    };

    const fetchCityAndState = async (pincode) => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === "Success") {
                const { District, State } = data[0].PostOffice[0];
                setAddressDetails((prev) => ({
                    ...prev,
                    city: District,
                    state: State,
                }));
            } else {
                Alert.alert("Invalid Pincode", "Please enter a valid pincode.");
            }
        } catch (error) {
            console.error("Error fetching city and state:", error);
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {!locationPermissionGranted && <LocationPermissionBanner />}
                <View style={styles.addressContainer}>
                    <AddressDetails addressInputs={addressDetails} handleInputChange={handleInputChange} />
                    <ReceiverDetails receiverInputs={receiverDetails} handleInputChange={handleInputChange} />
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <CustomCheckbox
                    value={defaultAddressCheckBox}
                    onValueChange={(newValue) => setDefaultAddressCheckBox(newValue)}
                />
                <CustomButton title="Confirm location" onPress={handleSubmit} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FB",
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    addressContainer: {
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    bottomContainer: {
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    checkbox: {
        alignSelf: 'center',
    },
});

export default AddressManually;
