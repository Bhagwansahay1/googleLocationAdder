import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import CheckboxIcon from "../assets/icons/checkbox.svg";

const CustomCheckbox = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            style={[
                styles.checkboxContainer,
            ]}
        >
            {value && <CheckboxIcon />}
        </TouchableOpacity>
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
});

export default CustomCheckbox;
