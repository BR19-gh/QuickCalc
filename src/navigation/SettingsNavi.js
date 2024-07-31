import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { useState } from "react";

import WalkThrough from "../screens/Welcome/WalkThrough";

import { Platform } from "react-native";
import Paywall from "../screens/Settings/Paywall";
import { TermsOfUse } from "../screens/Settings/Paywall/TermsOfUse";
import User from "../components/Settings/User";
import ChangeColor from "../screens/Settings/ChangeIcon";

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
          <WalkThrough
            isFirstTimeLaunch={false}
            setCurrentTitles={setCurrentTitles}
            theme={theme}
          />
        )}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          header: () => null,
        }}
        name="Paywall"
        children={() => <Paywall theme={theme} />}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: t(text("termsOfUse")),
        }}
        name="termsOfUse"
        children={() => <TermsOfUse theme={theme} />}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          headerTitle: t(text("currentPlan")),
        }}
        name="user"
        children={() => <User theme={theme} />}
      />
      <Stack.Screen
        options={{
          headerTitle: t("screens.Settings.text.changeIcon"),
          // presentation: "fullScreenModal",
          // header: () => null,
        }}
        name="ChangeColor"
        children={() => <ChangeColor theme={theme} />}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavi;
