import React, { createContext, useState, useContext, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const checkAndRequestPermission = async () => {
        try {
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app requires access to your location to work properly.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setLocationPermissionGranted(true);
                    return true;
                } else {
                    setLocationPermissionGranted(false);
                    return false;
                }
            } else if (Platform.OS === "ios") {
                Geolocation.requestAuthorization("whenInUse").then((status) => {
                    if (status === "granted") {
                        setLocationPermissionGranted(true);
                    } else {
                        setLocationPermissionGranted(false);
                    }
                });
            }
        } catch (err) {
            console.warn(err);
            setLocationPermissionGranted(false);
        }
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

    useEffect(() => {
        (async () => {
            const permissionGranted = await checkAndRequestPermission();
            if (permissionGranted) {
                fetchUserLocation();
            }
        })();
    }, []);

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
