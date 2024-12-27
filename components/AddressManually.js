import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import AddressDetails from "./AddressDetails";
import ReceiverDetails from "./ReceiverDetails";
import LocationPermissionBanner from "./LocationPremissionBanner";
import CustomButton from "./CustomButton";
import CustomCheckbox from "./CustomCheckbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useLocation } from "../context/LocationContext";

const AddressManually = () => {
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [addressDetails, setAddressDetails] = useState({
        pincode: "",
        city: "",
        state: "",
        houseNo: "",
        buildingNo: "",
    });
    const [receiverDetails, setReceiverDetails] = useState({
        name: "",
        mobile: "",
        petName: "",
    });
    const navigation = useNavigation();
    const { locationPermissionGranted } = useLocation();

    const handleInputChange = (field, value, type = "address") => {
        console.log("field==>>", field)
        if (type === "address") {
            setAddressDetails((prev) => ({ ...prev, [field]: value }));

            if (field === "pincode" && value.length === 6) {
                fetchCityAndState(value);
            }
        } else {
            console.log("receiverDetails==>>", receiverDetails)
            setReceiverDetails((prev) => ({ ...prev, [field]: value }));
        }
    };
    const handleSubmit = async () => {
        const fullData = {
            ...addressDetails,
            ...receiverDetails,
            isDefault: toggleCheckBox,
        };

        try {
            navigation.navigate("Confirm Location", {
                addressData: addressDetails,
            });
            await AsyncStorage.setItem("defaultAddress", JSON.stringify(fullData));
            Alert.alert("Success", "Address saved successfully!");
        } catch (error) {
            console.error("Error saving address to local storage:", error);
        }
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
                    <View style={styles.defaultAddressContainer}>
                        <CustomCheckbox
                            value={toggleCheckBox}
                            onValueChange={(newValue) => setToggleCheckBox(newValue)}
                        />
                        <Text style={styles.defaultAddressText}>Set as default address</Text>
                    </View>
                    <CustomButton title="Confirm location" onPress={handleSubmit} />
                </View>
            </ScrollView>
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
    checkbox: {
        alignSelf: 'center',
    },
    defaultAddressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    defaultAddressText: {
        fontSize: 14,
        marginLeft: 8,
        color: "#808080",
    },
});

export default AddressManually;
