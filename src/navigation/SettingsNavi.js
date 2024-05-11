import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

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
  const WalkThroughText = (text) => "screens.Home.WalkThrough." + text;

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
          title: t(WalkThroughText("WalkThrough")),
        }}
        name="WalkThrough"
        children={() => <WalkThrough theme={theme} />}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavi;
