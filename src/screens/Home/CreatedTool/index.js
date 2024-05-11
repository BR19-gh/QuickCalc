import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
  Alert,
} from "react-native";
import styles from "./styles";
import SweetSFSymbol from "sweet-sfsymbols";

import { useState, useRef, useEffect } from "react";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import * as Haptics from "expo-haptics";

import { Parser } from "expr-eval";

function CreatedTool({ theme, setCurrentTool, route, dispatch, tools }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.CreatedTool.text." + text;
  const secondInput = useRef(null);

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
          ? toolProps.inputs[0]
          : tool.equation.operands[0],
        b: isNaN(tool.equation.operands[1])
          ? toolProps.inputs[1]
          : tool.equation.operands[1],
        c: isNaN(tool.equation.operands[2])
          ? toolProps.inputs[2]
          : tool.equation.operands[2],
        d: isNaN(tool.equation.operands[3])
          ? toolProps.inputs[3]
          : tool.equation.operands[3],
        e: isNaN(tool.equation.operands[4])
          ? toolProps.inputs[4]
          : tool.equation.operands[4],
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
                      "p-4 text-center text-2xl font-semibold" +
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
                "mt-14 h-20 w-48 flex-row items-center justify-evenly rounded-lg" +
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
                "mt-2.5 h-14 w-36 flex-row items-center justify-evenly rounded-md bg-blue-700"
              }
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
              <Text
                className={
                  "text-xl" + isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("result"))}:{"  "}
              </Text>
              <Text
                className={
                  "text-2xl font-semibold" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {toolProps.result ? toolProps.result.toFixed(2) : ""}
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

export default connect(mapStateToProps)(CreatedTool);
