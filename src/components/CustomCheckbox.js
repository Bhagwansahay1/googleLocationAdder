import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import CheckboxIcon from "../../assets/icons/checkbox.svg";
import { theme } from "../utils/theme";

const CustomCheckbox = ({ value, onValueChange }) => {
    return (
        <View style={styles.defaultAddressContainer}>
            <TouchableOpacity
                onPress={() => onValueChange(!value)}
                style={[
                    styles.checkboxContainer,
                ]}
            >
                {value && <CheckboxIcon />}
            </TouchableOpacity>
            <Text style={styles.defaultAddressText}>Set as default address</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#808080",
        alignItems: "center",
        justifyContent: "center",
    },
    defaultAddressContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12,
    },
    defaultAddressText: {
        fontSize: theme.fontSizes.base,
        marginLeft: 8,
        fontFamily: theme.fonts.regular,
        fontWeight: 400,
        color: theme.colors.text.primary,
    },
});

export default CustomCheckbox;
