/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfileScreen from '../components/ProfileScreen';
import MainScreen from '../components/MainScreen';
import { BottomTabParamList, ProfileTabParamList, MainTabParamList, HistoryTabParamList } from '../types/navigationTypes';
import HistoryScreen from "../components/HistoryScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="MainTab"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Profile Tab"
        component={ProfileTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="MainTab"
        component={MainTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="HistoryTab"
        component={HistoryTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ProfileStack = createStackNavigator<ProfileTabParamList>();

function ProfileTabNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: 'Profile/Settings' }}
      />
    </ProfileStack.Navigator>
  );
}

const MainTabStack = createStackNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <MainTabStack.Navigator>
      <MainTabStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerTitle: 'Main Tab' }}
      />
    </MainTabStack.Navigator>
  );
}

const HistoryTabStack = createStackNavigator<HistoryTabParamList>();

function HistoryTabNavigator() {
  return (
    <HistoryTabStack.Navigator>
      <HistoryTabStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ headerTitle: 'History' }}
      />
    </HistoryTabStack.Navigator>
  );
}
