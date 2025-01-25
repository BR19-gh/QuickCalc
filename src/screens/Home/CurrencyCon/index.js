import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
  Alert,
  Clipboard,
  Dimensions,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState, useRef } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { handleCurrencyConversion } from "../../../store/actions/currResult";

import Dropdown from "../../../components/Home/CurrencyCon/Dropdown";

import * as Haptics from "expo-haptics";

import { useToast } from "react-native-toast-notifications";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

import * as StoreReview from "expo-store-review";

import InlineAd from "../../../components/InlineAd/InlineAd";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";

function CurrencyCon({ theme, dispatch, currResult }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.CurrencyCon.text." + text;
  const secondInput = useRef(null);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [fromCurrencyValue, setFromCurrencyValue] = useState("");
  const [toCurrencyValue, setToCurrencyValue] = useState("");
  const netInfo = useNetInfo();
  const navigation = useNavigation();
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

  const switchCur = () => {
    const temp = fromCurrency;
    const temp2 = toCurrency;
    reset();
    setFromCurrency(temp2);
    setToCurrency(temp);
  };

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      navigation.goBack();
    }
  }, [theme]);

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
    if (fromCurrencyValue && fromCurrency && toCurrency) {
      if (isNaN(a2e(fromCurrencyValue))) {
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
        handleCurrencyConversion(
          (fromValue = a2e(fromCurrencyValue)),
          (fromType = fromCurrency.code),
          (toType = toCurrency.code),
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
    setToCurrencyValue(
      currResult === undefined ? "" : Number(currResult.result).toFixed(2)
    );
  }, [currResult]);

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(
      handleCurrencyConversion(
        (fromValue = null),
        (fromType = null),
        (toType = null)
      )
    );
    setFromCurrency("");
    setToCurrency("");
    setFromCurrencyValue("");
    setToCurrencyValue("");
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

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
              <Dropdown
                theme={theme}
                text={text}
                t={t}
                setCurrency={setFromCurrency}
                currency={fromCurrency}
              />
              <TextInput
                style={{
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: fromCurrencyValue ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                blurOnSubmit={false}
                returnKeyType={"done"}
                onSubmitEditing={() => {
                  hideKeyboard();
                }}
                value={fromCurrencyValue}
                onChangeText={(value) => setFromCurrencyValue(value)}
                onFocus={() => setFromCurrencyValue("")}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("from"))}
                keyboardType="numeric"
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
              <Dropdown
                theme={theme}
                text={text}
                t={t}
                setCurrency={setToCurrency}
                currency={toCurrency}
              />
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                ref={secondInput}
                style={{
                  backgroundColor: isDark("#2C2C2D99", "#CCCCCC"),
                  width: 150,
                  height: 150,
                  fontSize: currResult.result ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#C1D4F1", "#495A7C"),
                  borderRadius: 10,
                }}
                returnKeyType="done"
                keyboardType="decimal-pad"
                value={
                  currResult.result ? Number(currResult.result).toFixed(2) : ""
                }
                onFocus={() => setToCurrencyValue("")}
                onChangeText={(value) => setToCurrencyValue(value)}
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
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {(currResult["from-value"] ? currResult["from-value"] : "") +
                    " " +
                    (currResult["from-type"] ? currResult["from-type"] : "")}
                </Text>
                <Text>{"   "}</Text>
              </>
              {(currResult["from-value"] ? currResult["from-value"] : "") ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      currResult["from-value"] + " " + currResult["from-type"]
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
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {(currResult.result
                    ? Number(currResult.result).toFixed(4)
                    : "") +
                    " " +
                    (currResult["to-type"] ? currResult["to-type"] : "")}
                </Text>
                <Text>{"   "}</Text>
              </>
              {currResult.result ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(
                      Number(currResult.result).toFixed(4) +
                        " " +
                        currResult["to-type"]
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

const mapStateToProps = ({ currResult }) => {
  return {
    currResult,
  };
};

export default connect(mapStateToProps)(CurrencyCon);
