import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import { Platform } from "react-native";

import WalkThrough from "../screens/Welcome/WalkThrough";
import Welcome from "../screens/Welcome";

import { useTranslation } from "react-i18next";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const Navigation = ({
  isThemeChanged,
  setIsThemeChanged,
  theme,
  setTheme,
  setGetStartedBtnPressed,
}) => {
  const auto = useColorScheme();
  const { t } = useTranslation();
  const text = (text) => "screens.Welcome.text." + text;

  const [currentTitles, setCurrentTitles] = useState(0);

  const WalkThroughText = (text) => "screens.Welcome.text." + text;

  let titles = Platform.isPad
    ? [
        t(WalkThroughText("welcome")),
        t(WalkThroughText("homePage")),
        t(WalkThroughText("editYourTools")),
        t(WalkThroughText("hiddenTools")),
        t(WalkThroughText("settingsPage")),
        t(WalkThroughText("final")),
      ]
    : [
        t(WalkThroughText("welcome")),
        t(WalkThroughText("homePage")),
        t(WalkThroughText("contextMenu")),
        t(WalkThroughText("editYourTools")),
        t(WalkThroughText("hiddenTools")),
        t(WalkThroughText("swipeAction")),
        t(WalkThroughText("settingsPage")),
        t(WalkThroughText("final")),
      ];

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
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen
          options={{
            headerShown: false,
            title: t(text("welcome")),
          }}
          name="Welcome"
          children={() => (
            <Welcome
              isThemeChanged={isThemeChanged}
              setIsThemeChanged={setIsThemeChanged}
              theme={theme}
              setTheme={setTheme}
              setGetStartedBtnPressed={setGetStartedBtnPressed}
            />
          )}
        />

        <Stack.Screen
          options={{
            title: titles[currentTitles],
          }}
          name="WalkThrough"
          children={() => (
            <WalkThrough
              isFirstTimeLaunch={true}
              setCurrentTitles={setCurrentTitles}
              theme={theme}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
