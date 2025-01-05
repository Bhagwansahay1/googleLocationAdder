import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

const SearchSuggestionList = ({ suggestions, handleSelectAddress }) => {

    return (
        <>
            <View style={styles.suggestionListContainer}>
                <Text style={styles.searchText}>SEARCH RESULTS</Text>
            </View>
            <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSelectAddress(item)}
                    >
                        <Text style={styles.suggestionTextMain}>{item.structured_formatting.main_text}</Text>
                        <Text style={styles.suggestionTextSecondary}>{item.structured_formatting.secondary_text}</Text>
                    </TouchableOpacity>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    suggestionListContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    searchText: {
        fontSize: theme.fontSizes.sm,
        color: "#4B5563",
        fontFamily: theme.fonts.regularGotham,
    },
    suggestionItem: {
        padding: 16,
        backgroundColor: "#FBFDFC",
    },
    suggestionTextMain: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.text.primary,
    },
    suggestionTextSecondary: {
        fontSize: theme.fontSizes.base,
        color: theme.colors.text.secondary,
    },
});

export default SearchSuggestionList;