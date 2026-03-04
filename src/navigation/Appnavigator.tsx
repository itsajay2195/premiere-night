import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import {
  DETAILS_SCREEN,
  HOME_SCREEN,
  WATCHLIST_SCREEN,
} from '../constants/screenConstants';
import WatchlistScreen from '../screens/WatchlistScreen/WatchlistScreen';
import DetailsScreen from '../screens/DetailsScreen/DetailsScreen';

const Stack = createNativeStackNavigator<any>(); //add types
const Tab = createBottomTabNavigator<any>(); //add types

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={HOME_SCREEN}
        component={HomeScreen}
        options={{ tabBarLabel: 'DISCOVER' }}
      />
      <Tab.Screen
        name={WATCHLIST_SCREEN}
        component={WatchlistScreen}
        options={{ tabBarLabel: 'WATCHLIST' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name={DETAILS_SCREEN}
        component={DetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
