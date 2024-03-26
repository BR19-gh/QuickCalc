import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";

import Ioicons from "react-native-vector-icons/Ionicons";

import Home from "../screens/Home";
import HeaderRight from "../components/Home/HeaderRight";
import HeaderLeft from "../components/Home/HeaderLeft";
import Settings from "../screens/Settings";
import DiscountCal from "../screens/Home/DiscountCal";
import UnitsCon from "../screens/Home/UnitsCon";
import TipCal from "../screens/Home/TipCal";
import CurrencyCon from "../screens/Home/CurrencyCon";

import { useTranslation } from "react-i18next";
import { NativeModules } from "react-native";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeNavi = ({ isEditing, setIsEditing, theme }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerTranslucent: true,
        headerHideShadow: true,
        headerTitleStyle: {
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderRight isEditing={isEditing} setIsEditing={setIsEditing} />
          ),

          title: isEditing ? t(text("selectToHide")) : t(text("home")),
        }}
        name="HomeNavi"
        children={() => (
          <Home setIsEditing={setIsEditing} isEditing={isEditing} />
        )}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="DiscountCal"
        children={() => <DiscountCal />}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="UnitsCon"
        component={UnitsCon}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="TipCal"
        component={TipCal}
      />
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeft />,
        }}
        name="CurrencyCon"
        component={CurrencyCon}
      />
    </Stack.Navigator>
  );
};
const SettingsNavi = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTranslucent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerHideShadow: true,
        headerTitleStyle: {
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        options={{
          // headerRight: () => <HeaderRight handleEdit={handleEdit} />,
          title: "Settings",
        }}
        name="SettingsNavi"
        component={Settings}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;

  const [isEditing, setIsEditing] = useState(false);

  const settingsTabNavi = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === "Settings") {
        iconName = focused ? "settings" : "settings-outline";
      } else if (route.name === "Home") {
        iconName = focused ? "home" : "home-outline";
      }
      return <Ioicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "rgb(59 130 246)", //bg-blue-500
    tabBarInactiveTintColor: "gray",
    headerShown: false,
  });

  const theme = useColorScheme();

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator screenOptions={settingsTabNavi}>
        <Tab.Screen
          name="Home"
          children={() => (
            <HomeNavi
              theme={theme}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
          options={{
            title: t(text("home")),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsNavi}
          options={{
            title: t(text("settings")),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
