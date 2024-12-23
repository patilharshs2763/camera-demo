import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable, Alert, Image, Button } from "react-native";
import { useCameraPermission, useCameraDevice, Camera } from "react-native-vision-camera";
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const CameraScreen = () => {
    const navigation = useNavigation();
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isActive, setIsActive] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [flash, setFlash] = useState("off"); // Flash state

    const camera = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            setIsActive(true);
            return () => setIsActive(false);
        }, [])
    );

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission]);

    const onTakePicturePressed = async () => {

        try {
            const photo = await camera.current?.takePhoto({
                flash: flash, // Use the current flash mode
            });
            setPhoto(photo);
            console.log("Captured photo:", photo);
        } catch (error) {
            console.error("Error taking photo:", error);
            Alert.alert("Error", "Failed to take photo.");
        }
    };

    const uploadPhoto = async () => {
        if (!photo) {
            return;
        }
        const result = await fetch(`file://${photo.path}`);
        const data = await result.blob();
        console.log("uploaeded data:", data);
        //upload data to your network storage
    };

    const toggleFlash = () => {
        const nextFlashMode = flash === "off" ? "on" : flash === "on" ? "auto" : "off";
        setFlash(nextFlashMode);
    };

    if (!hasPermission) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!device) {
        return <Text style={styles.errorText}>Camera not found!</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            {photo ? (
                <>
                    <Image source={{ uri: `file://${photo.path}` }} style={StyleSheet.absoluteFill} />
                    <Pressable onPress={() => setPhoto(null)} style={styles.backIcon}>
                        <Ionicons name="arrow-back-circle-outline" size={50} color="white" />
                    </Pressable>
                    {/* <View style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingBottom: 50,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }}>
                        
                        <Button title="Upload" onPress={uploadPhoto} />
                    </View> */}
                    <Pressable onPress={uploadPhoto} style={styles.captureButton}>
                        <Ionicons name="checkmark-done-sharp" size={30} color="coral" />
                    </Pressable>
                </>
            ) : (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isActive && !photo}
                        photo={true}
                    />
                    <Ionicons
                        name="close"
                        size={30}
                        color="white"
                        onPress={() => navigation.goBack()}
                        style={styles.closeIcon}
                    />
                    <View style={styles.buttonContainer}>
                        <Ionicons
                            name="images-outline"
                            size={30}
                            color="white"
                            style={styles.galleryIcon}
                        />
                        <Pressable onPress={toggleFlash} style={styles.flashIcon}>
                            <Ionicons
                                name={
                                    flash === "off"
                                        ? "flash-off-outline"
                                        : flash === "on"
                                            ? "flash-outline"
                                            : "flash-auto-outline"
                                }
                                size={30}
                                color="white"
                            />
                        </Pressable>
                    </View>
                    <Pressable onPress={onTakePicturePressed} style={styles.captureButton}>
                        <Ionicons name="camera-outline" size={30} color="coral" />
                    </Pressable>
                    <Pressable onPress={() => { }} style={styles.captureHelp}>
                        <Ionicons name="help-circle-outline" size={30} color="white" />
                    </Pressable>

                    {/* Barcode-like bordered frame */}
                    <View style={styles.barcodeFrame}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    captureButton: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 100,
        width: 75,
        height: 75,
        backgroundColor: 'white',
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'gray',
    },
    buttonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 100, // Adjust this value to move buttons closer or farther from the capture button
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    galleryIcon: {
        padding: 9,
        borderRadius: 7,
        backgroundColor: 'rgba(245, 241, 241, 0.15)',
    },
    closeIcon: {
        position: 'absolute',
        left: 20,
        top: 60,
        padding: 9,
        borderRadius: 7,
        backgroundColor: 'rgba(245, 241, 241, 0.15)',
    },
    flashIcon: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    captureHelp: {
        position: 'absolute',
        right: 20,
        top: 60,
        padding: 9,
        borderRadius: 7,
        backgroundColor: 'rgba(245, 241, 241, 0.15)',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    backIcon: {
        position: 'absolute',
        top: 50,
        left: 30,
        zIndex: 1,
    },
    barcodeFrame: {
        position: 'absolute',
        top: '25%',
        left: '15%',
        right: '15%',
        bottom: '30%',
        borderWidth: 0,
        borderColor: 'white',
        borderRadius: 10,
    },
    corner: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderWidth: 4,
        borderColor: 'white',
        backgroundColor: 'transparent',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopLeftRadius: 30,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopRightRadius: 30,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomLeftRadius: 30,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 30,
        borderTopWidth: 0,
    },
});

export default CameraScreen;
