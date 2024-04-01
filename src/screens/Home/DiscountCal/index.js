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

  const calculateDiscount = () => {
    setDiscountAmount(price * (discount / 100));
    setPriceAfter(price - price * (discount / 100));
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
              backgroundColor: isDark("#18214e", "#c3ddff"),
              width: 150,
              height: 150,
              fontSize: 30,
              textAlign: "center",
              color: isDark("white", "black"),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#283dab",
            }}
            blurOnSubmit={false}
            returnKeyType={"done"}
            onSubmitEditing={focusOnSecondInput}
            value={price}
            onChangeText={(value) => setPrice(value)}
            onFocus={() => setPrice("")}
            placeholderTextColor={isDark("#283987", "#9fc5ff")}
            placeholder={t(text("discount"))}
            keyboardType="numeric"
          />

          <TextInput
            className={"mt-5"}
            ref={secondInput}
            style={{
              backgroundColor: isDark("#18214e", "#c3ddff"),
              width: 150,
              height: 150,
              fontSize: 30,
              textAlign: "center",
              color: isDark("white", "black"),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#283dab",
            }}
            returnKeyType="done"
            keyboardType="decimal-pad"
            onSubmitEditing={() => {
              hideKeyboard();
            }}
            value={discount}
            onFocus={() => setDiscount("")}
            onChangeText={(value) => setDiscount(value)}
            placeholderTextColor={isDark("#283987", "#9fc5ff")}
            placeholder={t(text("price"))}
          />

          <TouchableOpacity
            className={
              "rounded-lg w-48 h-24 mt-10 justify-center" +
              isDark(" bg-blue-900 ", " bg-blue-500 ")
            }
            onPress={calculateDiscount}
          >
            <Text className={styles.btnText}>{t(text("calculate"))}</Text>
          </TouchableOpacity>
          <View className="w-full flex-row flex-wrap justify-start">
            <Text
              className={
                "w-full text-2xl text-left p-2 mt-10" +
                isDark(" text-white", " text-black")
              }
            >
              {"المبلغ بعد الخصم: " + priceAfter}
            </Text>
            <Text
              className={
                "w-full text-2xl text-left p-2 mt-3" +
                isDark(" text-white", " text-black")
              }
            >
              {"مقدار الخصم: " + discountAmount}
            </Text>
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
