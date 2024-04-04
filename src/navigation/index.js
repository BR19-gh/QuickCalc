import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";

import Ioicons from "react-native-vector-icons/Ionicons";
import SweetSFSymbol from "sweet-sfsymbols";

import HomeNavi from "../navigation/HomeNavi";
import SettingsNavi from "../navigation/SettingsNavi";

import { useTranslation } from "react-i18next";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const Navigation = ({ theme, setTheme, isThemeChanged, setIsThemeChanged }) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;

  const [isEditing, setIsEditing] = useState(false);

  const settingsTabNavi = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === "Settings") {
        iconName = focused ? "gear" : "gear";
      } else if (route.name === "Home") {
        iconName = focused ? "house.fill" : "house";
      }
      return <SweetSFSymbol name={iconName} size={size} colors={[color]} />;
    },
    tabBarActiveTintColor: "#3B82F6", //bg-blue-500
    tabBarInactiveTintColor: "gray",
    headerShown: false,
  });

  const auto = useColorScheme();

  useEffect(() => {
    const getTheme = async () => {
      try {
        const value = await AsyncStorage.getItem("theme");
        if (value !== null) {
          setTheme(value);
        } else {
          // If theme is not set in AsyncStorage, set it based on device's color scheme
          setTheme(auto);
        }
        console.log("Current theme is: ", theme);
      } catch (error) {
        console.error("Error getting theme from storage", error);
      }
    };

    getTheme();
  }, [auto, isThemeChanged]);

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
          children={() => (
            <SettingsNavi
              isThemeChanged={isThemeChanged}
              setIsThemeChanged={setIsThemeChanged}
              setTheme={setTheme}
              theme={theme}
            />
          )}
          options={{
            title: t(text("settings")),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
