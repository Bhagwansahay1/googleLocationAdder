import React from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useLocation } from '../context/LocationContext';
import Header from '../components/Header';

const StartScreen = ({ navigation }) => {
    const { locationPermissionGranted } = useLocation();
    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    navigation.navigate('Confirm Location');
                } else {
                    navigation.navigate('Add address');
                    console.log('Location permission denied');
                }
            } else {
                navigation.navigate('Add address');
            }
        } catch (err) {
            console.error('Permission request failed:', err);
            navigation.navigate('Add address');
        }
    };
    return (
        <>
        <Header title="Start" isBackIcon={false} onBackPress={() => {}} />
        <View style={styles.container}>
            <View style={styles.content} />
            <View style={styles.innerContainer}>
                <CustomButton title="Add Address" onPress={requestLocationPermission} />
            </View>
        </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FB',
    },
    content: {
        flex: 1,
    },
    innerContainer: {
        backgroundColor: "#ffffff",
        padding: 16,
    },
});

export default StartScreen;