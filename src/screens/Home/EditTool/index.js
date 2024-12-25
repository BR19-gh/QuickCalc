import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import SelectDropdown from "react-native-select-dropdown";
import { Dropdown } from "react-native-element-dropdown";

import { useEffect, useState, useRef } from "react";

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

import * as StoreReview from "expo-store-review";

function EditTool({ theme, tools, route, dispatch }) {
  const { t } = useTranslation();
  const text = (text) => "screens.Home.NewTool.text." + text;
  const dropdownRef = useRef(null);
  const toast = useToast();

  const { tool } = route.params;

  const [newTool, setNewTool] = useState(tool);

  useEffect(() => {
    setNewTool({
      ...newTool,
      equation: {
        exponents: newTool.equation.exponents.slice(
          0,
          Number(newTool.operandNum)
        ),
        operands: newTool.equation.operands.slice(
          0,
          Number(newTool.operandNum)
        ),
        operators: newTool.equation.operators.slice(
          0,
          Number(newTool.operandNum) - 1
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
      width: newTool.icon ? 200 : 255,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  });

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

  function editTool(newTool) {
    const exponents = newTool.equation.exponents;
    const operands = newTool.equation.operands;
    const operators = newTool.equation.operators;

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
      const oldTools = [...Object.values(tools)];
      const newTools = [...oldTools];

      const index = oldTools.findIndex((tool) => tool.id === newTool.id);

      if (index !== -1) {
        newTools[index] = newTool;
      } else {
        console.log("Tool not found with ID:", newTool.id);
      }

      try {
        let refreshToast = toast.show(t(text("editingTool")), {
          placement: "top",
          type: "normal",
        });
        dispatch(handleAddTool(newTools, oldTools));
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          dispatch(handleInitialData());
          toast.update(refreshToast, t(text("toolEdited")), {
            type: "success",
            duration: 4000,
            placement: "top",
          });
          navigation.navigate("Home", { screen: "HomeNavi" });
          setTimeout(() => {
            StoreReview.requestReview();
          }, 500);
        }, 1000);
      } catch (error) {
        setNewTool(tool);
        Alert.alert(
          t(text("errorTitle")),
          error.message + "\n\n" + t(text("pleaseShareError"))
        );
      }
    } else {
      Alert.alert(t(text("emptyFeilds")), t(text("fillAllFields")));
    }
  }

  const [page, setPage] = useState({
    totalPages: 3,
    currentPage: 0,
  });

  const pageCount = Array.from(
    { length: page.totalPages },
    (_, index) => index
  );

  return (
    <View>
      <View className="h-full" automaticallyAdjustKeyboardInsets={true}>
        <View
          className={
            "w-full " +
            (Dimensions.get("window").height > 667 ? "mt-28" : "mt-16") +
            " items-center"
          }
        >
          <View
            className={"w-full items-center"}
            style={{
              height: Dimensions.get("window").height > 667 ? 450 : 300,
            }}
          >
            {page.currentPage === 0 ? (
              // Tool name and description
              <View
                className={"h-full flex flex-col items-center justify-evenly"}
              >
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
                      width: 180,
                      height: 70,
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
                      width: 180,
                      height: 120,
                      fontSize: 20,
                      textAlign: newTool.description ? "auto" : "center",
                      color: isDark("#DBEAFE", "#283987"),
                      borderRadius: 10,

                      paddingTop: newTool.description ? 10 : 60,
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
              </View>
            ) : page.currentPage === 1 ? (
              // Tool shape
              <View
                className={"h-full flex flex-col items-center justify-evenly"}
              >
                <View className={"mb-2"}>
                  <Text
                    className={
                      "mb-2 text-center text-2xl font-semibold" +
                      isDark(" text-blue-100", " text-blue-900")
                    }
                  >
                    {t(text("selectIcon"))}
                  </Text>
                  <View className="flex-row">
                    <Dropdown
                      ref={dropdownRef}
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
                                isDark("text-blue-100", "text-blue-900")
                              }
                            >
                              رقم {item.key}:
                            </Text>
                          ) : (
                            <Text
                              className={
                                "text-2xl font-semibold " +
                                isDark("text-blue-100", "text-blue-900")
                              }
                            >
                              Id. {item.key}:
                            </Text>
                          )}
                          <SweetSFSymbol
                            name={item.value}
                            weight="normal"
                            size={40}
                            colors={isDark("#DBEAFE", "#283987")}
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
                            name={isFocus ? "chevron.up" : "chevron.down"}
                            size={10}
                            colors={isDark("#DBEAFE", "#283987")}
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
                            colors={isDark("#DBEAFE", "#283987")}
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
                    {newTool.icon && (
                      <TouchableOpacity
                        onPress={() => {
                          dropdownRef.current.open();
                        }}
                        className="items-center"
                        style={{
                          marginStart: 4,
                          backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                          width: 50,
                          height: 40,
                          fontSize: 20,
                          color: isDark("#DBEAFE", "#283987"),
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        <SweetSFSymbol
                          name={newTool.icon}
                          size={20}
                          colors={isDark("#DBEAFE", "#283987")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
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
              </View>
            ) : page.currentPage === 2 ? (
              <View
                className={"h-full flex flex-col items-center justify-evenly"}
              >
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
                        Alert.alert(
                          t(text("operandNum")),
                          t(text("operandNumInfo"))
                        );
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
                  <SelectDropdown
                    defaultValue={newTool.operandNum}
                    data={["2", "3", "4", "5"]}
                    onSelect={(selectedItem) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      setNewTool({
                        ...newTool,
                        operandNum: selectedItem,
                      });
                    }}
                    renderButton={(selectedItem, isOpened, isSelected) => {
                      return (
                        <View
                          style={{
                            backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
                            width: 80,
                            height: 80,
                            fontSize: newTool.operandNum ? 40 : 20,
                            textAlign: "center",
                            color: isDark("#DBEAFE", "#283987"),
                            borderRadius: 10,
                          }}
                        >
                          <View>
                            {selectedItem ? (
                              <Text
                                style={{
                                  color: isDark("#DBEAFE", "#283987"),
                                  fontSize: selectedItem ? 40 : 20,
                                  textAlign: "center",
                                  marginTop: 15,
                                }}
                              >
                                {selectedItem
                                  ? selectedItem
                                  : t(text("select"))}
                              </Text>
                            ) : (
                              <View
                                className="flex-row items-center justify-center"
                                style={{
                                  marginTop: 30,
                                }}
                              >
                                <Text
                                  style={{
                                    color: isDark("#DBEAFE88", "#28398755"),
                                    fontSize: 15,
                                    textAlign: "center",
                                  }}
                                >
                                  {t(text("operandNumPlaceholder")) + "  "}
                                </Text>
                                <SweetSFSymbol
                                  name={
                                    isOpened ? "chevron.up" : "chevron.down"
                                  }
                                  colors={[isDark("#DBEAFE88", "#28398755")]}
                                  size={10}
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          style={{
                            ...{
                              width: "100%",
                              flexDirection: "row",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                            },
                          }}
                        >
                          <Text
                            className="text-center"
                            style={{
                              color: isDark("#DBEAFE", "#1E3A8A"),
                              flex: 1,
                              fontSize: 25,
                              fontWeight: "300",
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
                      backgroundColor: theme === "dark" ? "#2C2C2F" : "#E7E7E8",
                      borderRadius: 8,
                    }}
                  />
                </View>
                <View>
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
                        Alert.alert(
                          t(text("equation")),
                          t(text("equationInfo"))
                        );
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
                  <View className="flex flex-row flex-wrap justify-center h-24">
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
                          "text-center text-lg" +
                          isDark(" text-blue-100", " text-blue-900")
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
                                data={
                                  lang === "ar"
                                    ? ["س¹", "س²", "س³", "س⁴"]
                                    : ["x¹", "x²", "x³", "x⁴"]
                                }
                                onSelect={(selectedItem, index) => {
                                  Haptics.selectionAsync();

                                  const updatedExponents = [
                                    ...newTool.equation.exponents,
                                  ];
                                  updatedExponents[i] = selectedItem.includes(
                                    "¹"
                                  )
                                    ? 1
                                    : selectedItem.includes("²")
                                    ? 2
                                    : selectedItem.includes("³")
                                    ? 3
                                    : selectedItem.includes("⁴")
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
                                        width: newTool.operandNum > 3 ? 31 : 51,
                                        height:
                                          newTool.operandNum > 3 ? 17 : 35,
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
                                          fontSize: newTool.equation.exponents[
                                            i
                                          ]
                                            ? newTool.operandNum > 3
                                              ? 10
                                              : 20
                                            : newTool.operandNum > 3
                                            ? 4
                                            : 9,
                                          color: isDark("#DBEAFE", "#283987"),
                                          flex: 1,
                                          fontWeight: "bold",

                                          textAlign: "center",
                                        }}
                                      >
                                        {newTool.equation.exponents[i]
                                          ? newTool.equation.exponents[i] === 1
                                            ? lang === "ar"
                                              ? "س¹"
                                              : "x¹"
                                            : newTool.equation.exponents[i] ===
                                              2
                                            ? lang === "ar"
                                              ? "س²"
                                              : "x²"
                                            : newTool.equation.exponents[i] ===
                                              3
                                            ? lang === "ar"
                                              ? "س³"
                                              : "x³"
                                            : newTool.equation.exponents[i] ===
                                              4
                                            ? lang === "ar"
                                              ? "س⁴"
                                              : "x⁴"
                                            : t(text("powerOf"))
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
                                              newTool.operandNum > 3 ? 12 : 19,
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
                                  width: newTool.operandNum > 3 ? 44 : 80,
                                  height: newTool.operandNum > 3 ? 44 : 80,
                                  fontSize: newTool.operandNum > 3 ? 9 : 18,
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
                                          width:
                                            newTool.operandNum > 3 ? 31 : 51,
                                          height:
                                            newTool.operandNum > 3 ? 17 : 35,
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
                                            fontSize: newTool.equation
                                              .operators[i]
                                              ? newTool.operandNum > 3
                                                ? 12
                                                : 20
                                              : newTool.operandNum > 3
                                              ? 5
                                              : 9,
                                            color: isDark("#DBEAFE", "#283987"),
                                            flex: 1,
                                            fontWeight: "bold",

                                            textAlign: "center",
                                          }}
                                        >
                                          {newTool.equation.operators[i]
                                            ? newTool.equation.operators[i] ===
                                              "*"
                                              ? "×"
                                              : newTool.equation.operators[
                                                  i
                                                ] === "/"
                                              ? "÷"
                                              : newTool.equation.operators[i]
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
                                                newTool.operandNum > 3
                                                  ? 15
                                                  : 20,
                                              color: isDark(
                                                "#DBEAFE",
                                                "#283987"
                                              ),
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
                                    backgroundColor: isDark(
                                      "#2C2C2D",
                                      "#FFFFFF"
                                    ),
                                    fontSize: newTool.operandNum > 3 ? 9 : 18,
                                    color: isDark("#DBEAFE", "#283987"),
                                    borderRadius:
                                      newTool.operandNum > 3 ? 5 : 10,
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
              </View>
            ) : (
              <></>
            )}
          </View>
          <View
            style={{
              margin: 15,
              marginLeft: 35,
              marginRight: 35,
              borderBottomColor: isDark("#333333", "#CCCCCC"),
              borderBottomWidth: StyleSheet.hairlineWidth,
              alignSelf: "stretch",
            }}
          />
          <View className="w-full flex-row justify-around mt-5 px-5 flex-wrap">
            <View
              className={"w-full flex-row items-center justify-evenly mb-5"}
            >
              {pageCount.map((pageNumber) => (
                <TouchableOpacity
                  key={pageNumber}
                  activeOpacity={1}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPage({
                      currentPage: pageNumber,
                      totalPages: page.totalPages,
                    });
                  }}
                >
                  <SweetSFSymbol
                    name={
                      page.currentPage === pageNumber ? "circle.fill" : "circle"
                    }
                    size={30}
                    colors={isDark("#DBEAFE", "#283987")}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              disabled={page.currentPage === 0}
              className={
                "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly"
              }
              style={{
                backgroundColor: page.currentPage === 0 ? "#706F9E" : "#38377C",
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPage({
                  currentPage:
                    page.currentPage - 1 === -1 ? 0 : page.currentPage - 1,
                  totalPages: page.totalPages,
                });
              }}
            >
              <Text
                className={"text-2xl text-center"}
                style={{
                  color: page.currentPage === 0 ? "#D3D3D3" : "#FFFFFF",
                }}
              >
                {t(text("back"))}
              </Text>
            </TouchableOpacity>
            {page.currentPage === page.totalPages - 1 ? (
              <TouchableOpacity
                disabled={
                  !(
                    newTool.name &&
                    newTool.description &&
                    newTool.icon &&
                    newTool.colors.length === 3 &&
                    newTool.link &&
                    newTool.operandNum &&
                    isValidArray(
                      covertUndefinedExponents(newTool.equation.exponents),
                      2
                    ) &&
                    isValidArray(
                      covertUndefinedOperands(newTool.equation.operands),
                      2
                    ) &&
                    isValidArray(
                      covertUndefinedOperators(newTool.equation.operators),
                      1
                    )
                  )
                }
                className={
                  "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly"
                }
                style={{
                  backgroundColor:
                    newTool.name &&
                    newTool.description &&
                    newTool.icon &&
                    newTool.colors.length === 3 &&
                    newTool.link &&
                    newTool.operandNum &&
                    isValidArray(
                      covertUndefinedExponents(newTool.equation.exponents),
                      2
                    ) &&
                    isValidArray(
                      covertUndefinedOperands(newTool.equation.operands),
                      2
                    ) &&
                    isValidArray(
                      covertUndefinedOperators(newTool.equation.operators),
                      1
                    )
                      ? "#5450D4"
                      : "#8986D6",
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  editTool(newTool);
                }}
              >
                <Text
                  className={"text-2xl"}
                  style={{
                    color:
                      newTool.name &&
                      newTool.description &&
                      newTool.icon &&
                      newTool.colors.length === 3 &&
                      newTool.link &&
                      newTool.operandNum &&
                      isValidArray(
                        covertUndefinedExponents(newTool.equation.exponents),
                        2
                      ) &&
                      isValidArray(
                        covertUndefinedOperands(newTool.equation.operands),
                        2
                      ) &&
                      isValidArray(
                        covertUndefinedOperators(newTool.equation.operators),
                        1
                      )
                        ? "#FFFFFF"
                        : "#D3D3D3",
                  }}
                >
                  {t(text("save"))}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={
                  "rounded-md w-36 h-14 mt-2.5 flex-row items-center justify-evenly"
                }
                style={{ backgroundColor: "#5450D4" }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPage({
                    currentPage:
                      page.currentPage + 1 === page.totalPages
                        ? page.totalPages - 1
                        : page.currentPage + 1,
                    totalPages: page.totalPages,
                  });
                }}
              >
                <Text className={"text-2xl text-white text-center"}>
                  {t(text("next"))}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const mapStateToProps = ({ tools }) => {
  return {
    tools,
  };
};

export default connect(mapStateToProps)(EditTool);
