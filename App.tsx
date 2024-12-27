import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import AddAddressScreen from './screens/AddAddressScreen';
import ConfirmLocation from './screens/ConfirmLocation';
// import AddNewAddress from './AddNewAddress';
// import MapViewComponent from './MapViewComponent';
// import ManualAddressEntry from './ManualAddressEntry';
// import AddressManagement from './AddressManagement';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
            <Stack.Navigator initialRouteName="StartScreen">
                <Stack.Screen name="StartScreen" component={StartScreen} />
                <Stack.Screen name='Add address' component={AddAddressScreen} />
                <Stack.Screen name="Confirm Location" component={ConfirmLocation} />
                {/* <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
                <Stack.Screen name="MapViewComponent" component={MapViewComponent} />
                <Stack.Screen name="ManualAddressEntry" component={ManualAddressEntry} />
                <Stack.Screen name="AddressManagement" component={AddressManagement} /> */}
            </Stack.Navigator>
        </NavigationContainer>
  );
}

export default App;
