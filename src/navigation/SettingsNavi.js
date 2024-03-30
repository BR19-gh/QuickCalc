import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

const SettingsNavi = ({
  theme,
  setTheme,
  isThemeChanged,
  setIsThemeChanged,
}) => {
  const { t } = useTranslation();
  const text = (text) => "screens.Navi.text." + text;

  return (
    <Stack.Navigator
      screenOptions={{
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
    </Stack.Navigator>
  );
};

export default SettingsNavi;
