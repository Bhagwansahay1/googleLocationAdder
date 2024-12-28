import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import ConfirmLocation from './screens/ConfirmLocation';
import { LocationProvider } from './context/LocationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressListScreen from './screens/AddressListScreen';
import { ActivityIndicator, View } from 'react-native';

enableScreens();
const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAddresses = async () => {
      try {
        const storedAddresses = await AsyncStorage.getItem('addresses');
        console.log('Stored addresses:', storedAddresses);
        if (storedAddresses) {
          console.log('Setting initial route to AddressList');
          setInitialRoute('AddressList');
        } else {
          setInitialRoute('StartScreen');
        }
      } catch (error) {
        console.error('Error checking local storage:', error);
        setInitialRoute('StartScreen');
      }
    };

    checkAddresses();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <LocationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="AddressList" component={AddressListScreen} />
          <Stack.Screen name='Add address' component={AddAddressScreen} />
          <Stack.Screen name="Confirm Location" component={ConfirmLocation} />
        </Stack.Navigator>
      </NavigationContainer>
      </GestureHandlerRootView>
    </LocationProvider>
  );
}

export default App;
