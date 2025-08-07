import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './screens/signUp'
import Home from './screens/Home'
import Login from './screens/Login';
import Generate from './screens/Generate';
import FlashCards from './screens/FlashCards';
import Profile from './screens/Profile';
import Themes from './screens/Themes';
const Stack = createNativeStackNavigator()

import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['flashapp://'], 
  config: {
    screens: {
      SignUp: 'signup',
      Home: 'home',
      Login: 'login',
      Generate: 'generate',
      FlashCards: 'flashcards/:data', 
      Profile: 'profile',
      Themes: 'themes',
    }
  }
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName='SignUp' >
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Generate" component={Generate} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="FlashCards" component={FlashCards} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Themes" component={Themes} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    // <View>
    //   <Text>Hi</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
