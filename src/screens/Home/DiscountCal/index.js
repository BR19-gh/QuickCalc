import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useState } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useRef } from "react";

import * as Haptics from "expo-haptics";

function DiscountCal(props) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.DiscountCal.text." + text;
  const secondInput = useRef(null);
  const [price, setPrice] = useState();
  const [discount, setDiscount] = useState();

  const [discountAmount, setDiscountAmount] = useState("0");
  const [priceAfter, setPriceAfter] = useState("0");

  const focusOnSecondInput = () => {
    if (secondInput && secondInput.current) {
      secondInput.current.focus();
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const calculate = () => {
    if (price && discount) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let priceInEn = a2e(price);
      let discountInEn = a2e(discount);

      let discountAmount = priceInEn * (discountInEn / 100);
      let priceAfter = priceInEn - discountAmount;

      if (discountAmount.toString().includes(".")) {
        setDiscountAmount(discountAmount.toFixed(2));
      } else {
        setDiscountAmount(discountAmount);
      }
      if (priceAfter.toString().includes(".")) {
        setPriceAfter(priceAfter.toFixed(2));
      } else {
        setPriceAfter(priceAfter);
      }
    }
  };

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPrice("");
    setDiscount("");
    setDiscountAmount("0");
    setPriceAfter("0");
  };

  const isDark = (darkOp, lightp) => (props.theme === "dark" ? darkOp : lightp);

  return (
    <View>
      <ScrollView className="h-full">
        <View className={"w-full mt-28 items-center"}>
          <View className={"w-full flex-row justify-evenly"}>
            <View>
              <Text
                className={
                  "text-center p-4 text-2xl font-semibold" +
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
                onSubmitEditing={focusOnSecondInput}
                value={price}
                onChangeText={(value) => setPrice(value)}
                onFocus={() => setPrice("")}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("price"))}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text
                className={
                  "text-center p-4 font-semibold text-2xl" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("discount"))}
              </Text>
              <TextInput
                ref={secondInput}
                style={{
                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                  width: 150,
                  height: 150,
                  fontSize: discount ? 40 : 20,
                  textAlign: "center",
                  color: isDark("#DBEAFE", "#283987"),
                  borderRadius: 10,
                }}
                returnKeyType="done"
                keyboardType="decimal-pad"
                onSubmitEditing={() => {
                  hideKeyboard();
                }}
                value={discount}
                onFocus={() => setDiscount("")}
                onChangeText={(value) => setDiscount(value)}
                placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                placeholder={t(text("discountPres"))}
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

          <View className="w-full flex-row flex-wrap mt-14">
            <View className="w-full flex-row p-2 text-left">
              <Text
                className={
                  "text-xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("priceAfter"))}
              </Text>
              <Text
                className={
                  "text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {priceAfter}
              </Text>
            </View>
            <View className="flex-row p-2">
              <Text
                className={
                  "text-xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("discountAmount"))}
              </Text>
              <Text
                className={
                  "text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {discountAmount}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({}) => {
  return {};
};

export default connect(mapStateToProps)(DiscountCal);
