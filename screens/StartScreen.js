import React from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import CustomButton from '../components/CustomButton';

const StartScreen = ({ navigation }) => {
    const requestLocationPermission = async () => {
        console.log(Platform.OS, 'Requesting location permission...');
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
                navigation.navigate('Confirm Location');
            } else {
                navigation.navigate('Add address');
                console.log('Location permission denied');
            }
        } else {
            console.log('You can use the location without permission');
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.content} />
            <View style={styles.innerContainer}>
                <CustomButton title="Add Address" onPress={requestLocationPermission} />
            </View>
        </View>
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