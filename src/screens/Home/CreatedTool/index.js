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
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useState, useEffect } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";

import * as Haptics from "expo-haptics";

import { Parser } from "expr-eval";

import * as StoreReview from "expo-store-review";

function CreatedTool({ theme, setCurrentTool, route }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.CreatedTool.text." + text;

  const { tool } = route.params;

  const [toolProps, setToolProps] = useState({
    inputs: Array(tool.equation.operands.length).fill(""),
    result: "",
  });

  useEffect(() => {
    setCurrentTool(tool);
  }, []);

  useEffect(() => {
    console.log(toolProps);
  }, [toolProps]);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
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
    for (let i = 0; i < toolProps.inputs.length; i++) {
      if (toolProps.inputs[i] === "" || toolProps.inputs[i] === undefined) {
        if (isNaN(tool.equation.operands[i]) !== false) {
          return;
        }
      } else if (isNaN(a2e(toolProps.inputs[i]))) {
        Alert.alert(t(text("errorInValidInput")), t(text("onlyNumbers")));
        return;
      }
    }

    const expression = (length) => {
      let expr = "";
      const variables = ["a", "b", "c", "d", "e"];
      for (let i = 0; i < length; i++) {
        expr += `${variables[i]} ${
          tool.equation.operators[i] ? tool.equation.operators[i] : ""
        } `;
      }

      return expr;
    };

    setToolProps({
      ...toolProps,
      result: Parser.evaluate(expression(tool.equation.operands.length), {
        a: isNaN(tool.equation.operands[0])
          ? Math.pow(toolProps.inputs[0], tool.equation.exponents[0])
          : Math.pow(tool.equation.operands[0], tool.equation.exponents[0]),
        b: isNaN(tool.equation.operands[1])
          ? Math.pow(toolProps.inputs[1], tool.equation.exponents[1])
          : Math.pow(tool.equation.operands[1], tool.equation.exponents[1]),
        c: isNaN(tool.equation.operands[2])
          ? Math.pow(toolProps.inputs[2], tool.equation.exponents[2])
          : Math.pow(tool.equation.operands[2], tool.equation.exponents[2]),
        d: isNaN(tool.equation.operands[3])
          ? Math.pow(toolProps.inputs[3], tool.equation.exponents[3])
          : Math.pow(tool.equation.operands[3], tool.equation.exponents[3]),
        e: isNaN(tool.equation.operands[4])
          ? Math.pow(toolProps.inputs[4], tool.equation.exponents[4])
          : Math.pow(tool.equation.operands[4], tool.equation.exponents[4]),
      }),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const reset = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    for (let index = 0; index < toolProps.inputs.length; index++) {
      setToolProps((prev) => ({
        ...prev,
        result: "",
        inputs: prev.inputs.map(() => ""),
      }));
    }
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  return (
    <View>
      <ScrollView className="h-full">
        <View className={"mt-28 w-full items-center"}>
          <View className={"w-full flex-row justify-evenly flex-wrap"}>
            {tool.equation.operands.map((operand, index) => {
              if (isNaN(operand) === false) {
                return;
              }
              return (
                <View key={index}>
                  <Text
                    className={
                      "p-4 text-center text-xl font-semibold" +
                      isDark(" text-blue-100", " text-blue-900")
                    }
                  >
                    {operand}
                  </Text>
                  <TextInput
                    style={{
                      backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                      width: 150,
                      height: 150,
                      fontSize: toolProps.inputs[index] ? 40 : 20,
                      textAlign: "center",
                      color: isDark("#DBEAFE", "#283987"),
                      borderRadius: 10,
                    }}
                    blurOnSubmit={false}
                    returnKeyType={"done"}
                    onSubmitEditing={hideKeyboard}
                    value={toolProps.inputs[index]}
                    onChangeText={(value) =>
                      setToolProps((prev) => ({
                        ...prev,
                        inputs: prev.inputs.map((input, i) =>
                          i === index ? a2e(value) : input
                        ),
                      }))
                    }
                    onFocus={() =>
                      setToolProps((prev) => ({
                        ...prev,
                        inputs: prev.inputs.map((input, i) =>
                          i === index ? "" : input
                        ),
                      }))
                    }
                    placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
                    placeholder={operand}
                    keyboardType="numeric"
                  />
                </View>
              );
            })}
          </View>

          <View className={"items-center"}>
            <TouchableOpacity
              className={
                "mt-14 h-20 w-48 flex-row items-center justify-evenly rounded-lg"
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
                "mt-2.5 h-14 w-36 flex-row items-center justify-evenly rounded-md"
              }
              style={{ backgroundColor: "#5450D4" }}
              onPress={reset}
            >
              <Text className={"text-center text-xl text-white"}>
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
            <View className="flex-row p-2">
              <>
                <Text
                  className={
                    "text-xl" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("result"))}:{"  "}
                </Text>
                <Text
                  className={
                    "text-xl font-semibold" +
                    isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {toolProps.result ? toolProps.result.toFixed(2) : ""}
                </Text>
                <Text>{"   "}</Text>
              </>
              {(toolProps.result ? toolProps.result.toFixed(2) : "") ? (
                <TouchableOpacity
                  className="pt-1"
                  onPress={() => copyToClipboard(toolProps.result.toFixed(2))}
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
    </View>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(CreatedTool);
