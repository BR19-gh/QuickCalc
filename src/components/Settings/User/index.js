import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { lang } from "../../../helpers";

// Display the user state based on entitlements (previous purchases)
const User = ({ theme }) => {
  const { user } = useRevenueCat();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const text = (text) => "screens.Settings.Paywall." + text;

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const logg = () => {
    console.log(user);
  };

  function convertToDateOnly(dateTimeString) {
    // Create a Date object from the ISO 8601 string
    const date = new Date(dateTimeString);

    // Extract the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, pad with leading zero if necessary
    const day = String(date.getDate()).padStart(2, "0"); // Pad with leading zero if necessary

    // Format the date as "YYYY-MM-DD"
    const dateOnlyString = `${year}-${month}-${day}`;

    return dateOnlyString;
  }

  const banner =
    lang === "ar"
      ? require(`../../../../assets/golden_version_ar.png`)
      : require(`../../../../assets/golden_version_en.png`);

  return (
    <ScrollView className={"h-full"}>
      <View
        className={
          "flex flex-col items-center " +
          (Dimensions.get("window").width < 376 ? "mt-20" : "mt-24")
        }
      >
        <View
          className={
            "w-80 h-96 rounded-md items-center flex-col justify-center"
          }
        >
          <Image
            source={banner}
            style={{
              marginTop: 150,
              width: 250,
              height: 250,
            }}
          />
          <Text
            className={
              "mt-8  text-md text-2xl " + isDark("text-white", "text-black")
            }
          >
            {user.golden
              ? user.periodType === "TRIAL"
                ? t(text("trial"))
                : t(text("subscribed"))
              : t(text("notSubscribed"))}
          </Text>
          {user.golden && (
            <Text
              className={
                "mt-3 text-md text-xl " + isDark("text-white", "text-black")
              }
            >
              {user.entitlement === "qc_0099_1m"
                ? t(text("oneMonth"))
                : t(text("oneYear"))}
            </Text>
          )}
          {user.golden && (
            <Text className={" text-md " + isDark("text-white", "text-black")}>
              {t(text("subStartDate"))}: {convertToDateOnly(user.subStartDate)}
              {"\n"}
              {t(text("subEndDate"))}: {convertToDateOnly(user.subEndDate)}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => {
              logg();
              navigation.navigate("Paywall");
            }}
            className={
              "mt-8 h-14 rounded-md items-center flex-row justify-center"
            }
            style={{
              width: 180,
              backgroundColor: isDark("#5450D4", "#38377C"),
            }}
          >
            <Text className={"text-xl text-white"}>{t(text("paywall"))}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default User;
