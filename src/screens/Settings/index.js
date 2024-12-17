import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  SettingsProvider,
  SettingsGroup,
  SettingsInfoDisplay,
} from "react-native-settings-ui";
import SettingsButton from "../../components/Settings/Button";
import styles, { stylesSettings } from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";
import { useColorScheme } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Communications from "react-native-communications";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking } from "react-native";
import { clearAsyncStorage } from "../../../_DATA";
import { useToast } from "react-native-toast-notifications";
import { connect } from "react-redux";
import { handleInitialData } from "../../store/actions/shared";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { lang } from "../../helpers";
import * as StoreReview from "expo-store-review";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import SettingsIcon from "../../components/Settings/SettingsIcon";
import { LinearGradient } from "expo-linear-gradient";

const openAppPref = (t, text) => {
  if (Platform.OS === "ios") {
    Alert.alert(
      t(text("changeLanguageAlertTitle")),
      t(text("changeLanguageAlertBody")),
      [
        {
          text: t(text("goToSettings")),
          onPress: () => Linking.openURL("app-settings:"),
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
            setTimeout(() => {
              StoreReview.requestReview();
            }, 500);
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
  const { user } = useRevenueCat();

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

  const navigation = useNavigation();

  const [loadingNote, setLoadingNote] = useState(false);

  const handlePressNote = () => {
    setLoadingNote(true);
    fetch("https://br19.pythonanywhere.com/getNote")
      .then((response) => response.json())
      .then((data) => {
        if (data.note !== undefined) {
          navigation.navigate("Note", {
            note: data.note,
          });
        }
      })
      .catch((error) => {
        Alert.alert(t(text("errorNoteTitle")), t(text("errorNoteMsg")));
      })
      .finally(() => {
        setLoadingNote(false);
      });
  };

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
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(t(text("language")))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="globe"
                        bgColor={"#3b82f6"}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => openAppPref(t, text)}
                />
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("goldenVersion"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="crown.fill"
                        bgColor={"#eab308"}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => {
                    user.golden
                      ? navigation.navigate("user")
                      : navigation.navigate("Paywall");
                  }}
                />
              </SettingsGroup>
            </View>
            <View>
              <Text style={stylesSettings.groupTitle}>
                {t(text("appearance"))}
              </Text>
              <SettingsGroup>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    dropdownRef.current.openDropdown();
                  }}
                >
                  <SettingsInfoDisplay
                    title={
                      <View className="flex-row-reverse justify-end items-center">
                        <Text
                          className={isDarkTextColor()}
                          style={{
                            fontSize: 18,
                            fontWeight: 400,
                          }}
                        >
                          {t(text("theme"))}
                        </Text>
                        <Text>{"   "}</Text>
                        <LinearGradient
                          colors={
                            theme === "dark"
                              ? ["#313131", "#141414"]
                              : ["#555555", "#555555"]
                          }
                          style={{
                            marginStart: lang === "ar" ? 0 : 4,
                            alignItems: "center",
                            padding: 6,
                            width: 30,
                            height: 30,
                            borderRadius: 5,
                            borderColor: theme === "dark" ? "#626262" : "white",
                            borderWidth: 0.5,
                          }}
                        >
                          <SweetSFSymbol
                            name={"platter.2.filled.iphone"}
                            size={18}
                            colors={[theme === "dark" ? "#555555" : "white"]}
                          />
                        </LinearGradient>
                      </View>
                    }
                    status={
                      <SelectDropdown
                        ref={dropdownRef}
                        data={[
                          t(text("auto")),
                          t(text("dark")),
                          t(text("light")),
                        ]}
                        defaultValue={isAuto ? t(text("auto")) : theme}
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
                              }}
                            >
                              <Text
                                className="text-center"
                                style={{
                                  flex: 1,
                                  fontSize: 18,
                                  fontWeight: "300",
                                  color: theme === "dark" ? "#fff" : "#151E26",
                                  ...(isSelected && {
                                    fontWeight: "bold",
                                  }),
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
                            theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                          borderRadius: 8,
                        }}
                      />
                    }
                    type="custom"
                  />
                </TouchableOpacity>
                {DeviceInfo.getModel().includes(
                  "iPad Pro 12.9-inch (3rd generation)"
                ) ? null : (
                  <SettingsButton
                    title={
                      <View className="flex-row-reverse justify-end items-center">
                        <Text
                          className={isDarkTextColor()}
                          style={{
                            fontSize: 18,
                            fontWeight: 400,
                          }}
                        >
                          {t(text("appIcon"))}
                        </Text>
                        <Text>{"   "}</Text>
                        <SettingsIcon
                          theme={theme}
                          name="questionmark.app.fill"
                          bgColor={"#8b5cf6"}
                        />
                      </View>
                    }
                    type="newpage"
                    onPress={() => navigation.navigate("ChangeColor")}
                  />
                )}
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
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("email"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="envelope.fill"
                        bgColor={"#8E8E93"}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() =>
                    Communications.email(
                      ["Ibrahim-abdalaziz@hotmail.com"],
                      null,
                      null,
                      lang === "ar"
                        ? "اكتب عنوانا يختصر ملاحظاتك"
                        : "Write a subject that summarizes your feedback",
                      lang === "ar"
                        ? `الجهاز: ${DeviceInfo.getModel()}
                        الطراز: ${DeviceInfo.getBrand()}
                        إصدار التطبيق: ${t("screens.versionNum")}
                        ----------------------------------------\n
                        ((اكتب ملاحظاتك هنا...))
                        `
                        : `
                        Model: ${DeviceInfo.getModel()}
                        Brand: ${DeviceInfo.getBrand()}
                        OS: ${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}
                        App Version: ${t("screens.versionNum")}
                        ----------------------------------------\n
                        ((write your feedback here...)
                        `
                    )
                  }
                />
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("website"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="globe.badge.chevron.backward"
                        bgColor={"#22c55e"}
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
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("walkThrough"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="info.circle.fill"
                        bgColor={"#FF453A"}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => navigation.navigate("WalkThrough")}
                />
                <SettingsInfoDisplay
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("version"))}
                      </Text>
                    </View>
                  }
                  status={
                    <Text
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                      style={{
                        fontWeight: 400,
                        fontSize: 18,
                      }}
                    >
                      {t("screens.versionNum") +
                        (Platform.isPad ? "(desktop)" : "")}
                    </Text>
                  }
                  type="custom"
                />
                <TouchableOpacity
                  onPress={() => deleteData(t, text, toast, dispatch)}
                >
                  <SettingsInfoDisplay
                    title={
                      <View className="flex-row-reverse justify-end items-center">
                        <Text
                          className="text-destructive"
                          style={{
                            fontSize: 18,
                            fontWeight: 400,
                          }}
                        >
                          {t(text("deleteData"))}
                        </Text>
                      </View>
                    }
                    status={
                      <SweetSFSymbol
                        name={"trash"}
                        size={17}
                        colors={["#e63746"]}
                      />
                    }
                    type="custom"
                  />
                </TouchableOpacity>
              </SettingsGroup>
            </View>
            <View>
              <Text style={stylesSettings.groupTitle}>{t(text("other"))}</Text>
              <SettingsGroup>
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("notification"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <LinearGradient
                        colors={
                          theme === "dark"
                            ? ["#313131", "#141414"]
                            : ["#f472b6", "#f472b6"]
                        }
                        style={{
                          alignItems: "center",
                          padding: 6,
                          width: 30,
                          height: 30,
                          borderRadius: 5,
                          borderColor: theme === "dark" ? "#626262" : "white",
                          borderWidth: 0.5,
                        }}
                      >
                        {loadingNote ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <SweetSFSymbol
                            name={"bell.badge.fill"}
                            size={17}
                            colors={[theme === "dark" ? "#f472b6" : "white"]}
                          />
                        )}
                      </LinearGradient>
                    </View>
                  }
                  type="newpage"
                  onPress={() => handlePressNote()}
                />
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("rateApp"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        bgColor="#FF9F09"
                        name="star.leadinghalf.filled"
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => {
                    const itunesItemId = 6502615780;
                    Linking.openURL(
                      `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
                    );
                  }}
                />
                <SettingsButton
                  title={
                    <View className="flex-row-reverse justify-end items-center">
                      <Text
                        className={isDarkTextColor()}
                        style={{
                          fontSize: 18,
                          fontWeight: 400,
                        }}
                      >
                        {t(text("helpTranslate"))}
                      </Text>
                      <Text>{"   "}</Text>
                      <SettingsIcon
                        theme={theme}
                        name="bubble.left.and.text.bubble.right.fill"
                        bgColor={"#FF375F"}
                      />
                    </View>
                  }
                  type="newpage"
                  onPress={() => {
                    Communications.web(
                      "https://crowdin.com/project/quickcalc/invite?h=6bad2d157dbed6c0a955ee2fd59fecde2260881"
                    );
                  }}
                />
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
