import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

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

export default SettingsNavi;
