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
} from "react-native";
import styles from "./styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//import TextInput from "react-native-text-input-interactive";

import { useEffect, useState } from "react";

import { handleInitialData } from "../../../store/actions/shared";
import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useRef } from "react";

// import { deleteAccount } from "../../store/actions/tools";

function DiscountCal({ theme }) {
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

  const calculateDiscount = () => {
    if (price && discount) {
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

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  return (
    <View className={styles.container}>
      <ScrollView
        style={{
          height: "100%",
        }}
      >
        <View className={"mt-2.5 items-center"}>
          <TextInput
            className={"mt-5"}
            style={{
              backgroundColor: isDark("#CCCCCC", "#FFFFFF"),
              width: 150,
              height: 150,
              fontSize: 40,
              textAlign: "center",
              color: isDark("#283dab", "#283987"),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#283dab88",
            }}
            blurOnSubmit={false}
            returnKeyType={"done"}
            onSubmitEditing={focusOnSecondInput}
            value={price}
            onChangeText={(value) => setPrice(value)}
            onFocus={() => setPrice("")}
            placeholderTextColor={isDark("#28398788", "#28398755")}
            placeholder={t(text("price"))}
            keyboardType="numeric"
          />

          <TextInput
            className={"mt-5"}
            ref={secondInput}
            style={{
              backgroundColor: isDark("#CCCCCC", "#FFFFFF"),
              width: 150,
              height: 150,
              fontSize: 40,
              textAlign: "center",
              color: isDark("#283dab", "#283987"),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#283dab88",
            }}
            returnKeyType="done"
            keyboardType="decimal-pad"
            onSubmitEditing={() => {
              hideKeyboard();
            }}
            value={discount}
            onFocus={() => setDiscount("")}
            onChangeText={(value) => setDiscount(value)}
            placeholderTextColor={isDark("#28398788", "#28398755")}
            placeholder={t(text("discount"))}
          />

          <TouchableOpacity
            className={
              "rounded-lg w-56 h-20 mt-10 justify-center" +
              isDark(" bg-blue-900 ", " bg-blue-500 ")
            }
            onPress={calculateDiscount}
          >
            <Text className={styles.btnText}>{t(text("calculate"))}</Text>
          </TouchableOpacity>
          <View className="w-full flex-row flex-wrap">
            <View className="w-full flex-row p-2 mt-10 text-left">
              <Text
                className={
                  "text-2xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("priceAfter"))}
              </Text>
              <Text
                className={
                  "text-4xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {priceAfter}
              </Text>
            </View>
            <View className="flex-row p-2">
              <Text
                className={
                  "text-2xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("discountAmount"))}
              </Text>
              <Text
                className={
                  "text-4xl" + isDark(" text-blue-100", " text-blue-900")
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

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(DiscountCal);
