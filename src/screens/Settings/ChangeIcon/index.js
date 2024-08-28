import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { SettingsProvider, SettingsGroup } from "react-native-settings-ui";
import styles, { stylesSettings } from "./styles";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { setAppIcon, getAppIcon } from "expo-dynamic-app-icon";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useNavigation } from "@react-navigation/native";

function ChangeColor({ theme }) {
  const { t } = useTranslation();
  const toast = useToast();
  const text = (text) => "screens.Settings.text." + text;

  const { user } = useRevenueCat();
  const navigation = useNavigation();

  const APP_ICONS = [
    { name: "original", img: require("../../../../assets/icon.png") },
    { name: "black", img: require("../../../../assets/black_icon.png") },
    { name: "red", img: require("../../../../assets/red_icon.png") },
    { name: "yellow", img: require("../../../../assets/yellow_icon.png") },
    { name: "pink", img: require("../../../../assets/pink_icon.png") },
    { name: "purple", img: require("../../../../assets/purple_icon.png") },
    { name: "orange", img: require("../../../../assets/orange_icon.png") },
    { name: "green", img: require("../../../../assets/green_icon.png") },
  ];

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const [iconName, setIconName] = useState("");

  const changeIcon = (name) => {
    if (user.golden) {
      Haptics.selectionAsync();
      setIconName(name);
      setAppIcon(name);
    } else {
      return Alert.alert(
        t(text("notSubAlertTitle")),
        t(text("notSubAlertMsg")),
        [
          {
            text: t(text("gotIt")),
            style: "default",
            onPress: () => {
              navigation.navigate("Paywall");
            },
          },
        ]
      );
    }
  };

  useEffect(() => console.log(iconName, getAppIcon()), [iconName]);

  const COLORS = {
    light: {
      textColor: "#666666",
      borderColor: "#eee",
      containerColor: "#fff",
      blackwhite: "#000",
      gray: "#4B4B4B",
    },
    dark: {
      textColor: "#eaeaea",
      borderColor: "#0a0a0a",
      containerColor: "#2A2A2A",
      blackwhite: "#fff",
      gray: "#eaeaea",
    },
  };

  return (
    <ScrollView>
      <View
        className={
          "ml-4 mr-4 " +
          (Dimensions.get("window").height > 667 ? "mt-20" : "mt-12")
        }
      >
        <SettingsProvider theme={theme}>
          <View className="mt-8">
            <Text style={stylesSettings.groupTitle}>{t(text("appIcon"))}</Text>
            <SettingsGroup>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark(
                    COLORS.dark.borderColor,
                    COLORS.light.borderColor
                  ),
                  backgroundColor: isDark(
                    COLORS.dark.containerColor,
                    COLORS.light.containerColor
                  ),
                }}
              >
                <View className="items-center flex-row flex-wrap justify-between">
                  {APP_ICONS.map((icon, index) => (
                    <TouchableOpacity
                      onPress={() => changeIcon(icon.name)}
                      key={index}
                      className="m-1 items-center text-center"
                    >
                      <Image
                        source={icon.img}
                        style={{
                          borderWidth:
                            getAppIcon() === icon.name
                              ? Platform.isPad
                                ? 3
                                : 2
                              : 0,
                          borderColor: "#3B82F6",
                          borderRadius: Platform.isPad ? 16 : 11.25,
                          width: Platform.isPad ? 90 : 64,
                          height: Platform.isPad ? 90 : 64,
                        }}
                      />
                      <Text
                        className={
                          (Platform.isPad ? "text-lg " : "text-sm ") +
                          (getAppIcon() === icon.name
                            ? "text-blue-500"
                            : isDark("text-white", "text-black"))
                        }
                      >
                        {t(text(icon.name))}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </SettingsGroup>
          </View>
        </SettingsProvider>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

export default ChangeColor;
