import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PlantDetectionScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Detection Screen</Text>
            <Button
                title="Go To Camera"
                onPress={() => navigation.push('Camera')}
                color="blue" // Optional: Set button color if needed
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 150, // Set the width of the button
    },
});

export default PlantDetectionScreen;
