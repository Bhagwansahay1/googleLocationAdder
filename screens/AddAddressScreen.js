import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import LocationPin from "../assets/icons/pin.svg";
import SearchIcon from "../assets/icons/Search.svg";
import LocationPermissionBanner from "../components/LocationPremissionBanner";
import { GOOGLE_MAP_API_KEY, IP_GEO_API_KEY } from "@env";
import AddressManually from "../components/AddressManually";
import { useLocation } from "../context/LocationContext";

const AddAddressScreen = () => {
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isManually, setIsManually] = useState(false);
    const navigation = useNavigation();
    const { locationPermissionGranted } = useLocation();

    useEffect(() => {
        fetchUserLocation();
    }, []);

    const fetchUserLocation = async () => {
        try {
            const response = await axios.get(
                `https://api.ipgeolocation.io/ipgeo?apiKey=${IP_GEO_API_KEY}`
            );
            if (response.data) {
                console.log(response.data);
                const { latitude, longitude } = response.data;
                setUserLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
            }
        } catch (error) {
            console.error('Error fetching user location by IP:', error);
            alert('Unable to fetch location.');
        }
    };

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const fetchAddressSuggestions = async (text) => {
        if (text.length > 2 && userLocation) {
            const { latitude, longitude } = userLocation;
            const locationBias = `${latitude},${longitude}`;
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&location=${locationBias}&radius=5000&key=${GOOGLE_MAP_API_KEY}`;
            try {
                const response = await axios.get(url);
                setSuggestions(response.data.predictions || []);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Create a debounced version of fetchAddressSuggestions
    const debouncedFetchAddressSuggestions = useCallback(
        debounce(fetchAddressSuggestions, 1000),
        [userLocation]
    );

    const handleSearchInputChange = (text) => {
        setSearchText(text);
        debouncedFetchAddressSuggestions(text);
    };

    const handleSelectAddress = (address) => {
        const { description, place_id } = address;
        navigation.navigate("Confirm Location", {
            addressText: description,
            placeId: place_id,
            isAutocomplete: true,
        });
    };

    return (
        isManually ? <AddressManually /> :
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {!locationPermissionGranted && <LocationPermissionBanner /> }
            <View style={styles.searchContainer}>
                <SearchIcon />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search area, street, name..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={handleSearchInputChange}
                />
            </View>
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => handleSelectAddress(item)}
                        >
                            <Text style={styles.suggestionText}>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.addManuallyButton}
                onPress={() => setIsManually(true)}
            >
                <LocationPin />
                <Text style={styles.addManuallyText}>Add address manually</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EAECF0",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        margin: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 12,
        color: "#000000",
    },
    suggestionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EAECF0",
    },
    suggestionText: {
        fontSize: 14,
        color: "#000",
    },
    addManuallyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "auto",
        paddingVertical: 16,
    },
    addManuallyText: {
        fontSize: 14,
        color: "#EF6C00",
        marginLeft: 8,
        fontFamily: "GothamRounded-Medium",
        fontWeight: 325,
    },
});

export default AddAddressScreen;
