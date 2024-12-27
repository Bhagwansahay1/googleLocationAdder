import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import ConfirmLocation from './screens/ConfirmLocation';
import { LocationProvider } from './context/LocationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();
const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <LocationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen">
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name='Add address' component={AddAddressScreen} />
          <Stack.Screen name="Confirm Location" component={ConfirmLocation} />
        </Stack.Navigator>
      </NavigationContainer>
      </GestureHandlerRootView>
    </LocationProvider>
  );
}

export default App;
