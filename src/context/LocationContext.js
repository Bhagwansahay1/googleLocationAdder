import React, { createContext, useState, useContext, useEffect } from "react";
import { PermissionsAndroid, Platform, AppState } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [appState, setAppState] = useState(AppState.currentState);

    const checkAndRequestPermission = async () => {
        try {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (granted) {
                    setLocationPermissionGranted(true);
                    return true;
                } else {
                    const request = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: "Location Permission",
                            message: "This app requires access to your location to work properly.",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK",
                        }
                    );
                    if (request === PermissionsAndroid.RESULTS.GRANTED) {
                        setLocationPermissionGranted(true);
                        return true;
                    }
                }
            } else if (Platform.OS === "ios") {
                const status = await Geolocation.requestAuthorization("whenInUse");
                if (status === "granted") {
                    setLocationPermissionGranted(true);
                    return true;
                }
            }
        } catch (err) {
            console.warn(err);
        }
        setLocationPermissionGranted(false);
        return false;
    };

    const fetchUserLocation = () => {
        if (locationPermissionGranted) {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setUserLocation(null);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    };

    const handleAppStateChange = async (nextAppState) => {
        if (appState.match(/inactive|background/) && nextAppState === "active") {
            const permissionGranted = await checkAndRequestPermission();
            if (permissionGranted) {
                fetchUserLocation();
            }
        }
        setAppState(nextAppState);
    };

    useEffect(() => {
        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();
    }, [appState]);

    // useEffect(() => {
    //     (async () => {
    //         const permissionGranted = await checkAndRequestPermission();
    //         // if (permissionGranted) {
    //         //     fetchUserLocation();
    //         // }
    //     })();
    // }, []);

    return (
        <LocationContext.Provider
            value={{
                locationPermissionGranted,
                userLocation,
                fetchUserLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
