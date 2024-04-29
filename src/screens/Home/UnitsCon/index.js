import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useRef } from "react";

import { handleUnitConversion } from "../../../store/actions/unitResult";

import DropdownUnit from "../../../components/Home/UnitsCon/Dropdown";

import { Dropdown } from "react-native-element-dropdown";
import { lang, UNIT_INFO } from "../../../helpers";

import * as Haptics from "expo-haptics";

import { useToast } from "react-native-toast-notifications";
//import { useNetInfo } from "@react-native-community/netinfo";

function UnitsCon({ theme, dispatch, unitResult }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.UnitsCon.text." + text;
  const secondInput = useRef(null);
  const [measurement, setMeasurement] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [fromUnitValue, setFromUnitValue] = useState("");
  const [toUnitValue, setToUnitValue] = useState("");
  // const netInfo = useNetInfo();
  // useEffect(() => {
  //   if (netInfo.isConnected === false) {
  //     Alert.alert(
  //       t(text("connectionErrorTitle")),
  //       t(text("connectionErrorMsg")),
  //       [
  //         {
  //           text: t(text("gotIt")),
  //           onPress: () => null,
  //           style: "default",
  //         },
  //       ]
  //     );
  //   }
  // }, [netInfo.isConnected]);

  // const focusOnSecondInput = () => {
  //   if (secondInput && secondInput.current) {
  //     secondInput.current.focus();
  //   }
  // };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const switchUnits = () => {
    const temp = fromUnit;
    const temp2 = toUnit;
    const temp3 = measurement;
    reset();
    setFromUnit(temp2);
    setToUnit(temp);
    setMeasurement(temp3);
  };

  const toast = useToast();

  const calculate = () => {
    if (fromUnitValue && fromUnit && toUnit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      let refreshToast = toast.show(t(text("calculating")), {
        placement: "top",
        type: "normal",
      });

      dispatch(
        handleUnitConversion(
          (fromValue = a2e(fromUnitValue)),
          (fromType = fromUnit.code),
          (toType = toUnit.code),
          (updatedToast = () =>
            toast.update(refreshToast, t(text("done")), {
              type: "success",
              duration: 2000,
              placement: "top",
            }))
        )
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    setToUnitValue(
      unitResult === undefined ? "" : Number(unitResult.result).toFixed(2)
    );
  }, [unitResult]);

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(
      handleUnitConversion(
        (fromValue = null),
        (fromType = null),
        (toType = null)
      )
    );
    setMeasurement("");
    setFromUnit("");
    setToUnit("");
    setFromUnitValue("");
    setToUnitValue("");
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const [isFocus, setIsFocus] = useState(false);

  const stylesDropdown = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    dropdown: {
      backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
      height: 40,
      width: 160,
      borderColor: "#283dab88",
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  return (
    <View>
      <ScrollView className="h-full">
        <View className={"w-full mt-32 items-center"}>
          <Dropdown
            activeColor={theme === "dark" ? "#2F2F2F" : "#D2D2D2"}
            itemContainerStyle={{
              backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
            }}
            itemTextStyle={{
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            containerStyle={{
              borderColor: theme === "dark" ? "#555555" : "#E9ECEF",
              borderRadius: 8,
              backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
              paddingBottom: 5,
            }}
            style={[
              stylesDropdown.dropdown,
              isFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            selectedTextStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            inputSearchStyle={{
              height: 40,
              fontSize: 14,
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            iconStyle={stylesDropdown.iconStyle}
            data={[...UNIT_INFO]}
            search
            maxHeight={300}
            labelField={lang === "ar" ? "ar" : "en"}
            valueField="en"
            placeholder={!isFocus ? t(text("selectMeasurement")) : "..."}
            searchPlaceholder={t(text("searchMeasurement"))}
            searchPlaceholderStyle={{
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            renderRightIcon={() =>
              lang === "ar" ? null : (
                <SweetSFSymbol
                  style={{
                    marginRight: 5,
                  }}
                  name={isFocus ? "chevron.down" : "chevron.up"}
                  size={10}
                  colors={theme === "dark" ? "#fff" : "#151E26"}
                />
              )
            }
            renderLeftIcon={() =>
              lang === "ar" ? (
                <SweetSFSymbol
                  style={{
                    marginRight: 5,
                  }}
                  name={isFocus ? "chevron.down" : "chevron.up"}
                  size={10}
                  colors={theme === "dark" ? "#fff" : "#151E26"}
                />
              ) : null
            }
            value={measurement}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              Haptics.selectionAsync();
              setMeasurement(item.en);

              setIsFocus(false);
            }}
          />
          <View className={"w-full flex-row justify-evenly"}>
            <View>
              <DropdownUnit
                theme={theme}
                text={text}
                t={t}
                setUnit={setFromUnit}
                unit={fromUnit}
                measurement={measurement}
              />
              <TextInput
                style={{
                  backgroundColor: isDark("#CCCCCC", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: fromUnitValue ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#283dab", "#283987"),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#283dab88",
                }}
                blurOnSubmit={false}
                returnKeyType={"done"}
                onSubmitEditing={() => {
                  hideKeyboard();
                }}
                value={fromUnitValue}
                onChangeText={(value) => setFromUnitValue(value)}
                onFocus={() => setFromUnitValue("")}
                placeholderTextColor={isDark("#28398788", "#28398755")}
                placeholder={t(text("from"))}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                switchUnits();
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
              <DropdownUnit
                theme={theme}
                text={text}
                t={t}
                setUnit={setToUnit}
                unit={toUnit}
                measurement={measurement}
              />
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                ref={secondInput}
                style={{
                  backgroundColor: isDark("#888888", "#CCCCCC"),
                  width: 150,
                  height: 150,
                  fontSize: unitResult.result ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#283dab", "#283987"),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#283dab88",
                }}
                returnKeyType="done"
                keyboardType="decimal-pad"
                value={
                  unitResult.result ? Number(unitResult.result).toFixed(2) : ""
                }
                onFocus={() => setToUnitValue("")}
                onChangeText={(value) => setToUnitValue(value)}
                placeholderTextColor={isDark("#28398788", "#28398755")}
                placeholder={t(text("to"))}
              />
            </View>
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "rounded-lg w-48 h-20 mt-14 flex-row items-center justify-evenly" +
                isDark(" bg-blue-900 ", " bg-blue-500 ")
              }
              onPress={calculate}
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
                  "text-3xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {(unitResult["from-value"] ? unitResult["from-value"] : "") +
                  " " +
                  (unitResult["from-type"] ? fromUnit[lang] : "")}
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
                  "text-3xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {(unitResult.result
                  ? Number(unitResult.result).toFixed(4)
                  : "") +
                  " " +
                  (unitResult["to-type"] ? toUnit[lang] : "")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({ unitResult }) => {
  return {
    unitResult,
  };
};

export default connect(mapStateToProps)(UnitsCon);
