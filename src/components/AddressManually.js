import React, { useState } from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AddressDetails from "./AddressDetails";
import ReceiverDetails from "./ReceiverDetails";
import LocationPermissionBanner from "./LocationPremissionBanner";
import CustomButton from "./CustomButton";
import CustomCheckbox from "./CustomCheckbox";
import { useLocation } from "../context/LocationContext";
import { fetchCityAndState } from "../utils/utils";
import { theme } from "../utils/theme";

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

    const handleInputChange = async (field, value, type = "address") => {
        if (type === "address") {
            setAddressDetails((prev) => ({ ...prev, [field]: value }));
            if (field === "pincode" && value.length === 6) {
                const { city, state } = await fetchCityAndState(value);
                setAddressDetails((prev) => ({
                    ...prev,
                    city,
                    state,
                }));
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
        backgroundColor: theme.colors.background,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    addressContainer: {
        padding: 16,
    },
    bottomContainer: {
        backgroundColor: theme.colors.white,
        padding: 16,
    },
});

export default AddressManually;
