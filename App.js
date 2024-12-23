import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './src/Camera';
import PlantDetectionScreen from './src/Detection/Index';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlantDetection">
        <Stack.Screen name="PlantDetection" component={PlantDetectionScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

