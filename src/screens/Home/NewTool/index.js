import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import SelectDropdown from "react-native-select-dropdown";
import { Dropdown } from "react-native-element-dropdown";

import { useEffect, useState, useRef } from "react";

import uuid from "react-native-uuid";

import { connect } from "react-redux";

import { useTranslation } from "react-i18next";

import * as Haptics from "expo-haptics";

import { TOOL_COLORS } from "../../../helpers/Home/NewTool";
import { lang } from "../../../helpers";
import ICONS from "../../../helpers/symbols.json";
import { handleAddTool } from "../../../store/actions/tools";
import { handleInitialData } from "../../../store/actions/shared";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";

function NewTool({ theme, tools, dispatch }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.NewTool.text." + text;
  const secondInput = useRef(null);
  const toast = useToast();
  const [newTool, setNewTool] = useState({
    id: uuid.v4(),
    searchName: "",
    name: "",
    description: "",
    icon: "",
    colors: [],
    link: "CreatedTool",
    operandNum: "",
    equation: {
      exponents: [],
      operands: [],
      operators: [],
    },
    isFavorite: false,
    isHidden: false,
  });

  useEffect(() => {
    setNewTool({
      ...newTool,
      equation: {
        exponents: Array(
          Number(
            newTool.operandNum === "1" ||
              isNaN(newTool.operandNum) === true ||
              newTool.operandNum === "0"
              ? 0
              : newTool.operandNum
          )
        ),
        operands: Array(
          Number(
            newTool.operandNum === "1" ||
              isNaN(newTool.operandNum) === true ||
              newTool.operandNum === "0"
              ? 0
              : newTool.operandNum
          )
        ),
        operators: Array(
          Number(
            newTool.operandNum === "1" ||
              isNaN(newTool.operandNum) === true ||
              newTool.operandNum === "0"
              ? 0
              : newTool.operandNum
          ) === 0
            ? 0
            : newTool.operandNum - 1
        ),
      },
    });
  }, [newTool.operandNum]);

  useEffect(() => {
    console.log(newTool);
  }, [newTool]);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const a2e = (s) => {
    if (s) return s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  };

  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);

  const [isFocus, setIsFocus] = useState(false);

  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },
    dropdown: {
      backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
      color: isDark("#DBEAFE", "#283987"),
      height: 40,
      width: 200,

      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

  function saveNewTool(newTool) {
    const exponents = newTool.equation.exponents;
    const operands = newTool.equation.operands;
    const operators = newTool.equation.operators;

    const covertUndefinedExponents = (exponents) => {
      for (let i = 0; i < exponents.length; i++) {
        if (exponents[i] === undefined) {
          exponents[i] = 1;
        }
      }
      return exponents;
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
    const isValidOperands = isValidArray(operands, 2);
    const isValidOperators = isValidArray(operators, 1);

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
          setNewTool({
            id: uuid.v4(),
            searchName: "",
            name: "",
            description: "",
            icon: "",
            colors: [],
            link: "CreatedTool",
            operandNum: "",
            equation: {
              exponents: [],
              operands: [],
              operators: [],
            },
            isFavorite: false,
            isHidden: false,
          });
          dispatch(handleInitialData());
          toast.update(refreshToast, t(text("toolAdded")), {
            type: "success",
            duration: 4000,
            placement: "top",
          });
          navigation.navigate("HomeNavi");
        }, 1000);
      } catch (error) {
        setNewTool({
          id: newTool.id,
          searchName: "",
          name: "",
          description: "",
          icon: "",
          colors: [],
          link: "CreatedTool",
          operandNum: "",
          equation: {
            exponent: [],
            operands: [],
            operators: [],
          },
          isFavorite: false,
          isHidden: false,
        });
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
    <View>
      <ScrollView className="h-full" automaticallyAdjustKeyboardInsets={true}>
        <View className={"w-full  mt-28 items-center"}>
          <View className={"mb-2"}>
            <Text
              className={
                "mb-2 text-center text-2xl font-semibold" +
                isDark(" text-blue-100", " text-blue-900")
              }
            >
              {t(text("toolName"))}
            </Text>
            <TextInput
              style={{
                backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                width: 200,
                height: 80,
                fontSize: 20,
                textAlign: "center",
                color: isDark("#DBEAFE", "#283987"),
                borderRadius: 10,
              }}
              maxLength={20}
              blurOnSubmit={false}
              returnKeyType={"done"}
              onSubmitEditing={hideKeyboard}
              value={newTool.name}
              onChangeText={(value) =>
                setNewTool({
                  ...newTool,
                  name: value,
                  searchName: value,
                })
              }
              onFocus={() =>
                setNewTool({
                  ...newTool,
                  name: "",
                  searchName: "",
                })
              }
              placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
              placeholder={t(text("toolName"))}
              keyboardType="default"
            />
          </View>
          <View className={"mb-2"}>
            <Text
              className={
                "mb-2 text-center text-2xl font-semibold" +
                isDark(" text-blue-100", " text-blue-900")
              }
            >
              {t(text("toolDescription"))}
            </Text>
            <TextInput
              style={{
                backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                width: 200,
                height: 100,
                fontSize: 20,
                textAlign: newTool.description ? "auto" : "center",
                color: isDark("#DBEAFE", "#283987"),
                borderRadius: 10,

                paddingTop: newTool.description ? 10 : 35,
                padding: 10,
              }}
              multiline={true}
              numberOfLines={3}
              blurOnSubmit={false}
              returnKeyType={"done"}
              onSubmitEditing={hideKeyboard}
              value={newTool.description}
              onChangeText={(value) =>
                setNewTool({
                  ...newTool,
                  description: value,
                })
              }
              onFocus={() =>
                setNewTool({
                  ...newTool,
                  description: "",
                })
              }
              placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
              placeholder={t(text("toolDescription"))}
              keyboardType="default"
            />
          </View>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderBottomColor: isDark("#333333", "#CCCCCC"),
              borderBottomWidth: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
            }}
          />
          <View className={"mb-2"}>
            <Text
              className={
                "mb-2 text-center text-2xl font-semibold" +
                isDark(" text-blue-100", " text-blue-900")
              }
            >
              {t(text("selectIcon"))}
            </Text>
            <Dropdown
              activeColor={theme === "dark" ? "#999999" : "#DDDDDD"}
              itemContainerStyle={{
                backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                borderWidth: 0,
              }}
              itemTextStyle={{
                color: isDark("#DBEAFE", "#283987"),
              }}
              containerStyle={{
                borderRadius: 8,
                borderWidth: 0,
                backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                paddingBottom: 5,
              }}
              style={[styles.dropdown]}
              placeholderStyle={{
                fontSize: 18,
                color: isDark("#DBEAFE88", "#28398755"),
              }}
              selectedTextStyle={{
                fontSize: 18,
                color: isDark("#DBEAFE", "#283987"),
              }}
              inputSearchStyle={{
                height: 40,
                fontSize: 14,
                color: isDark("#DBEAFE", "#283987"),
              }}
              data={[...ICONS]}
              search
              maxHeight={300}
              valueField="value"
              labelField="value"
              autoScroll={false}
              renderItem={(item, selected) => (
                <View
                  className={
                    "w-full flex-row justify-around items-center pb-3 pt-3" +
                    (selected
                      ? theme === "dark"
                        ? " bg-neutral-900"
                        : ""
                      : " ")
                  }
                >
                  {lang === "ar" ? (
                    <Text
                      className={
                        "text-2xl font-semibold " +
                        isDark("text-white", "text-black")
                      }
                    >
                      رقم {item.key}:
                    </Text>
                  ) : (
                    <Text className={"text-2xl font-semibold"}>
                      Id. {item.key}:
                    </Text>
                  )}
                  <SweetSFSymbol
                    name={item.value}
                    weight="normal"
                    size={40}
                    colors={isDark("white", "black")}
                  />
                </View>
              )}
              placeholder={!isFocus ? t(text("selectIcon")) : "..."}
              searchPlaceholder={t(text("searchIcon"))}
              searchPlaceholderStyle={{
                color: "#151E26",
              }}
              renderRightIcon={() =>
                lang === "ar" ? null : (
                  <SweetSFSymbol
                    style={{
                      marginRight: 5,
                    }}
                    name={isFocus ? "chevron.down" : "chevron.up"}
                    size={10}
                    colors={isDark("#ffffff99", "#151E26")}
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
                    colors={isDark("#ffffff99", "#151E26")}
                  />
                ) : null
              }
              value={newTool.icon ? newTool.icon : ""}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                Haptics.selectionAsync();
                setNewTool({
                  ...newTool,
                  icon: item.value,
                });

                setIsFocus(false);
              }}
            />
          </View>
          <View className={"mb-2"}>
            <Text
              className={
                "mb-2 text-center text-2xl font-semibold" +
                isDark(" text-blue-100", " text-blue-900")
              }
            >
              {t(text("toolColor"))}
            </Text>
            <View className="flex flex-row flex-wrap w-10/12">
              {TOOL_COLORS.map((color) => {
                return (
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      width: 50,
                      height: 50,
                      backgroundColor: color.colors[0],
                      borderRadius: 25,
                    }}
                    key={color.name}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setNewTool({
                        ...newTool,
                        colors: [...color.colors],
                      });
                    }}
                  >
                    {newTool.colors[2] === color.colors[2] && (
                      <SweetSFSymbol
                        name="checkmark.circle.fill"
                        size={50}
                        colors={[color.colors[2]]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderBottomColor: isDark("#333333", "#CCCCCC"),
              borderBottomWidth: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
            }}
          />
          <View className={"mb-2 items-center"}>
            <View className="flex flex-row">
              <Text
                className={
                  "ml-3 mb-2 text-center text-2xl font-semibold mr-2" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("operandNum"))}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                  );
                  Alert.alert(t(text("operandNum")), t(text("operandNumInfo")));
                }}
              >
                <SweetSFSymbol
                  name="info.circle.fill"
                  style={{
                    marginTop: 7.5,
                  }}
                  size={18}
                  colors={[isDark("#DBEAFE", "#283987")]}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                width: 80,
                height: 80,
                fontSize: newTool.operandNum ? 40 : 20,
                textAlign: "center",
                color: isDark("#DBEAFE", "#283987"),
                borderRadius: 10,
              }}
              blurOnSubmit={false}
              returnKeyType={"done"}
              onSubmitEditing={hideKeyboard}
              value={a2e(newTool.operandNum)}
              onChangeText={(value) => {
                setNewTool({
                  ...newTool,
                  operandNum: a2e(value),
                });
              }}
              onFocus={() =>
                setNewTool({
                  ...newTool,
                  operandNum: "",
                })
              }
              placeholderTextColor={isDark("#DBEAFE88", "#28398755")}
              placeholder={t(text("operandNumPlaceholder"))}
              keyboardType="numeric"
            />
          </View>
          <View className={"mb-2"}>
            <View className="ml-3 flex flex-row justify-center">
              <Text
                className={
                  "mb-2 text-center text-2xl font-semibold mr-2" +
                  isDark(" text-blue-100", " text-blue-900")
                }
              >
                {t(text("equation"))}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning
                  );
                  Alert.alert(t(text("equation")), t(text("equationInfo")));
                }}
              >
                <SweetSFSymbol
                  name="info.circle.fill"
                  style={{
                    marginTop: 7.5,
                  }}
                  size={18}
                  colors={[isDark("#DBEAFE", "#283987")]}
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row flex-wrap justify-center">
              {Number(
                newTool.operandNum
                  ? newTool.operandNum === "1" ||
                    isNaN(newTool.operandNum) === true ||
                    newTool.operandNum === "0" ||
                    newTool.operandNum > 5
                    ? 0
                    : newTool.operandNum
                  : 0
              ) === 0 ? (
                <Text
                  className={
                    "text-base" + isDark(" text-blue-100", " text-blue-900")
                  }
                >
                  {t(text("noOperands"))}
                </Text>
              ) : (
                Array.from(
                  Array(
                    Number(
                      newTool.operandNum
                        ? newTool.operandNum === "1" ||
                          isNaN(newTool.operandNum) === true ||
                          newTool.operandNum === "0"
                          ? 0
                          : newTool.operandNum
                        : 0
                    )
                  ),
                  (e, i) => (
                    <View key={i} className="flex flex-row items-center">
                      <View className="flex flex-col items-center">
                        <SelectDropdown
                          data={["⎔¹", "⎔²", "⎔³", "⎔⁴"]}
                          onSelect={(selectedItem, index) => {
                            Haptics.selectionAsync();

                            const updatedExponents = [
                              ...newTool.equation.exponents,
                            ];
                            updatedExponents[i] =
                              selectedItem === undefined
                                ? 1
                                : selectedItem === "⎔¹"
                                ? 1
                                : selectedItem === "⎔²"
                                ? 2
                                : selectedItem === "⎔³"
                                ? 3
                                : selectedItem === "⎔⁴"
                                ? 4
                                : 1;

                            setNewTool({
                              ...newTool,
                              equation: {
                                ...newTool.equation,
                                exponents: updatedExponents,
                              },
                            });
                          }}
                          renderButton={(selectedItem, isOpened) => {
                            return (
                              <View
                                style={{
                                  marginBottom: 5,
                                  width: newTool.operandNum > 3 ? 26 : 47,
                                  height: newTool.operandNum > 3 ? 17 : 35,
                                  backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                                  borderRadius: newTool.operandNum > 3 ? 5 : 10,
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize:
                                      newTool.operandNum > 3
                                        ? selectedItem
                                          ? 10
                                          : 4
                                        : selectedItem
                                        ? 20
                                        : 8,
                                    color: isDark("#DBEAFE", "#283987"),
                                    flex: 1,
                                    fontWeight: "bold",

                                    textAlign: "center",
                                  }}
                                >
                                  {selectedItem
                                    ? selectedItem
                                    : t(text("powerOf"))}
                                </Text>
                              </View>
                            );
                          }}
                          renderItem={(item, index, isSelected) => {
                            return (
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  paddingHorizontal:
                                    newTool.operandNum > 3 ? 6 : 12,

                                  paddingVertical:
                                    newTool.operandNum > 3 ? 4 : 8,
                                }}
                              >
                                <Text
                                  className="text-center"
                                  style={{
                                    ...{
                                      flex: 1,
                                      fontSize:
                                        newTool.operandNum > 3 ? 10 : 20,
                                      fontWeight: "bold",
                                      color: isDark("#DBEAFE", "#283987"),
                                      fontWeight: "200",
                                    },
                                    ...(isSelected && {
                                      fontWeight: "bold",
                                    }),
                                  }}
                                >
                                  {item}
                                </Text>
                              </View>
                            );
                          }}
                          showsVerticalScrollIndicator={false}
                          dropdownStyle={{
                            backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                            fontSize: newTool.operandNum > 3 ? 9 : 18,
                            color: isDark("#DBEAFE", "#283987"),
                            borderRadius: newTool.operandNum > 3 ? 5 : 10,
                          }}
                        />
                        <TextInput
                          maxLength={20}
                          style={{
                            backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                            width: newTool.operandNum > 3 ? 40 : 80,
                            height: newTool.operandNum > 3 ? 40 : 80,
                            fontSize: newTool.operandNum > 3 ? 7 : 18,
                            textAlign: "center",
                            color: isDark("#DBEAFE", "#283987"),
                            borderRadius: newTool.operandNum > 3 ? 5 : 10,
                          }}
                          blurOnSubmit={false}
                          returnKeyType={"done"}
                          onSubmitEditing={hideKeyboard}
                          value={newTool.equation.operands[i]}
                          onChangeText={(value) => {
                            const updatedOperands = [
                              ...newTool.equation.operands,
                            ];
                            updatedOperands[i] = value;
                            setNewTool({
                              ...newTool,
                              equation: {
                                ...newTool.equation,
                                operands: updatedOperands,
                              },
                            });
                          }}
                          onFocus={() => {
                            const updatedOperands = [
                              ...newTool.equation.operands,
                            ];
                            updatedOperands[i] = "";

                            setNewTool({
                              ...newTool,
                              equation: {
                                ...newTool.equation,
                                operands: updatedOperands,
                              },
                            });
                          }}
                          placeholderTextColor={isDark(
                            "#DBEAFE88",
                            "#28398755"
                          )}
                          placeholder={t(text("operand"))}
                          keyboardType="default"
                        />
                      </View>
                      {i < newTool.operandNum - 1 && (
                        <View
                          className="flex-col"
                          style={{
                            marginTop: newTool.operandNum > 3 ? 20 : 40,
                          }}
                        >
                          <SelectDropdown
                            data={["+", "-", "×", "÷"]}
                            onSelect={(selectedItem, index) => {
                              Haptics.selectionAsync();

                              const updatedOperators = [
                                ...newTool.equation.operators,
                              ];
                              updatedOperators[i] =
                                selectedItem === "×"
                                  ? "*"
                                  : selectedItem === "÷"
                                  ? "/"
                                  : selectedItem;
                              setNewTool({
                                ...newTool,
                                equation: {
                                  ...newTool.equation,
                                  operators: updatedOperators,
                                },
                              });
                            }}
                            renderButton={(selectedItem, isOpened) => {
                              return (
                                <View
                                  style={{
                                    margin: 5,
                                    width: newTool.operandNum > 3 ? 26 : 47,
                                    height: newTool.operandNum > 3 ? 17 : 35,
                                    backgroundColor: isDark(
                                      "#2C2C2D",
                                      "#FFFFFF"
                                    ),
                                    borderRadius:
                                      newTool.operandNum > 3 ? 5 : 10,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize:
                                        newTool.operandNum > 3
                                          ? selectedItem
                                            ? 10
                                            : 4
                                          : selectedItem
                                          ? 20
                                          : 8,
                                      color: isDark("#DBEAFE", "#283987"),
                                      flex: 1,
                                      fontWeight: "bold",

                                      textAlign: "center",
                                    }}
                                  >
                                    {selectedItem
                                      ? selectedItem
                                      : t(text("operator"))}
                                  </Text>
                                </View>
                              );
                            }}
                            renderItem={(item, index, isSelected) => {
                              return (
                                <View
                                  style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    paddingHorizontal: 6,

                                    paddingVertical: 8,
                                  }}
                                >
                                  <Text
                                    className="text-center"
                                    style={{
                                      ...{
                                        flex: 1,
                                        fontSize:
                                          newTool.operandNum > 3 ? 10 : 20,
                                        fontWeight: "bold",
                                        color: isDark("#DBEAFE", "#283987"),
                                        fontWeight: "200",
                                      },
                                      ...(isSelected && {
                                        fontWeight: "bold",
                                      }),
                                    }}
                                  >
                                    {item}
                                  </Text>
                                </View>
                              );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={{
                              backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                              fontSize: newTool.operandNum > 3 ? 9 : 18,
                              color: isDark("#DBEAFE", "#283987"),
                              borderRadius: newTool.operandNum > 3 ? 5 : 10,
                            }}
                          />
                        </View>
                      )}
                    </View>
                  )
                )
              )}
            </View>
          </View>
          <View className="flex flex-row w-11/12 justify-center mt-5 mb-5">
            <TouchableOpacity
              className="w-11/12 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: isDark("#5450D4", "#38377C") }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                saveNewTool(newTool);
              }}
            >
              <Text className={"text-white text-3xl"}>{t(text("save"))}</Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps)(NewTool);
