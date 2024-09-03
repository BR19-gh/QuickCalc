import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useNavigation } from "@react-navigation/native";
//import { PurchasesPackage } from "react-native-purchases";
import User from "../../../components/Settings/User";
import { useTranslation } from "react-i18next";
import SweetSFSymbol from "sweet-sfsymbols";
import { Image } from "expo-image";
import { lang } from "../../../helpers";
import Communications from "react-native-communications";
import { useToast } from "react-native-toast-notifications";
import DeviceInfo from "react-native-device-info";
import * as Haptics from "expo-haptics";

const Paywall = ({ theme }) => {
  const navigation = useNavigation();
  const {
    user,
    packages,
    purchasePackage,
    restorePermissions,
    presentCodeRedemptionSheet,
  } = useRevenueCat();

  const { t } = useTranslation();
  const text = (text) => "screens.Settings.Paywall." + text;
  const toast = useToast();

  const onPurchase = async (pack /*: PurchasesPackage*/) => {
    // Purchase the package
    purchasePackage(pack);
    setTimeout(() => {
      // After purchase is complete, navigate to the user page
      navigation.goBack();
    }, 1000);
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const FEATURES = [
    "screens.Settings.Paywall.features.1",
    "screens.Settings.Paywall.features.2",
    "screens.Settings.Paywall.features.3",
    "screens.Settings.Paywall.features.6",
    "screens.Settings.Paywall.features.4",
    "screens.Settings.Paywall.features.5",
  ];

  const banner =
    lang === "ar"
      ? require(`../../../../assets/golden_version_ar.png`)
      : require(`../../../../assets/golden_version_en.png`);

  const [isRestoreLoad, setIsRestoreLoad] = React.useState(false);

  return (
    <ScrollView className={"h-full"}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}
        className={
          "w-7 h-7 bg-white mt-4 ml-3 z-10 rounded-full flex items-center justify-center"
        }
      >
        <SweetSFSymbol
          name={"multiply.circle.fill"}
          size={32}
          colors={[isDark("#5450D4", "#38377C")]}
        />
      </TouchableOpacity>
      <View
        className={
          "flex flex-col items-center " +
          (Dimensions.get("window").width < 376 ? "-mt-6" : "mt-10")
        }
      >
        <Image
          source={banner}
          style={{
            width: 1650 / 8,
            height: 1275 / 8,
          }}
        />
        <View
          style={{
            marginTop: 8,
            marginBottom: 8,
          }}
        />
        <View className="w-72">
          {FEATURES.map((feature, index) =>
            DeviceInfo.getModel().includes(
              "iPad Pro 12.9-inch (3rd generation)"
            ) && index === 3 ? null : (
              <Text
                key={feature}
                className={
                  "text-left font-semibold pb-2 " +
                  isDark("text-white", "text-black")
                }
                style={{
                  fontSize: 14,
                }}
              >
                <SweetSFSymbol
                  name={"crown.fill"}
                  size={18}
                  colors={[isDark("gold", "orange")]}
                />
                {"     " + t(feature)}
              </Text>
            )
          )}
        </View>
        <View
          style={{
            marginTop: 4,
            marginBottom: 4,
          }}
        />
        <View className={"flex flex-col items-center p-5 rounded-lg"}>
          <Text
            className={
              "text-center font-semibold pb-2 text-xs " +
              isDark("text-white", "text-black")
            }
          >
            {t(text("description"))}
          </Text>
          {packages.map((pack) => (
            <TouchableOpacity
              key={pack.identifier}
              onPress={() => onPurchase(pack)}
              className={
                "w-72 pl-3 pr-3 m-1 flex-row h-14 rounded-md items-center justify-between"
              }
              style={{ backgroundColor: isDark("#38377C", "#5450D4") }}
            >
              <Text className={"text-white text-xl"}>
                {" "}
                {pack.product.identifier === "qc_0099_1m"
                  ? t(text("oneMonthTitle"))
                  : t(text("oneYearTitle"))}
              </Text>
              <Text className={"text-white text-lg font-bold"}>
                {pack.product.priceString}
              </Text>
            </TouchableOpacity>
          ))}
          <View className="flex-row justify-between w-72">
            <TouchableOpacity
              onPress={async () => {
                setIsRestoreLoad(true);
                try {
                  restorePermissions();
                  setTimeout(() => {
                    setIsRestoreLoad(false);
                    Alert.alert(
                      t(text("restoreTitle")),
                      t(text("restoreMsg")),
                      [
                        {
                          text: t(text("ok")),
                          style: "default",
                          onPress: () => {
                            navigation.navigate("user");
                          },
                        },
                      ],
                      {
                        cancelable: false,
                      }
                    );
                  }, 1000);
                } catch (e) {
                  setTimeout(() => {
                    setIsRestoreLoad(false);
                    Alert.alert(
                      t(text("restoreErrTitle")),
                      t(text("restoreErrMsg")),
                      [
                        {
                          text: t(text("ok")),
                          style: "default",
                        },
                      ],
                      {
                        cancelable: false,
                      }
                    );
                  }, 1000);
                  Alert.alert(
                    t(text("restoreErrTitle")),
                    t(text("restoreErrMsg")),
                    [
                      {
                        text: t(text("ok")),
                        style: "default",
                      },
                    ],
                    {
                      cancelable: false,
                    }
                  );
                }
              }}
              className={
                "mt-1 h-9 rounded-md items-center flex-row justify-center"
              }
              style={{
                width: 140,
                backgroundColor: isDark("#5450D4", "#38377C"),
              }}
            >
              <Text className={"text-white text-md"}>
                {isRestoreLoad ? t(text("restoreLoading")) : t(text("restore"))}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => presentCodeRedemptionSheet()}
              className={
                "mt-1 h-9 rounded-md items-center flex-row justify-center"
              }
              style={{
                width: 140,
                backgroundColor: isDark("#5450D4", "#38377C"),
              }}
            >
              <Text className={"text-white text-md"}>
                {t(text("promocode"))}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row w-72 justify-between">
            <TouchableOpacity
              className={"mt-1 rounded-md items-center flex-row justify-center"}
              style={{
                width: 93,
              }}
              onPress={() =>
                Communications.web(
                  "https://www.freeprivacypolicy.com/live/e46da1e0-5c14-4228-921d-9a83c222efd2"
                )
              }
            >
              <Text className={"text-xs " + isDark("text-white", "text-black")}>
                {t(text("privacy"))}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={"mt-1 rounded-md items-center flex-row justify-center"}
              style={{
                width: 93,
              }}
              onPress={() => navigation.navigate("termsOfUse")}
            >
              <Text className={"text-xs " + isDark("text-white", "text-black")}>
                {t(text("termsOfUse"))}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={"mt-1 rounded-md items-center flex-row justify-center"}
              style={{
                width: 93,
              }}
              onPress={() => navigation.navigate("user")}
            >
              <Text className={"text-xs " + isDark("text-white", "text-black")}>
                {t(text("currentPlan"))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Paywall;
