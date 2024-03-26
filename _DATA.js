import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

clearAsyncStorage = async () => {
  AsyncStorage.clear();
};

const TOOLS = [
  {
    id: 1,
    name: {
      en: "Discount Calculator",
      ar: "حاسبة الخصومات",
    },
    description: {
      en: "Calculate the discount on your purchase",
      ar: "احسب خصومات مشترياتك",
    },
    icon: "tag-off",
    colors: ["#5854d7", "#4a45bd", "#36357a"],
    link: "DiscountCal",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 2,
    name: {
      en: "Currency Converter",
      ar: "محول العملات",
    },
    description: {
      en: "Convert between currencies",
      ar: "حول بين مختلف العملات",
    },
    icon: "currency-rial",
    colors: ["#487f31", "#3d692c", "#2b4423"],
    link: "CurrencyCon",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 3,
    name: {
      en: "Units Converter",
      ar: "محول الوحدات",
    },
    description: {
      en: "Convert between units of measurement",
      ar: "حول بين مختلف وحدات القياس",
    },
    icon: "scale",
    colors: ["#c43e3e", "#a43131", "#722a2a"],
    link: "UnitsCon",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 4,
    name: {
      en: "Tip Calculator",
      ar: "حاسبة البقشيش",
    },
    description: {
      en: "Calculate the tip for your meal",
      ar: "احسب بقشيش وجبتك",
    },
    icon: "cash",
    colors: ["#c7542f", "#983b25", "#6c2e22"],
    link: "TipCal",
    isFavorite: false,
    isHidden: false,
  },
  // {
  //   id: 5,
  //   name: "Create Tool",
  //   description: "Create your own custom tool",
  //   icon: "plus",
  //   color: "#8e2f9c",
  //   link: "CustomTool",
  //   isFavorite: null,
  //   isHidden: null,
  // },
];

const BLUE = [
  { id: "50", color: "#f1f8fd" },
  { id: "100", color: "#dff0fa" },
  { id: "200", color: "#c5e5f8" },
  { id: "300", color: "#9ed4f2" },
  { id: "400", color: "#70bbea" },
  { id: "500", color: "#4299e1" },
  { id: "600", color: "#3985d7" },
  { id: "700", color: "#3070c5" },
  { id: "800", color: "#2d5ba0" },
  { id: "900", color: "#294d7f" },
  { id: "950", color: "#1d304e" },
];

export const getTools = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("TOOLS");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error: getTools: ", e);
    Alert.alert(
      "Unable lood tools",
      "Please contact with the developer, you van find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
  }
};

export const getToolsInitial = async () => {
  if ((await getTools()) === null) {
    try {
      await AsyncStorage.setItem("TOOLS", JSON.stringify(TOOLS));
      return TOOLS;
    } catch (e) {
      console.error("Error: getToolsInitial: ", e);
      Alert.alert(
        "Unable to get Initial tools",
        "Please contact with the developer, you van find developer socials in the Settings tab",
        [
          {
            text: "Will Do",
            onPress: () => null,
            style: "Ok",
          },
        ]
      );
    }
  } else {
    return await getTools();
  }
};

export const storeTools = async (value, actionType) => {
  try {
    await AsyncStorage.setItem("TOOLS", value);
    console.log("actionType: ", actionType);
    console.log("Stored Tools: ", await getTools());
  } catch (e) {
    console.error("Error: storeTools: ", e);
    Alert.alert(
      "Unable to store Initial tools",
      "Please contact with the developer, you van find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
  }
};

export function _getColors() {
  return new Promise((resolve) => {
    resolve({ ...BLUE });
  });
}
