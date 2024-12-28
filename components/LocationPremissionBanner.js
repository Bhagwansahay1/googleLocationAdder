import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Platform,
    Linking,
} from "react-native";
import LocationDisableIcon from "../assets/icons/location-disable.svg";
import DogIcon from "../assets/icons/supertails";
import LocationIcon from "../assets/icons/location.svg";
import CheckIcon from "../assets/icons/click.svg";
import CustomButton from "./CustomButton";

const LocationPermissionBanner = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const openSettings = () => {
        setModalVisible(false);
        if (Platform.OS === "android") {
            Linking.openSettings();
        } else if (Platform.OS === "ios") {
            Linking.openURL("app-settings:");
        }
    };

    return (
        <View>
            <View style={styles.locationPermissionContainer}>
                <LocationDisableIcon />
                <View style={styles.permissionTextContainer}>
                    <Text style={styles.permissionTitle}>Enable location permission</Text>
                    <Text style={styles.permissionSubtitle}>
                        Your precise location helps us deliver on time
                    </Text>
                </View>
                <CustomButton title="Enable" size="small" onPress={() => setModalVisible(true)} />
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <LocationDisableIcon style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Enable location permission</Text>
                        </View>
                        <Text style={styles.modalMessage}>
                            Please enable location permissions for a better experience
                        </Text>

                        <View style={styles.divider} />

                        <View style={styles.stepsContainer}>
                            <View style={styles.step}>
                                <DogIcon style={styles.stepIcon} />
                                <Text style={styles.stepText}>Choose "Supertails"</Text>
                            </View>
                            <View style={styles.step}>
                                <View style={styles.groupLayout} />
                                <LocationIcon style={styles.stepIcon} />
                                <Text style={styles.stepText}>Go to location</Text>
                            </View>
                            <View style={styles.step}>
                                <CheckIcon style={styles.stepIcon} />
                                <Text style={styles.stepText}>Click on "While using app"</Text>
                            </View>
                        </View>
                        <CustomButton title="Go to settings" onPress={openSettings} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    locationPermissionContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF6F7",
        padding: 12,
        borderRadius: 8,
    },
    locationIcon: {
        marginRight: 8,
    },
    permissionTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    permissionTitle: {
        fontSize: 12,
        fontWeight: 350,
        color: "#1B281B",
        fontFamily: "GothamRounded-Bold",
    },
    permissionSubtitle: {
        fontSize: 10,
        color: "#142E1599",
        fontFamily: "Lato-Regular",
        fontWeight: 400,
        lineHeight: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    modalIcon: {
        marginRight: 8,
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: 400,
        color: "#182035",
        fontFamily: "GothamRounded-Bold",
    },
    modalMessage: {
        fontSize: 12,
        color: "#606268",
        textAlign: "center",
        marginBottom: 12,
        fontFamily: "Lato-Regular",
        fontWeight: 400,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 16,
    },
    stepsContainer: {
        width: "100%",
        marginBottom: 20,
        position: "relative",
    },
    step: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    stepIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
        zIndex: 1,
    },
    stepText: {
        fontSize: 10,
        color: "#000",
        fontFamily: "Lato-Regular",
        letterSpacing: 0.1,
    },
    groupLayout: {
        height: 60,
        backgroundColor: "#d9d9d9",
        left: 9,
        width: 2,
        position: "absolute"
    },
});

export default LocationPermissionBanner;
