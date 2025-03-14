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

import { useState, useRef, useEffect } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { lang } from "../../../helpers";

import * as Haptics from "expo-haptics";

import * as StoreReview from "expo-store-review";

import InlineAd from "../../../components/InlineAd/InlineAd";
import { useRevenueCat } from "../../../providers/RevenueCatProvider";
import { useNavigation } from "@react-navigation/native";

function TipCal({ theme }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.TipCal.text." + text;

  const inputs = useRef([]);

  const [price, setPrice] = useState();
  const [tip, setTip] = useState();
  const [numberOfPpl, setNumberOfPpl] = useState();

  const [tipAmount, setTipAmount] = useState("0");

  const focusOnNextInput = (index) => {
    if (inputs.current[index] && inputs.current[index]) {
      inputs.current[index].focus();
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const scrollViewRef = useRef(null);

  function scrollViewSizeChanged(height) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  const navigation = useNavigation();

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
    if (price && tip && numberOfPpl) {
      if (isNaN(a2e(price)) || isNaN(a2e(tip)) || isNaN(a2e(numberOfPpl))) {
        Alert.alert(t(text("errorInValidInput")), t(text("onlyNumbers")), [
          {
            text: t(text("gotIt")),
            onPress: () => null,
            style: "default",
          },
        ]);
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let priceInEn = a2e(price);
      let tipInEn = a2e(tip);
      let numberOfPplInEn = a2e(numberOfPpl);

      let totalTip = priceInEn * (tipInEn / 100);
      let Amount = totalTip / numberOfPplInEn + priceInEn / numberOfPplInEn;

      if (Amount.toString().includes(".")) {
        setTipAmount(Amount.toFixed(2));
      } else {
        setTipAmount(Amount);
      }

      scrollViewSizeChanged(300);
    }
  };

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPrice("");
    setTip("");
    setNumberOfPpl("");
    setTipAmount("0");
    scrollViewSizeChanged(0);
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

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
          width: "100%",
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
          <View className={"w-full flex-row flex-wrap justify-evenly"}>
            <View>
              <Text
                className={
                  "text-center p-4 text-xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("price"))}
              </Text>
              <TextInput
                style={{
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: price ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                blurOnSubmit={false}
                returnKeyType={"done"}
                onSubmitEditing={() => focusOnNextInput(0)}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={(value) => setPrice(value)}
                onFocus={() => setPrice("")}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("price"))}
              />
            </View>
            <View>
              <Text
                className={
                  "text-center p-4 text-xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("precenatge"))}
              </Text>
              <TextInput
                ref={(el) => (inputs.current[0] = el)}
                style={{
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: tip ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                blurOnSubmit={false}
                returnKeyType="done"
                onSubmitEditing={() => focusOnNextInput(1)}
                keyboardType="decimal-pad"
                value={tip}
                onFocus={() => setTip("")}
                onChangeText={(value) => setTip(value)}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("tip"))}
              />
            </View>
            <View>
              <Text
                className={
                  "text-center p-4 text-xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("number"))}
              </Text>
              <TextInput
                ref={(el) => (inputs.current[1] = el)}
                style={{
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: numberOfPpl ? 40 : lang === "ar" ? 20 : 15,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onSubmitEditing={() => {
                  hideKeyboard();
                }}
                value={numberOfPpl}
                onFocus={() => setNumberOfPpl("")}
                onChangeText={(value) => setNumberOfPpl(value)}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("numberOfPpl"))}
              />
            </View>
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "rounded-lg w-48 h-20 mt-10 flex-row items-center justify-evenly"
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

          <View className="w-full flex-row flex-wrap">
            <View className="w-full flex-row p-2 mt-14 mb-2.5 text-left">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("tipAmount"))}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {tipAmount !== "0" ? `${tipAmount}` : ""}
                </Text>
                <Text>{"   "}</Text>
              </>
              {tipAmount !== "0" ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() =>
                    copyToClipboard(tipAmount !== "0" ? `${tipAmount}` : "")
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

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(TipCal);
