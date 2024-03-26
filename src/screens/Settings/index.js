import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  SettingsProvider,
  SettingsGroup,
  SettingsInfoDisplay,
  SettingsToggle,
  SettingsButton,
} from "react-native-settings-ui";
import styles from "./styles";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Settings(props) {
  return (
    <SafeAreaView className={styles.container}>
      <ScrollView>
        <View className="ml-4 mr-4">
          <SettingsProvider theme="light">
            <SettingsGroup title="General" footerText="Hello, this is toggle">
              <SettingsToggle
                title="Default color"
                value={true}
                onValueChange={() => console.log("toggle clicked")}
              />

              <SettingsInfoDisplay
                title="switch 1 state (boolEnable)"
                status={true}
                type="boolEnable"
              />
              <SettingsButton
                title="Press me"
                type="newpage"
                onPress={() => Alert.alert("", "Something happened...")}
              />
            </SettingsGroup>
            <SettingsGroup
              title="My app settings"
              footerText="Hello, this is toggle"
            >
              <SettingsToggle
                title="Default color"
                value={true}
                onValueChange={() => console.log("toggle clicked")}
              />
              <SettingsInfoDisplay
                title="switch 1 state (boolEnable)"
                status={true}
                type="boolEnable"
              />

              <SettingsButton
                title="Press me"
                onPress={() => Alert.alert("", "Something happened...")}
              />
            </SettingsGroup>
          </SettingsProvider>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rectangle: {
    width: 200,
    height: 200,
  },
  spacer: {
    height: 16,
  },
});

export default Settings;
