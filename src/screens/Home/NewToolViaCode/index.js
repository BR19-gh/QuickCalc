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
  StyleSheet,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";

import { useEffect, useState } from "react";

import uuid from "react-native-uuid";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import * as Haptics from "expo-haptics";

import { handleAddTool } from "../../../store/actions/tools";
import { handleInitialData } from "../../../store/actions/shared";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

function NewToolViaCode({ theme, tools, dispatch }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const toast = useToast();

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const text = (text) => "screens.Home.NewTool.text." + text;

  const [toolCode, setToolCode] = useState("");
  const [errMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let tool = "";

    const requiredProps = [
      "id",
      "searchName",
      "name",
      "description",
      "icon",
      "colors",
      "link",
      "operandNum",
      "equation",
      "isFavorite",
      "isHidden",
    ];
    const hasRequiredProps = (obj, props) => {
      if (Object.keys(obj).length !== props.length) {
        return false;
      }
      return props.every((prop) => obj.hasOwnProperty(prop));
    };
    function validateTool(tool) {
      const requiredProps = {
        id: "string",
        searchName: "string",
        name: "string",
        description: "string",
        icon: "string",
        colors: "array",
        link: "string",
        operandNum: "number",
        equation: "object",
        isFavorite: "boolean",
        isHidden: "boolean",
      };

      const validateArray = (arr, type, name) =>
        Array.isArray(arr) &&
        arr.every((item) => {
          if (name === "operands") {
            if (arr.length < 2) {
              return false;
            }
            return typeof item === type;
          }
          if (name === "exponents") {
            if (item < 0 || item > 4) {
              return false;
            } else if (arr.length < 2) {
              return false;
            } else if (arr.length !== tool.equation.operands.length) {
              return false;
            }
            return typeof item === type;
          }
          if (name === "operators") {
            if (arr.length !== tool.equation.operands.length - 1) {
              return false;
            }
            return typeof item === type;
          }
          if (type === "number") {
            return !isNaN(Number(item));
          }
          if (name === "operators") {
            if (item !== "+" && item !== "-" && item !== "*" && item !== "/") {
              return false;
            }
          }
          return typeof item === type;
        });

      const validateEquation = (equation) => {
        if (typeof equation !== "object" || equation === null) return false;
        const { exponents, operands, operators } = equation;
        return (
          validateArray(exponents, "number", "exponents") &&
          validateArray(operands, "string", "operands") &&
          validateArray(operators, "string", "operators")
        );
      };

      for (let prop in requiredProps) {
        if (!tool.hasOwnProperty(prop)) {
          console.log(`Missing property: ${prop}`);
          return false;
        }

        let value = tool[prop];
        const type = requiredProps[prop];

        if (type === "number" && typeof value === "string") {
          value = Number(value);
        }

        if (type === "array" && !validateArray(value, "string")) {
          console.log(
            `Invalid type for property: ${prop}, expected array of strings`
          );
          return false;
        } else if (type === "object" && !validateEquation(value)) {
          console.log(
            `Invalid type for property: ${prop}, expected object with correct structure`
          );
          return false;
        } else if (
          type !== "array" &&
          type !== "object" &&
          typeof value !== type
        ) {
          console.log(`Invalid type for property: ${prop}, expected ${type}`);
          return false;
        }
      }

      return true;
    }

    try {
      tool = JSON.parse(`${toolCode}`);

      if (!hasRequiredProps(tool, requiredProps)) {
        throw new Error("Missing required properties");
      }
      if (!validateTool(tool)) {
        throw new Error("Invalid tool code");
      }

      console.log("vaild: ", tool);
      setErrorMsg(t(text("acceptedCode")));
    } catch (e) {
      console.log("invalid: ", tool);
      setErrorMsg(t(text("invalidCode")));
      return;
    }
  }, [toolCode]);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  function saveNewTool(newTool) {
    const exponents = newTool.equation.exponents;
    const operands = newTool.equation.operands;
    const operators = newTool.equation.operators;

    const covertUndefinedExponents = (exponents) => {
      for (let i = 0; i < newTool.operandNum; i++) {
        if (exponents[i] === undefined) {
          exponents[i] = 1;
        }
      }
      return exponents;
    };
    const covertUndefinedOperands = (operands) => {
      for (let i = 0; i < newTool.operandNum; i++) {
        if (operands[i] === undefined || operands[i] === "") {
          return false;
        }
      }
      return operands;
    };
    const covertUndefinedOperators = (operators) => {
      for (let i = 0; i < newTool.operandNum - 1; i++) {
        if (operators[i] === undefined) {
          return false;
        }
      }
      return operators;
    };
    const isValidItem = (item) => {
      return typeof item !== "undefined" && isNaN(item)
        ? item.trim() !== ""
        : item !== 0;
    };
    const isValidArray = (arr, minItems) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === undefined) return false;
      }
      return (
        Array.isArray(arr) && arr.length >= minItems && arr.every(isValidItem)
      );
    };

    const isValidExponents = isValidArray(
      covertUndefinedExponents(exponents),
      2
    );
    const isValidOperands = isValidArray(covertUndefinedOperands(operands), 2);
    const isValidOperators = isValidArray(
      covertUndefinedOperators(operators),
      1
    );
    if (
      newTool.name &&
      newTool.description &&
      newTool.icon &&
      newTool.colors.length === 3 &&
      newTool.link &&
      newTool.operandNum &&
      isValidOperands &&
      isValidOperators &&
      isValidExponents
    ) {
      newTool.id = uuid.v4();
      newTool.operandNum = `${newTool.equation.operands.length}`;
      newTool.isFavorite = false;
      newTool.isHidden = false;
      const oldTools = [...Object.values(tools)];
      const newTools = [newTool, ...oldTools];
      try {
        let refreshToast = toast.show(t(text("addingNewTool")), {
          placement: "top",
          type: "normal",
        });
        dispatch(handleAddTool(newTools, oldTools));
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          dispatch(handleInitialData());
          toast.update(refreshToast, t(text("toolAdded")), {
            type: "success",
            duration: 4000,
            placement: "top",
          });
          navigation.navigate("HomeNavi");
        }, 1000);
      } catch (error) {
        Alert.alert(
          t(text("errorTitle")),
          error.message + "\n\n" + t(text("pleaseShareError"))
        );
      }
    } else {
      Alert.alert(t(text("emptyFeilds")), t(text("fillAllFields")));
    }
  }

  return (
    <ScrollView>
      <View
        className={
          "w-full " +
          (Dimensions.get("window").height > 667 ? "mt-32" : "mt-20") +
          " items-center"
        }
      >
        <View className={"items-center"}>
          <View className={"mb-1"}>
            <Text
              className={
                "mb-2 text-center text-2xl font-semibold" +
                isDark(" text-blue-100", " text-blue-900")
              }
            >
              {t(text("toolCode"))}
            </Text>
            <TextInput
              editable={errMsg === t(text("invalidCode"))}
              selectTextOnFocus={errMsg !== t(text("invalidCode"))}
              className={
                errMsg === t(text("invalidCode"))
                  ? toolCode === ""
                    ? " "
                    : "border-2 border-destructive"
                  : isDark(
                      "border-2 border-emerald-400",
                      "border-2 border-emerald-500"
                    )
              }
              style={{
                backgroundColor:
                  errMsg === t(text("invalidCode"))
                    ? isDark("#2C2C2D", "#FFFFFF")
                    : isDark("#2C2C2D99", "#CCCCCC"),
                width: 350,
                height: 225,
                fontSize: 18,
                textAlign: toolCode ? "left" : "center",
                color:
                  errMsg === t(text("invalidCode"))
                    ? isDark("#DBEAFE", "#283987")
                    : isDark("#C1D4F1", "#495A7C"),
                borderRadius: 10,

                paddingTop: toolCode ? 10 : 70,
                padding: 10,
              }}
              multiline={true}
              numberOfLines={3}
              blurOnSubmit={false}
              returnKeyType={"done"}
              onSubmitEditing={hideKeyboard}
              value={toolCode}
              onChangeText={(value) => setToolCode(value)}
              onFocus={() => setToolCode("")}
              placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
              placeholder={t(text("enterToolCode"))}
              keyboardType="ascii-capable"
            />
          </View>
          <Text
            className={
              "w-full text-center text-xs font-semibold p-2 pb-2" +
              (errMsg === t(text("invalidCode"))
                ? toolCode === ""
                  ? " text-transparent"
                  : " text-destructive"
                : isDark(" text-emerald-400", " text-emerald-500"))
            }
          >
            {errMsg}
          </Text>
          <View
            style={{
              margin: 15,
              marginLeft: 35,
              marginRight: 35,
              borderBottomColor: isDark("#666666", "#BBBBBB"),
              borderBottomWidth: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
            }}
          />
          <View className={"items-center"}>
            <LinearGradient
              key={
                toolCode === "" || errMsg === t(text("invalidCode"))
                  ? JSON.parse(
                      `{"id":"1111","searchName":"----","name":"----","description":"----","icon":"rectangle.dashed","colors":["#454d59","#3e444c","#21242b"],"link":"CreatedTool","operandNum":"2","equation":{"exponents":[1,1],"operands":["1","1"],"operators":["*"]},"isFavorite":false,"isHidden":false}`
                    ).id
                  : JSON.parse(toolCode).id
              }
              colors={[
                ...(toolCode === "" || errMsg === t(text("invalidCode"))
                  ? JSON.parse(
                      `{"id":"1111","searchName":"----","name":"----","description":"----","icon":"rectangle.dashed","colors":["#454d59","#3e444c","#21242b"],"link":"CreatedTool","operandNum":"2","equation":{"exponents":[1,1],"operands":["1","1"],"operators":["*"]},"isFavorite":false,"isHidden":false}`
                    ).colors
                  : JSON.parse(toolCode).colors),
              ]}
              style={{
                opacity: false
                  ? !false
                    ? 0.2
                    : 0.7
                  : false
                  ? false
                    ? 0.2
                    : 0.7
                  : 1,
                borderWidth: false || false ? 3.5 : 0,
                borderColor: theme === "dark" ? "gray" : "black",
                width: "92%",
              }}
              className="mb-2.5 h-32 rounded-lg"
            >
              <TouchableOpacity
                key={
                  toolCode === "" || errMsg === t(text("invalidCode"))
                    ? JSON.parse(
                        `{"id":"1111","searchName":"----","name":"----","description":"----","icon":"rectangle.dashed","colors":["#454d59","#3e444c","#21242b"],"link":"CreatedTool","operandNum":"2","equation":{"exponents":[1,1],"operands":["1","1"],"operators":["*"]},"isFavorite":false,"isHidden":false}`
                      ).id
                    : JSON.parse(toolCode).id
                }
                className={"h-full w-full flex-row flex-wrap justify-center"}
                onPress={() => null}
                onLongPress={() => null}
                disabled={false}
              >
                <View className={"w-full justify-start flex-row-reverse"}>
                  <SweetSFSymbol
                    name={
                      toolCode === "" || errMsg === t(text("invalidCode"))
                        ? JSON.parse(
                            `{"id":"1111","searchName":"----","name":"----","description":"----","icon":"rectangle.dashed","colors":["#454d59","#3e444c","#21242b"],"link":"CreatedTool","operandNum":"2","equation":{"exponents":[1,1],"operands":["1","1"],"operators":["*"]},"isFavorite":false,"isHidden":false}`
                          ).icon
                        : JSON.parse(toolCode).icon
                    }
                    size={24}
                    colors={["white"]}
                    style={{
                      margin: 16,
                    }}
                  />
                  <Text
                    className={"text-white text-2xl mt-3"}
                    style={{
                      width: "80%",
                    }}
                  >
                    {toolCode === "" ||
                    errMsg === t(text("invalidCode")) ||
                    errMsg === t(text("invalidCode"))
                      ? JSON.parse(
                          `{"id":"1111","searchName":"----","name":"----","description":"----","icon":"rectangle.dashed","colors":["#454d59","#3e444c","#21242b"],"link":"CreatedTool","operandNum":"2","equation":{"exponents":[1,1],"operands":["1","1"],"operators":["*"]},"isFavorite":false,"isHidden":false}`
                        ).name
                      : JSON.parse(toolCode).name}
                  </Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View
            className={"w-full flex-row flex-wrap items-center justify-evenly"}
          ></View>
        </View>
        <View
          className={"w-full flex-row flex-wrap items-center justify-evenly"}
        >
          <TouchableOpacity
            disabled={toolCode !== ""}
            className={
              "mt-5 h-14 w-36 flex-row items-center justify-evenly rounded-full"
            }
            style={{
              backgroundColor: toolCode !== "" ? "#6C6BA6" : "#38377C",
            }}
            onPress={async () => {
              Haptics.selectionAsync();
              setToolCode(await Clipboard.getString());
            }}
          >
            <Text
              className={"text-center text-lg"}
              style={{
                color: toolCode !== "" ? "#D3D3D3" : "#FFFFFF",
              }}
            >
              {t(text("pasteCode"))}
            </Text>
            <SweetSFSymbol
              name={"doc.on.clipboard.fill"}
              size={18}
              colors={[toolCode !== "" ? "#D3D3D3" : "#FFFFFF"]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={
              "mt-2.5 h-14 w-36 flex-row items-center justify-evenly rounded-full"
            }
            style={{ backgroundColor: "#38377C" }}
            onPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              setToolCode("");
            }}
          >
            <Text className={"text-center text-lg text-white"}>
              {t(text("reset"))}
            </Text>
            <SweetSFSymbol
              name={"arrow.counterclockwise.circle.fill"}
              size={18}
              colors={["white"]}
            />
          </TouchableOpacity>
        </View>
        <View className="mb-2.5 mt-2.5 flex w-11/12 flex-row justify-center">
          <TouchableOpacity
            disabled={errMsg !== t(text("acceptedCode"))}
            className="h-16 w-11/12 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                errMsg !== t(text("acceptedCode")) ? "#6C6BA6" : "#38377C",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              saveNewTool(JSON.parse(toolCode));
            }}
          >
            <Text
              className={"text-3xl"}
              style={{
                color:
                  errMsg !== t(text("acceptedCode")) ? "#D3D3D3" : "#FFFFFF",
              }}
            >
              {t(text("save"))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(NewToolViaCode);
