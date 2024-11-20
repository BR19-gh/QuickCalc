import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import SweetSFSymbol from "sweet-sfsymbols";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { lang } from "../../../helpers";
import * as Haptics from "expo-haptics";

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

  function dateDifference(startDate, endDate) {
    // Parse the input dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in time
    const diffTime = Math.abs(end - start);

    // Convert the difference from milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 1
      ? diffDays + " " + t("screens.Settings.Paywall.days")
      : diffDays + " " + t("screens.Settings.Paywall.day");
  }

  const banner =
    lang === "ar"
      ? require(`../../../../assets/golden_version_ar.png`)
      : require(`../../../../assets/golden_version_en.png`);

  return (
    <ScrollView className={"h-full"}>
      <TouchableOpacity
        className={
          "w-7 h-7 bg-transparent mt-20 ml-3 z-10 rounded-full flex items-center justify-center"
        }
      >
        <SweetSFSymbol
          name={"multiply.circle.fill"}
          size={32}
          colors={["transparent"]}
        />
      </TouchableOpacity>
      <View
        className={
          "flex flex-col items-center " +
          (Dimensions.get("window").width < 376 ? "-mt-5" : "mt-6")
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
              marginTop: 135,
              width: 190,
              height: 190,
            }}
          />
          <Text
            className={
              "mt-5 mb-1 text-md text-2xl " + isDark("text-white", "text-black")
            }
          >
            {user.golden
              ? user.periodType === "TRIAL"
                ? t(text("trial"))
                : t(text("subscribed"))
              : t(text("notSubscribed"))}
          </Text>

          {user.golden && (
            <View className={"flex-wrap flex-row items-center justify-center"}>
              <View className={"flex flex-col items-center justify-center m-2"}>
                <Text
                  className={"text-sm " + isDark("text-white", "text-black")}
                >
                  {t(text("subStartDate"))}
                </Text>
                <View
                  className={
                    "h-14 mt-1 rounded-md items-center flex-row justify-center"
                  }
                  style={{
                    width: 135,
                    backgroundColor: isDark("#38377C", "#5450D4"),
                  }}
                >
                  <Text className={"text-lg text-white"}>
                    {convertToDateOnly(user.subStartDate)}
                  </Text>
                </View>
              </View>
              <View className={"flex flex-col items-center justify-center m-2"}>
                <Text
                  className={"text-sm " + isDark("text-white", "text-black")}
                >
                  {t(text("subEndDate"))}
                </Text>
                <View
                  className={
                    "h-14 mt-1 rounded-md items-center flex-row justify-center"
                  }
                  style={{
                    width: 135,
                    backgroundColor: isDark("#38377C", "#5450D4"),
                  }}
                >
                  <Text className={"text-lg text-white"}>
                    {convertToDateOnly(user.subEndDate)}
                  </Text>
                </View>
              </View>
              {user.golden && user.periodType !== "TRIAL" && (
                <View
                  className={"flex flex-col items-center justify-center m-2"}
                >
                  <Text
                    className={"text-sm " + isDark("text-white", "text-black")}
                  >
                    {t(text("subscriptionPeriod"))}
                  </Text>
                  <View
                    className={
                      "h-14 mt-1 rounded-md items-center flex-row justify-center"
                    }
                    style={{
                      width: 135,
                      backgroundColor: isDark("#38377C", "#5450D4"),
                    }}
                  >
                    <Text className={"text-lg text-white"}>
                      {user.entitlement === "qc_0099_1m"
                        ? t(text("oneMonthTitle"))
                        : t(text("oneYearTitle"))}
                    </Text>
                  </View>
                </View>
              )}
              <View className={"flex flex-col items-center justify-center m-2"}>
                <Text
                  className={"text-sm " + isDark("text-white", "text-black")}
                >
                  {t(text("remaining"))}
                </Text>
                <View
                  className={
                    "h-14 mt-1 rounded-md items-center flex-row justify-center"
                  }
                  style={{
                    width: 135,
                    backgroundColor: isDark("#38377C", "#5450D4"),
                  }}
                >
                  <Text className={"text-lg text-white"}>
                    {dateDifference(Date.now(), user.subEndDate)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              logg();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("Paywall");
            }}
            className={
              "mt-5 h-14 rounded-md items-center flex-row justify-center"
            }
            style={{
              width: 180,
              backgroundColor: isDark("#5450D4", "#38377C"),
            }}
          >
            <Text className={"text-lg font-bold text-white"}>
              {t(text("paywall"))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default User;
