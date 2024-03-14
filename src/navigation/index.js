import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ioicons from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

import Welcome from "../screens/Welcome";
import Home from "../screens/Home";
import Settings from "../screens/Settings";

import { handleInitialData } from "../store/actions/shared";

//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = (props) => {
  useEffect(() => {
    props.dispatch(handleInitialData());
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            } else if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            }

            // You can return any component that you like here!
            return <Ioicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4299e1", //bg-blue-500
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={Home} />

        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = ({ accounts }) => ({
  accounts,
});

export default connect(mapStateToProps)(Navigation);
