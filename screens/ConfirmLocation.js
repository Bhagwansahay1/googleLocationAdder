import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import { GOOGLE_MAP_API_KEY } from "@env";

const ConfirmLocation = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState({ main: '', sub: '' });

    useEffect(() => {
        const requestLocation = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchLocation();
                } else {
                    navigation.navigate('Add address');
                }
            } else {
                fetchLocation();
            }
        };

        const fetchLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    fetchAddress(latitude, longitude);
                },
                error => console.error(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        requestLocation();
    }, []);

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
            );
            const addressComponents = response.data.results[0].address_components;
            const formattedAddress = response.data.results[0].formatted_address;

            setAddress({
                main: addressComponents[0]?.long_name || 'Order will be delivered here',
                sub: formattedAddress || 'Move the pin to change location',
            });
        } catch (error) {
            console.error('Failed to fetch address:', error);
            setAddress({ main: 'Unknown Location', sub: 'Unable to fetch address' });
        }
    };

    const handleMarkerDragEnd = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        fetchAddress(latitude, longitude);
    };

    if (!location) {
        return <Text style={styles.loadingText}>Fetching location...</Text>;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setLocation({ latitude, longitude });
                    fetchAddress(latitude, longitude);
                }}
            >
                <Marker
                    coordinate={location}
                    draggable
                    title="Order will be delivered here"
                    description="Move the pin to change location"
                    onDragEnd={handleMarkerDragEnd}
                />
            </MapView>
            <View style={styles.addressDetails}>
                <Text style={styles.addressText}>{address.main}</Text>
                <Text style={styles.addressSubText}>{address.sub}</Text>
                <TouchableOpacity
                    style={styles.changeButton}
                    onPress={() => navigation.navigate('Add address')}
                >
                    <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
            </View>
            <CustomButton title="Add more address details" onPress={() => {}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
    },
    addressDetails: {
        padding: 16,
        backgroundColor: 'white',
    },
    addressText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addressSubText: {
        color: 'gray',
        marginVertical: 4,
    },
    changeButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginTop: 8,
        backgroundColor: '#F5F6FB',
        borderRadius: 4,
    },
    changeText: {
        color: 'orange',
        fontWeight: 'bold',
    },
});

export default ConfirmLocation;
