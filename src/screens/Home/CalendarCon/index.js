import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useRef } from "react";

import * as Haptics from "expo-haptics";

import DateInput from "../../../components/Home/CalendarCon/DateInput";
import DropdownComponent from "../../../components/Home/CalendarCon/Dropdown";
import {
  toHijri,
  toGregorian,
  toPersian,
  toHebrew,
} from "../../../helpers/Home/CalendarCon";
import { toSolarHijri, toGregorian as toGregorianSolar } from "solarhijri-js";
import { lang, CALENDAR_INFO } from "../../../helpers";

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
  });

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
            };
          } else {
            result = {
              year: Number(fromCalendarValue.year),
              month: Number(fromCalendarValue.month),
              day: Number(fromCalendarValue.day),
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
            };
          } else {
            result = {
              year: Number(fromCalendarValue.year),
              month: Number(fromCalendarValue.month),
              day: Number(fromCalendarValue.day),
            };
          }
        }
        setFromText(
          fromCalendar[lang] &&
            `${fromCalendarValue.day} ${t(
              text(
                "monthsName." +
                  fromCalendar.value +
                  "." +
                  fromCalendarValue.month
              )
            )} ${fromCalendarValue.year} ${fromCalendar["short"][lang]}`
        );

        setToCalendarValue({
          year: `${result.year}`,
          month: `${result.month}`,
          day: `${result.day}`,
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
    });
  };

  useEffect(() => {
    setToCalendarValue({
      year: "",
      month: "",
      day: "",
    });
  }, [fromCalendar, toCalendar]);

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  return (
    <View>
      <ScrollView className="h-full">
        <View className={"w-full mt-32 items-center"}>
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
                colors={[isDark("#0082F6", "#1E3A8A")]}
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
                "rounded-lg w-48 h-20 mt-14 flex-row items-center justify-evenly" +
                isDark(" bg-blue-900 ", " bg-blue-500 ")
              }
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
                "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly bg-blue-700"
              }
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
              <Text
                className={
                  "text-2xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("from"))}
                {":  "}
              </Text>
              <Text
                className={
                  "text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {fromText}
              </Text>
            </View>

            <View className="w-full flex-row p-2 text-left">
              <Text
                className={
                  "text-2xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("to"))}
                {":  "}
              </Text>
              <Text
                className={
                  "text-2xl font-semibold" +
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
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({ calenResult }) => {
  return {
    calenResult,
  };
};

export default connect(mapStateToProps)(CalendarCon);
