import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
  StyleSheet,
  Alert,
  Clipboard,
  Dimensions,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState, useRef } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { handleUnitConversion } from "../../../store/actions/unitResult";

import DropdownUnit from "../../../components/Home/UnitsCon/Dropdown";

import { Dropdown } from "react-native-element-dropdown";
import { lang, UNIT_INFO } from "../../../helpers";

import * as Haptics from "expo-haptics";

import { useToast } from "react-native-toast-notifications";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

import * as StoreReview from "expo-store-review";

import InlineAd from "../../../components/InlineAd/InlineAd";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

function UnitsCon({ theme, dispatch, unitResult }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.UnitsCon.text." + text;
  const secondInput = useRef(null);
  const [measurement, setMeasurement] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [fromUnitValue, setFromUnitValue] = useState("");
  const [toUnitValue, setToUnitValue] = useState("");
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const { user } = useRevenueCat();

  useEffect(() => {
    if (netInfo.isConnected === false) {
      Alert.alert(
        t(text("connectionErrorTitle")),
        t(text("connectionErrorMsg")),
        [
          {
            text: t(text("gotIt")),
            onPress: () => null,
            style: "default",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [netInfo.isConnected]);

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

  const calculate = () => {
    if (fromUnitValue && fromUnit && toUnit) {
      if (isNaN(a2e(fromUnitValue))) {
        Alert.alert(
          t(text("errorInValidInput")),
          t(text("onlyNumbers")),
          [
            {
              text: t(text("gotIt")),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;
      }
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
          (updatedToast = () => {
            toast.update(refreshToast, t(text("done")), {
              type: "success",
              duration: 2000,
              placement: "top",
            });
          })
        )
      );
    } else {
      return null;
    }
    scrollViewSizeChanged(300);
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
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  const scrollViewRef = useRef(null);

  function scrollViewSizeChanged(height) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

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
          <Dropdown
            activeColor={theme === "dark" ? "#444444" : "#D2D2D2"}
            itemContainerStyle={{
              backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
            }}
            itemTextStyle={{
              color: theme === "dark" ? "#fff" : "#151E26",
            }}
            containerStyle={{
              backgroundColor: theme === "dark" ? "#555555" : "#E9ECEF",
              paddingBottom: 5,
              borderRadius: 8,
              borderColor: theme === "dark" ? "#555555" : "#E9ECEF",
            }}
            style={[stylesDropdown.dropdown]}
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
                  name={isFocus ? "chevron.up" : "chevron.down"}
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
                  name={isFocus ? "chevron.up" : "chevron.down"}
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
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: fromUnitValue ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                blurOnSubmit={false}
                returnKeyType={"done"}
                onSubmitEditing={() => {
                  hideKeyboard();
                }}
                value={fromUnitValue}
                onChangeText={(value) => setFromUnitValue(value)}
                onFocus={() => setFromUnitValue("")}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
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
                colors={[isDark("#5450D4", "#38377C")]}
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
                  backgroundColor: isDark("#2C2C2D99", "#CCCCCC"),
                  width: 150,
                  height: 150,
                  fontSize: unitResult.result ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#C1D4F1", "#495A7C"),
                  borderRadius: 10,
                }}
                returnKeyType="done"
                keyboardType="decimal-pad"
                value={
                  unitResult.result ? Number(unitResult.result).toFixed(2) : ""
                }
                onFocus={() => setToUnitValue("")}
                onChangeText={(value) => setToUnitValue(value)}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("to"))}
              />
            </View>
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "rounded-lg w-48 h-20 mt-14 flex-row items-center justify-evenly"
              }
              style={{ backgroundColor: "#38377C" }}
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
                    "text-2xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {(unitResult["from-value"] ? unitResult["from-value"] : "") +
                    " " +
                    (unitResult["from-type"] ? fromUnit[lang] : "")}
                </Text>
                <Text>{"   "}</Text>
              </>
              {unitResult["from-value"] ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      unitResult["from-value"] + " " + fromUnit[lang]
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
                  {t(text("to"))}
                  {":  "}
                </Text>
                <Text
                  className={
                    "text-2xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {(unitResult.result
                    ? Number(unitResult.result).toFixed(4)
                    : "") +
                    " " +
                    (unitResult["to-type"] ? toUnit[lang] : "")}
                </Text>
                <Text>{"   "}</Text>
              </>
              {unitResult.result ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      Number(unitResult.result).toFixed(4) + " " + toUnit[lang]
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

const mapStateToProps = ({ unitResult }) => {
  return {
    unitResult,
  };
};

export default connect(mapStateToProps)(UnitsCon);
