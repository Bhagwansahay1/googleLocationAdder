import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocationPermissionBanner from "../components/LocationPremissionBanner";
import AddressManually from "../components/AddressManually";
import { useLocation } from "../context/LocationContext";
import LocationPin from "../../assets/icons/pin.svg";
import CurrentLocationIcon from "../../assets/icons/currentLocation.svg";
import RightArrow from "../../assets/icons/rightArrow.svg";
import Header from "../components/Header";
import { theme } from "../utils/theme";
import { LocationSearch } from "../components/LocationSearch";
import SearchSuggestionList from "../components/SearchSuggestionList";

const AddAddressScreen = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isManually, setIsManually] = useState(false);
    const navigation = useNavigation();
    const { locationPermissionGranted, fetchUserLocation } = useLocation();

    useEffect(() => {
        fetchUserLocation();
    }, []);

    const handleSelectAddress = (address) => {
        const { description, place_id } = address;
        navigation.navigate("Confirm Location", {
            addressText: description,
            placeId: place_id,
            isAutocomplete: true,
        });
    };

    return (
        <>
            <Header title="Add address" isBackIcon={true} onBackPress={() => navigation.navigate("AddressList")} />
            {isManually ? <AddressManually /> :
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {!locationPermissionGranted && <LocationPermissionBanner />}
                    <LocationSearch position="relative" setSuggestions={setSuggestions} />

                    {locationPermissionGranted && (
                        <TouchableOpacity style={styles.locationButton} onPress={() => { navigation.navigate('Confirm Location') }}>
                            <View style={styles.iconTextContainer}>
                                <CurrentLocationIcon />
                                <Text style={styles.addManuallyText}>Use current location</Text>
                            </View>
                            <RightArrow />
                        </TouchableOpacity>
                    )}
                    {suggestions.length > 0 && (
                        <SearchSuggestionList suggestions={suggestions} handleSelectAddress={handleSelectAddress} />
                    )}
                    <TouchableOpacity
                        style={styles.addManuallyButton}
                        onPress={() => setIsManually(true)}
                    >
                        <LocationPin />
                        <Text style={styles.addManuallyText}>Add address manually</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    locationButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 16,
        width: "100%",
        justifyContent: "space-between",
    },
    iconTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    addManuallyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "auto",
        paddingVertical: 16,
    },
    addManuallyText: {
        fontSize: theme.fontSizes.base,
        color: theme.colors.primary,
        marginLeft: 8,
        fontFamily: theme.fonts.medium,
        fontWeight: 325,
    },
});

export default AddAddressScreen;
