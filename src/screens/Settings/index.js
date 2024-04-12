import { StatusBar } from "expo-status-bar";
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
} from "react-native-settings-ui";
import SettingsButton from "../../components/Settings/Button";
import styles, { stylesSettings } from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SweetSFSymbol from "sweet-sfsymbols";
import { useColorScheme } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Communications from "react-native-communications";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import * as IntentLauncher from "expo-intent-launcher";
import Linking from "react-native/Libraries/Linking/Linking";
import { clearAsyncStorage } from "../../../_DATA";
import { useToast } from "react-native-toast-notifications";
import { connect } from "react-redux";
import { handleInitialData } from "../../store/actions/shared";
import * as Haptics from "expo-haptics";

const openAppPref = (t, text) => {
  if (Platform.OS === "ios") {
    Alert.alert(
      t(text("changeLanguageAlertTitle")),
      t(text("changeLanguageAlertBody")),
      [
        {
          text: t(text("goToSettings")),
          onPress: () => Linking.openURL("App-prefs:root=General"),
          style: "Ok",
        },
        {
          text: t(text("cancel")),
          onPress: () => null,
          style: "cancel",
        },
      ]
    );
  } else {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.SECURITY_SETTINGS
    );
  }
};

const deleteData = (t, text, toast, dispatch) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  Alert.alert(
    t(text("areYouSureYoutoDeleteData")),
    t(text("thisWillDeleteAllData")),
    [
      {
        text: t(text("delete")),
        onPress: () => {
          let refreshToast = toast.show(t(text("deleting")), {
            placement: "top",
            type: "danger",
          });
          clearAsyncStorage();
          setTimeout(() => {
            dispatch(handleInitialData());
            toast.update(refreshToast, t(text("deleteCompeleted")), {
              type: "success",
              duration: 4000,
              placement: "top",
            });
          }, 1000);
        },
        style: "destructive",
      },
      {
        text: t(text("cancel")),
        onPress: () => null,
        style: "cancel",
      },
    ]
  );
};

