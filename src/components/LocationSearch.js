import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';
import SearchIcon from '../../assets/icons/Search.svg';
import LocationPermissionBanner from './LocationPremissionBanner';
import { useLocation } from '../context/LocationContext';
import { debounce, fetchAddressSuggestions } from '../utils/utils';

export const LocationSearch = ({
    position = "absolute",
    setSuggestions,
    isEnabledLocationBanner = false
}) => {
    const [searchText, setSearchText] = useState('');
    const { locationPermissionGranted, userLocation } = useLocation();

    const debouncedFetchAddressSuggestions = useCallback(
        debounce(async (text) => {
            if (userLocation) {
                const suggestions = await fetchAddressSuggestions(text, userLocation);
                setSuggestions(suggestions);
            }
        }, 1000),
        [userLocation]
    );

    const handleSearchInputChange = (text) => {
        setSearchText(text);
        debouncedFetchAddressSuggestions(text, userLocation);
        console.log(text,"text")
    };
    return (
        <View style={[styles.container, { position }]}>
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
            {!locationPermissionGranted && isEnabledLocationBanner && <LocationPermissionBanner />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.white
    },
    searchInput: {
        flex: 1,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.text.primary,
    },
});