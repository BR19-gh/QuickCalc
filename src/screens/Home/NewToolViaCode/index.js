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

import * as StoreReview from "expo-store-review";

function NewToolViaCode({ theme, tools, dispatch }) {
  const { t } = useTranslation();

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
      return props.every((prop) => obj.hasOwnProperty(prop));
    };
    try {
      tool = JSON.parse(`${toolCode}`);

      if (!hasRequiredProps(tool, requiredProps)) {
        throw new Error("Missing required properties");
      }

      console.log("Tool: ", tool);
      setErrorMsg(t(text("acceptedCode")));
    } catch (e) {
      setErrorMsg(t(text("invalidCode")));
      return;
    }
  }, [toolCode]);

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <ScrollView>
      <View className={"mt-28  w-full items-center"}>
        <View className={"mb-2"}>
          <Text
            className={
              "mb-2 text-center text-2xl font-semibold" +
              isDark(" text-blue-100", " text-blue-900")
            }
          >
            {t(text("toolCode"))}
          </Text>
          <TextInput
            style={{
              backgroundColor: isDark("#2C2C2D", "#FFFFFF"),
              width: 350,
              height: 350,
              fontSize: 20,
              textAlign: toolCode ? "left" : "center",
              color: isDark("#DBEAFE", "#283987"),
              borderRadius: 10,

              paddingTop: toolCode ? 10 : 160,
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
        <View
          className={"w-full flex-row flex-wrap items-center justify-evenly"}
        >
          <Text
            className={
              "w-full text-center text-lg" +
              (errMsg === t(text("invalidCode"))
                ? toolCode === ""
                  ? " text-transparent"
                  : " text-destructive"
                : isDark(" text-blue-100", " text-blue-900"))
            }
          >
            {errMsg}
          </Text>
          <TouchableOpacity
            disabled={toolCode !== ""}
            className={
              "mt-2.5 h-14 w-36 flex-row items-center justify-evenly rounded-full"
            }
            style={{
              backgroundColor: toolCode !== "" ? "#6C6BA6" : "#38377C",
            }}
            onPress={async () => {
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
            onPress={() => setToolCode("")}
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
        <View className="mb-5 mt-5 flex w-11/12 flex-row justify-center">
          <TouchableOpacity
            disabled={errMsg !== t(text("acceptedCode"))}
            className="h-16 w-11/12 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                errMsg !== t(text("acceptedCode")) ? "#6C6BA6" : "#38377C",
            }}
            // onPress={() => {
            //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            //   saveNewTool(newTool);
            // }}
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
