import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { SettingsProvider, SettingsGroup } from "react-native-settings-ui";
import { stylesSettings } from "./styles";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import {
  setAlternateAppIcon,
  getAppIconName,
  resetAppIcon,
} from "expo-alternate-app-icons";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useNavigation } from "@react-navigation/native";
import SweetSFSymbol from "sweet-sfsymbols";
import { lang } from "../../../helpers";

function ChangeColor({ theme }) {
  const { t } = useTranslation();
  const toast = useToast();
  const text = (text) => "screens.Settings.text." + text;

  const { user } = useRevenueCat();
  const navigation = useNavigation();

  const APP_ICONS = [
    { name: "darkIcon", img: require("../../../../assets/dark_icon.png") },
    { name: "tinted", img: require("../../../../assets/icon-tinted.png") },
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

  const changeIcon = async (name) => {
    if (
      user.golden ||
      name === "darkIcon" ||
      name === null ||
      name === "tinted"
    ) {
      Haptics.selectionAsync();
      setIconName(name);
      await setAlternateAppIcon(name);
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

  useEffect(() => console.log(iconName, getAppIconName()), [iconName]);

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
                <View className="items-center flex-row flex-wrap justify-around -mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync();
                      resetAppIcon();
                      setIconName(null);
                    }}
                    className="items-center text-center"
                    style={{
                      margin: Platform.isPad ? 5 : 1,
                    }}
                  >
                    <SweetSFSymbol
                      name="crown.fill"
                      size={18}
                      colors={["transparent"]}
                      style={{
                        position: "relative",
                        right: 30,
                        top: 5,
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: "#3B82F6",
                        borderRadius: Platform.isPad ? 15 : 10.25,
                        width: Platform.isPad ? 70 : 60,
                        height: Platform.isPad ? 70 : 60,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SweetSFSymbol
                        name="arrow.counterclockwise.circle.fill"
                        size={40}
                        colors={["white"]}
                      />
                    </View>
                    <Text
                      className={
                        (Platform.isPad ? "text-lg " : "text-sm ") +
                        isDark("text-white", "text-black")
                      }
                    >
                      {t("screens.Home.CreatedTool.text.reset")}
                    </Text>
                  </TouchableOpacity>
                  {APP_ICONS.map((icon, index) => (
                    <TouchableOpacity
                      onPress={() => changeIcon(icon.name)}
                      key={index}
                      className="items-center text-center"
                      style={{
                        margin: Platform.isPad ? 5 : 1,
                      }}
                    >
                      {user.golden ||
                      icon.name === null ||
                      icon.name === "darkIcon" ||
                      icon.name === "tinted" ? (
                        <SweetSFSymbol
                          name="crown.fill"
                          size={18}
                          colors={["transparent"]}
                          style={{
                            position: "relative",
                            right: 30,
                            top: 5,
                          }}
                        />
                      ) : (
                        <SweetSFSymbol
                          name="crown.fill"
                          size={16}
                          colors={["gold"]}
                          style={{
                            zIndex: 1,
                            position: "relative",
                            top: 5,
                            transform: [
                              {
                                rotate: "-30deg",
                              },
                            ],
                            left: lang === "ar" ? 30 : -30,
                          }}
                        />
                      )}
                      <Image
                        source={icon.img}
                        style={{
                          borderWidth:
                            getAppIconName() === icon.name
                              ? Platform.isPad
                                ? 3
                                : 2
                              : 0,
                          borderColor: "#3B82F6",
                          borderRadius: Platform.isPad ? 15 : 10.25,
                          width: Platform.isPad ? 70 : 60,
                          height: Platform.isPad ? 70 : 60,
                        }}
                      />
                      <Text
                        className={
                          (Platform.isPad ? "text-lg " : "text-sm ") +
                          (getAppIconName() === icon.name
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