function Settings({ theme, isThemeChanged, setIsThemeChanged, dispatch }) {
  const [isAuto, setIsAuto] = useState(false);
  const auto = useColorScheme();
  const dropdownRef = useRef(null);
  useEffect(() => {
    const getTheme = async () => {
      try {
        const value = await AsyncStorage.getItem("theme");
        if (value !== null) {
          setIsAuto(false);
        } else {
          // If theme is not set in AsyncStorage, set it based on device's color scheme
          setIsAuto(true);
        }
      } catch (error) {
        console.error("Error getting theme from storage", error);
      }
    };

    getTheme();
  }, [auto, isThemeChanged]);

  const { t } = useTranslation();
  const toast = useToast();
  const text = (text) => "screens.Settings.text." + text;

  const isDarkTextColor = () =>
    theme === "dark" ? "text-white" : "text-black";

  return (
    <SafeAreaView className={styles.container}>
      <ScrollView>
        <View className="ml-4 mr-4">
          <SettingsProvider theme={theme}>
            <View className="mt-8">
              <Text style={stylesSettings.groupTitle}>
                {t(text("general"))}
              </Text>
              <SettingsGroup>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    dropdownRef.current.openDropdown();
                  }}
                >
                  <SettingsInfoDisplay
                    title={t(text("theme"))}
                    status={
                      <SelectDropdown
                        ref={dropdownRef}
                        data={[
                          t(text("auto")),
                          t(text("dark")),
                          t(text("light")),
                        ]}
                        onSelect={(selectedItem, index) => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Heavy
                          );
                          if (index === 0) {
                            const storeTheme = async () => {
                              try {
                                await AsyncStorage.removeItem("theme");
                              } catch (error) {
                                console.error(
                                  "Error storing theme to storage",
                                  error
                                );
                              }
                            };

                            storeTheme();
                            setIsThemeChanged(!isThemeChanged);
                          } else if (index === 1) {
                            const storeTheme = async () => {
                              try {
                                await AsyncStorage.setItem("theme", "dark");
                              } catch (error) {
                                console.error(
                                  "Error storing theme to storage",
                                  error
                                );
                              }
                            };

                            storeTheme();
                            setIsThemeChanged(!isThemeChanged);
                          } else if (index === 2) {
                            const storeTheme = async () => {
                              try {
                                await AsyncStorage.setItem("theme", "light");
                              } catch (error) {
                                console.error(
                                  "Error storing theme to storage",
                                  error
                                );
                              }
                            };

                            storeTheme();
                            setIsThemeChanged(!isThemeChanged);
                          }
                        }}
                        renderButton={(selectedItem, isOpened) => {
                          return (
                            <View
                              style={{
                                width: 70,
                                height: 30,
                                backgroundColor:
                                  theme === "dark" ? "#555555" : "#E9ECEF",
                                borderRadius: 10,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: theme === "dark" ? "#fff" : "#151E26",
                                  flex: 1,
                                  fontSize: 18,
                                  fontWeight: "500",
                                  textAlign: "center",
                                }}
                              >
                                {isAuto ? t(text("auto")) : t(text(theme))}
                              </Text>
                            </View>
                          );
                        }}
                        renderItem={(item, index, isSelected) => {
                          return (
                            <View
                              style={{
                                ...{
                                  width: "100%",
                                  flexDirection: "row",
                                  paddingHorizontal: 12,

                                  paddingVertical: 8,
                                },
                                ...(isSelected && {
                                  backgroundColor:
                                    theme === "dark" ? "#333333" : "#D2D9DF",
                                }),
                              }}
                            >
                              <Text
                                className="text-center"
                                style={{
                                  flex: 1,
                                  fontSize: 18,
                                  fontWeight: "500",
                                  color: theme === "dark" ? "#fff" : "#151E26",
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={{
                          backgroundColor:
                            theme === "dark" ? "#555555" : "#E9ECEF",
                          borderRadius: 8,
                        }}
                      />
                    }
                    type="custom"
                  />
                </TouchableOpacity>
                <SettingsButton
                  title={t(text("language"))}
                  type="newpage"
                  onPress={() => openAppPref(t, text)}
                />
              </SettingsGroup>
            </View>

            <View>
              <Text style={stylesSettings.groupTitle}>
                {t(text("contactDeveloper"))}
              </Text>
              <SettingsGroup>
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text className={isDarkTextColor()}>
                        Ibrahim-abdalaziz@hotmail.com
                      </Text>
                      <Text>{"   "}</Text>
                      <SweetSFSymbol
                        name={"envelope.fill"}
                        size={20}
                        colors={["gray"]}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() =>
                    Communications.email(
                      "Ibrahim-abdalaziz@hotmail.com",
                      null,
                      null,
                      "My Feedback",
                      `
                      Model: ${DeviceInfo.getModel()}\n
                      Brand: ${DeviceInfo.getBrand()}\n
                      OS: ${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}\n
                      App Version: 1.0.0\n
                      ----------------------------------------\n
                      ((write your feedback here...)
                      `
                    )
                  }
                />
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text className={isDarkTextColor()}>BR19.me</Text>
                      <Text>{"   "}</Text>
                      <SweetSFSymbol
                        name={"globe"}
                        size={20}
                        colors={["gray"]}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => Communications.web("https://br19.me")}
                />
              </SettingsGroup>
            </View>
            <View>
              <Text style={stylesSettings.groupTitle}>{t(text("app"))}</Text>
              <SettingsGroup>
                <SettingsInfoDisplay
                  title={t(text("version"))}
                  status={"1.0.0.0"}
                  type="custom"
                />
                <TouchableOpacity
                  onPress={() => deleteData(t, text, toast, dispatch)}
                >
                  <SettingsInfoDisplay
                    title={
                      <Text className={"text-destructive"}>
                        {t(text("deleteData"))}
                      </Text>
                    }
                    status={
                      <SweetSFSymbol
                        name={"trash"}
                        size={20}
                        colors={["#e63746"]}
                      />
                    }
                    type="custom"
                  />
                </TouchableOpacity>
              </SettingsGroup>
            </View>
          </SettingsProvider>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(Settings);
