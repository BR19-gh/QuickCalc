import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
  Dimensions,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState, useRef } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import * as Haptics from "expo-haptics";

import DateInput from "../../../components/Home/CalendarCon/DateInput";
import DropdownComponent from "../../../components/Home/CalendarCon/Dropdown";
import {
  toHijri,
  toGregorian,
  toPersian,
  toHebrew,
  calculateTimeSince,
} from "../../../helpers/Home/CalendarCon";
import { toSolarHijri, toGregorian as toGregorianSolar } from "solarhijri-js";
import { lang } from "../../../helpers";

import { useToast } from "react-native-toast-notifications";

import * as StoreReview from "expo-store-review";
import InlineAd from "../../../components/InlineAd/InlineAd";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

function CalendarCon({ theme }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.CalendarCon.text." + text;
  const secondInput = useRef(null);
  const [isLimited, setIsLimited] = useState(false);
  const [fromText, setFromText] = useState("");
  const [fromCalendar, setFromCalendar] = useState("");
  const [toCalendar, setToCalendar] = useState("");
  const [fromCalendarValue, setFromCalendarValue] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [toCalendarValue, setToCalendarValue] = useState({
    year: "",
    month: "",
    day: "",
    timeSince: null,
  });

  const toast = useToast();

  const copyToClipboard = (str) => {
    Haptics.selectionAsync();
    toast.show(t(text("copied")), {
      placement: "top",
      type: "normal",
      duration: 800,
    });
    Clipboard.setString(str);
    setTimeout(() => {
      StoreReview.requestReview();
    }, 800);
  };

  const switchCur = () => {
    const temp = fromCalendar;
    const temp2 = toCalendar;
    reset();

    if (temp2.value !== "gregorian") {
      setIsLimited(true);
    } else {
      setIsLimited(false);
    }

    setFromCalendar(temp2);
    setToCalendar(temp);
  };

  const calculate = () => {
    if (fromCalendar && toCalendar) {
      if (
        fromCalendarValue.day &&
        fromCalendarValue.month &&
        fromCalendarValue.year &&
        !isNaN(fromCalendarValue.day) &&
        !isNaN(fromCalendarValue.month) &&
        !isNaN(fromCalendarValue.year)
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        let result = {};
        if (fromCalendar.value === "gregorian") {
          if (
            fromCalendarValue.year < 1 ||
            fromCalendarValue.month < 1 ||
            fromCalendarValue.month > 12 ||
            fromCalendarValue.day < 1 ||
            fromCalendarValue.day > 31
          ) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
              t(text("errorInValidInput")),
              t(text("errorInValidInputMsg"))
            );
            return null;
          }
          if (toCalendar.value === "islamicLunar") {
            if (fromCalendarValue.year < 100) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              Alert.alert(
                t(text("errorUnacceptableInput")),
                t(text("errorUnacceptableInputMsg"))
              );
              return null;
            }
            let preResult = toHijri(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: preResult.hy,
              month: preResult.hm,
              day: preResult.hd,
              timeSince: preResult.timeSince,
            };
          } else if (toCalendar.value === "islamicSolar") {
            if (fromCalendarValue.year < 1) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              Alert.alert(
                t(text("errorUnacceptableInput")),
                t(text("errorUnacceptableInputMsg2"))
              );
              return null;
            }
            let preResult = toSolarHijri(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: preResult.hy,
              month: preResult.hm,
              day: preResult.hd,
              timeSince: calculateTimeSince(
                new Date(
                  Number(fromCalendarValue.year),
                  Number(fromCalendarValue.month) - 1,
                  Number(fromCalendarValue.day)
                )
              ),
            };
          } else if (toCalendar.value === "persian") {
            if (fromCalendarValue.year < 100) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              Alert.alert(
                t(text("errorUnacceptableInput")),
                t(text("errorUnacceptableInputMsg"))
              );
              return null;
            }
            result = toPersian(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month) - 1,
              Number(fromCalendarValue.day)
            );
          } else if (toCalendar.value === "hebrew") {
            if (fromCalendarValue.year < 100) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              Alert.alert(
                t(text("errorUnacceptableInput")),
                t(text("errorUnacceptableInputMsg"))
              );
              return null;
            }
            result = toHebrew(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month) - 1,
              Number(fromCalendarValue.day)
            );
          } else {
            result = {
              year: Number(fromCalendarValue.year),
              month: Number(fromCalendarValue.month),
              day: Number(fromCalendarValue.day),
              timeSince: calculateTimeSince(
                new Date(
                  Number(fromCalendarValue.year),
                  Number(fromCalendarValue.month) - 1,
                  Number(fromCalendarValue.day)
                )
                  .toISOString()
                  .split("T")[0]
              ),
            };
          }
        } else if (fromCalendar.value === "islamicLunar") {
          if (
            fromCalendarValue.year < 1 ||
            fromCalendarValue.month < 1 ||
            fromCalendarValue.month > 12 ||
            fromCalendarValue.day < 1 ||
            fromCalendarValue.day > 30
          ) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
              t(text("errorInValidInput")),
              t(text("errorInValidInputMsg"))
            );
            return null;
          }
          if (toCalendar.value === "gregorian") {
            let preResult = toGregorian(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: preResult.gy,
              month: preResult.gm,
              day: preResult.gd,
              timeSince: preResult.timeSince,
            };
          } else if (toCalendar.value === "islamicSolar") {
            let preResult = toGregorian(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );

            let preResult2 = toSolarHijri(
              preResult.gy,
              preResult.gm,
              preResult.gd
            );
            result = {
              year: preResult2.hy,
              month: preResult2.hm,
              day: preResult2.hd,
              timeSince: {
                days: preResult.timeSince.days,
                months: preResult.timeSince.months,
                years: preResult.timeSince.years,
              },
            };
          } else {
            let preResult = toGregorian(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: Number(fromCalendarValue.year),
              month: Number(fromCalendarValue.month),
              day: Number(fromCalendarValue.day),
              timeSince: {
                days: preResult.timeSince.days,
                months: preResult.timeSince.months,
                years: preResult.timeSince.years,
              },
            };
          }
        } else if (fromCalendar.value === "islamicSolar") {
          if (
            fromCalendarValue.year < 1 ||
            fromCalendarValue.month < 1 ||
            fromCalendarValue.month > 12 ||
            fromCalendarValue.day < 1 ||
            fromCalendarValue.day > 31
          ) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
              t(text("errorInValidInput")),
              t(text("errorInValidInputMsg"))
            );
            return null;
          }
          if (toCalendar.value === "gregorian") {
            let preResult = toGregorianSolar(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: preResult.gy,
              month: preResult.gm,
              day: preResult.gd,
              timeSince: calculateTimeSince(
                new Date(
                  Number(preResult.gy),
                  Number(preResult.gm) - 1,
                  Number(preResult.gd)
                )
              ),
            };
          } else if (toCalendar.value === "islamicLunar") {
            let preResult = toGregorianSolar(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            let preResult2 = toHijri(preResult.gy, preResult.gm, preResult.gd);
            result = {
              year: preResult2.hy,
              month: preResult2.hm,
              day: preResult2.hd,
              timeSince: calculateTimeSince(
                new Date(
                  Number(preResult.gy),
                  Number(preResult.gm) - 1,
                  Number(preResult.gd) - 1
                )
              ),
            };
          } else {
            let preResult = toGregorianSolar(
              Number(fromCalendarValue.year),
              Number(fromCalendarValue.month),
              Number(fromCalendarValue.day)
            );
            result = {
              year: Number(fromCalendarValue.year),
              month: Number(fromCalendarValue.month),
              day: Number(fromCalendarValue.day),
              timeSince: {
                days: preResult.gd,
                months: preResult.gm,
                years: preResult.gy,
              },
            };
          }
        }
        setFromText(
          fromCalendar[lang] &&
            `${Number(fromCalendarValue.day)} ${t(
              text(
                "monthsName." +
                  fromCalendar.value +
                  "." +
                  Number(fromCalendarValue.month)
              )
            )} ${fromCalendarValue.year} ${fromCalendar["short"][lang]}`
        );

        setToCalendarValue({
          year: `${result.year}`,
          month: `${result.month}`,
          day: `${result.day}`,
          timeSince: result.timeSince,
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        Alert.alert(
          t(text("errorInValidInput")),
          t(text("errorInValidInputMsg"))
        );
        return null;
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      Alert.alert(
        t(text("errorNoCalendarsSelected")),
        t(text("errorNoCalendarsSelectedMsg"))
      );
    }
    scrollViewSizeChanged(300);
  };

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFromText("");
    setFromCalendar("");
    setToCalendar("");
    setFromCalendarValue({
      year: "",
      month: "",
      day: "",
    });
    setToCalendarValue({
      year: "",
      month: "",
      day: "",
      timeSince: null,
    });
  };

  useEffect(() => {
    setToCalendarValue({
      year: "",
      month: "",
      day: "",
      timeSince: null,
    });
  }, [fromCalendar, toCalendar]);

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);
  useEffect(() => {
    console.log(toCalendarValue);
  }, [toCalendarValue]);

  const scrollViewRef = useRef(null);

  function scrollViewSizeChanged(height) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  const { user } = useRevenueCat();

  return (
    <View>
      <ScrollView
        style={{
          height: user.golden
            ? "100%"
            : Dimensions.get("window").height > 667
            ? "93%"
            : "91%",
        }}
        ref={scrollViewRef}
      >
        <View
          className={
            "w-full " +
            (Dimensions.get("window").height > 667 ? "mt-28" : "mt-20") +
            " items-center"
          }
        >
          <View className={"w-full flex-row justify-evenly"}>
            <View>
              <DropdownComponent
                isFrom={true}
                isLimited={isLimited}
                setIsLimited={setIsLimited}
                selectCalendar={"selectFromCalendar"}
                theme={theme}
                text={text}
                t={t}
                calendar={fromCalendar}
                setCalendar={setFromCalendar}
              />

              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={true}
                date="day"
                calendarValue={fromCalendarValue}
                setCalendarValue={setFromCalendarValue}
              />
              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={true}
                date="month"
                calendarValue={fromCalendarValue}
                setCalendarValue={setFromCalendarValue}
              />
              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={true}
                date="year"
                calendarValue={fromCalendarValue}
                setCalendarValue={setFromCalendarValue}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                switchCur();
              }}
            >
              <SweetSFSymbol
                style={{
                  marginTop: 7,
                }}
                name={"arrow.left.arrow.right"}
                size={25}
                colors={[isDark("#5450D4", "#38377C")]}
              />
            </TouchableOpacity>
            <View>
              <DropdownComponent
                isFrom={false}
                isLimited={isLimited}
                setIsLimited={setIsLimited}
                selectCalendar={"selectToCalendar"}
                theme={theme}
                text={text}
                t={t}
                calendar={toCalendar}
                setCalendar={setToCalendar}
              />
              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={false}
                date="day"
                calendarValue={toCalendarValue}
                setCalendarValue={setToCalendarValue}
              />
              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={false}
                date="month"
                calendarValue={toCalendarValue}
                setCalendarValue={setToCalendarValue}
              />
              <DateInput
                text={text}
                t={t}
                isDark={isDark}
                isEditable={false}
                date="year"
                calendarValue={toCalendarValue}
                setCalendarValue={setToCalendarValue}
              />
            </View>
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "rounded-lg w-48 h-20 mt-14 flex-row items-center justify-evenly"
              }
              style={{ backgroundColor: "#38377C" }}
              onPress={() => {
                try {
                  calculate();
                } catch (err) {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error
                  );
                  if (err.message.includes("Invalid islamic-umalqura date!")) {
                    Alert.alert(
                      t(text("errorCalculating")),
                      t(text("errorInvalidIslamicDate"))
                    );
                  } else {
                    Alert.alert(
                      t(text("errorCalculating")),
                      err.message + "\n\n" + t(text("pleaseShareError"))
                    );
                  }
                }
              }}
            >
              <Text className={styles.btnText}>{t(text("calculate"))}</Text>
              <SweetSFSymbol
                name={"plusminus.circle.fill"}
                size={30}
                colors={["white"]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly"
              }
              style={{ backgroundColor: "#5450D4" }}
              onPress={reset}
            >
              <Text className={"text-xl text-white text-center"}>
                {t(text("reset"))}
              </Text>
              <SweetSFSymbol
                name={"arrow.counterclockwise.circle.fill"}
                size={20}
                colors={["white"]}
              />
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row flex-wrap mt-10">
            <View className="w-full flex-row p-2 text-left">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("from"))}
                  {":  "}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {fromText}
                </Text>
                <Text>{"   "}</Text>
              </>
              {fromText ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() => copyToClipboard(fromText)}
                >
                  <SweetSFSymbol
                    name="doc.on.doc"
                    size={20}
                    colors={[isDark("#DBEAFE", "#1E3A8A")]}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View className="w-full flex-row p-2 text-left">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("to"))}
                  {":  "}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {toCalendar[lang] &&
                  toCalendarValue.day !== "" &&
                  toCalendarValue.month !== "" &&
                  toCalendarValue.year !== ""
                    ? `${toCalendarValue.day} ${t(
                        text(
                          "monthsName." +
                            toCalendar.value +
                            "." +
                            toCalendarValue.month
                        )
                      )} ${toCalendarValue.year} ${toCalendar["short"][lang]}`
                    : ""}
                </Text>
                <Text>{"   "}</Text>
              </>
              {(
                toCalendar[lang] &&
                toCalendarValue.day !== "" &&
                toCalendarValue.month !== "" &&
                toCalendarValue.year !== ""
                  ? `${toCalendarValue.day} ${t(
                      text(
                        "monthsName." +
                          toCalendar.value +
                          "." +
                          toCalendarValue.month
                      )
                    )} ${toCalendarValue.year} ${toCalendar["short"][lang]}`
                  : ""
              ) ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      toCalendarValue.day +
                        " " +
                        t(
                          text(
                            "monthsName." +
                              toCalendar.value +
                              "." +
                              toCalendarValue.month
                          )
                        ) +
                        " " +
                        toCalendarValue.year +
                        " " +
                        toCalendar["short"][lang]
                    )
                  }
                >
                  <SweetSFSymbol
                    name="doc.on.doc"
                    size={20}
                    colors={[isDark("#DBEAFE", "#1E3A8A")]}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View className="w-full flex-row p-2 text-left">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {toCalendar[lang] &&
                  toCalendarValue.day !== "" &&
                  toCalendarValue.month !== "" &&
                  toCalendarValue.year !== "" &&
                  toCalendarValue.timeSince.days >= -1
                    ? t(text("elapsed")) + ":  "
                    : ""}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {toCalendarValue.timeSince !== null
                    ? `${
                        toCalendarValue.timeSince.years > 0
                          ? toCalendarValue.timeSince.years +
                            " " +
                            (toCalendarValue.timeSince.years === 1
                              ? t(text("1year"))
                              : t(text("years")))
                          : ""
                      }${
                        toCalendarValue.timeSince.months > 0
                          ? " " +
                            toCalendarValue.timeSince.months +
                            " " +
                            (toCalendarValue.timeSince.months === 1
                              ? t(text("1month"))
                              : t(text("months")))
                          : ""
                      }${
                        toCalendarValue.timeSince.days > 0
                          ? " " +
                            toCalendarValue.timeSince.days +
                            " " +
                            (toCalendarValue.timeSince.days === 1
                              ? t(text("1day"))
                              : t(text("days")))
                          : ""
                      }`
                    : ""}
                </Text>
                <Text>{"   "}</Text>
              </>
              {(
                toCalendarValue.timeSince !== null
                  ? `${
                      toCalendarValue.timeSince.years > 0
                        ? toCalendarValue.timeSince.years +
                          " " +
                          (toCalendarValue.timeSince.years === 1
                            ? t(text("1year"))
                            : t(text("years")))
                        : ""
                    }${
                      toCalendarValue.timeSince.months > 0
                        ? " " +
                          toCalendarValue.timeSince.months +
                          " " +
                          (toCalendarValue.timeSince.months === 1
                            ? t(text("1month"))
                            : t(text("months")))
                        : ""
                    }${
                      toCalendarValue.timeSince.days > 0
                        ? " " +
                          toCalendarValue.timeSince.days +
                          " " +
                          (toCalendarValue.timeSince.days === 1
                            ? t(text("1day"))
                            : t(text("days")))
                        : ""
                    }`
                  : ""
              ) ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      toCalendarValue.timeSince !== null
                        ? `${
                            toCalendarValue.timeSince.years > 0
                              ? toCalendarValue.timeSince.years +
                                " " +
                                (toCalendarValue.timeSince.years === 1
                                  ? t(text("1year"))
                                  : t(text("years")))
                              : ""
                          }${
                            toCalendarValue.timeSince.months > 0
                              ? " " +
                                toCalendarValue.timeSince.months +
                                " " +
                                (toCalendarValue.timeSince.months === 1
                                  ? t(text("1month"))
                                  : t(text("months")))
                              : ""
                          }${
                            toCalendarValue.timeSince.days > 0
                              ? " " +
                                toCalendarValue.timeSince.days +
                                " " +
                                (toCalendarValue.timeSince.days === 1
                                  ? t(text("1day"))
                                  : t(text("days")))
                              : ""
                          }`
                        : ""
                    )
                  }
                >
                  <SweetSFSymbol
                    name="doc.on.doc"
                    size={20}
                    colors={[isDark("#DBEAFE", "#1E3A8A")]}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
      {user.golden ? null : <InlineAd />}
    </View>
  );
}

const mapStateToProps = ({ calenResult }) => {
  return {
    calenResult,
  };
};

export default connect(mapStateToProps)(CalendarCon);
