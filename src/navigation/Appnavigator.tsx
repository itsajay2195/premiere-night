import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import {
  DETAILS_SCREEN,
  HOME_SCREEN,
  MAIN_SCREEN,
  WATCHLIST_SCREEN,
} from '../constants/screens';
import WatchlistScreen from '../screens/WatchlistScreen/WatchlistScreen';
import DetailsScreen from '../screens/DetailsScreen/DetailsScreen';
import { Colors } from '../theme/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>(); //add types
const Tab = createBottomTabNavigator<TabParamList>(); //add types

const getTabIcon = (routeName: string, focused: boolean): string => {
  switch (routeName) {
    case HOME_SCREEN:
      return focused ? 'movie-open' : 'movie-open-outline';
    case WATCHLIST_SCREEN:
      return focused ? 'bookmark' : 'bookmark-outline';
    default:
      return 'circle';
  }
};

const renderTabIcon = ({
  route,
  focused,
  color,
}: {
  route: { name: string };
  focused: boolean;
  color: string;
}) => (
  <MaterialCommunityIcons
    name={getTabIcon(route.name, focused)}
    size={24}
    color={color}
  />
);
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textFaint,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused, color }) =>
          renderTabIcon({ route, focused, color }),
      })}
    >
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
      <Stack.Screen name={MAIN_SCREEN} component={TabNavigator} />
      <Stack.Screen
        name={DETAILS_SCREEN}
        component={DetailsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
