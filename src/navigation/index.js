import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";

import Ioicons from "react-native-vector-icons/Ionicons";

import HomeNavi from "../navigation/HomeNavi";
import SettingsNavi from "../navigation/SettingsNavi";

import { useTranslation } from "react-i18next";

import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

const Tab = createBottomTabNavigator();

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
