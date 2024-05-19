import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { useState } from "react";

import WalkThrough from "../screens/Welcome/WalkThrough";

const Stack = createNativeStackNavigator();

const SettingsNavi = ({
  theme,
  setTheme,
  isThemeChanged,
  setIsThemeChanged,
}) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;
  const WalkThroughText = (text) => "screens.Welcome.text." + text;

  const [currentTitles, setCurrentTitles] = useState(0);

  let titles =
    Platform.OS === "macos"
      ? [
          t(WalkThroughText("welcome")),
          t(WalkThroughText("homePage")),
          t(WalkThroughText("editYourTools")),
          t(WalkThroughText("hiddenTools")),
          t(WalkThroughText("settingsPage")),
        ]
      : [
          t(WalkThroughText("welcome")),
          t(WalkThroughText("homePage")),
          t(WalkThroughText("contextMenu")),
          t(WalkThroughText("editYourTools")),
          t(WalkThroughText("hiddenTools")),
          t(WalkThroughText("swipeAction")),
          t(WalkThroughText("settingsPage")),
        ];

  return (
    <Stack.Navigator
      screenOptions={{
        headerBlurEffect: theme,
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: t(text("settings")),
        }}
        name="SettingsNavi"
        children={() => (
          <Settings
            isThemeChanged={isThemeChanged}
            setIsThemeChanged={setIsThemeChanged}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      />
      <Stack.Screen
        options={{
          title: titles[currentTitles],
        }}
        name="WalkThrough"
        children={() => (
          <WalkThrough setCurrentTitles={setCurrentTitles} theme={theme} />
        )}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavi;
