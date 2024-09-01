import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const clearAsyncStorage = async () => {
  AsyncStorage.clear();
};

//clearAsyncStorage();

const TOOLS = [
  {
    id: 1,
    searchName: "Discount Calculator حاسبة الخصومات",
    name: {
      en: "Discount Calculator",
      ar: "حاسبة الخصومات",
    },
    description: {
      en: "Calculate the discount on your purchase",
      ar: "احسب خصومات مشترياتك",
    },
    icon: "tag.slash.fill",
    colors: ["#5854d7", "#4a45bd", "#36357a"],
    link: "DiscountCal",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 2,
    searchName: "Currency Converter محول العملات",
    name: {
      en: "Currency Converter",
      ar: "محول العملات",
    },
    description: {
      en: "Convert between currencies",
      ar: "حول بين مختلف العملات",
    },
    icon: "coloncurrencysign.circle.fill",
    colors: ["#487f31", "#3d692c", "#2b4423"],
    link: "CurrencyCon",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 3,
    searchName: "Units Converter محول الوحدات",
    name: {
      en: "Units Converter",
      ar: "محول الوحدات",
    },
    description: {
      en: "Convert between units of measurement",
      ar: "حول بين مختلف وحدات القياس",
    },
    icon: "scalemass.fill",
    colors: ["#c43e3e", "#a43131", "#722a2a"],
    link: "UnitsCon",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 4,
    searchName: "Tip Calculator حاسبة البقشيش",
    name: {
      en: "Tip Calculator",
      ar: "حاسبة البقشيش",
    },
    description: {
      en: "Calculate the tip for your meal",
      ar: "احسب بقشيش وجبتك",
    },
    icon: "creditcard.fill",
    colors: ["#c7542f", "#983b25", "#6c2e22"],
    link: "TipCal",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 5,
    searchName: "Calendar Converter محول التقويم",
    name: {
      en: "Calendar Converter",
      ar: "محول التقويم",
    },
    description: {
      en: "Convert between calendars",
      ar: "حول بين مختلف التقاويم",
    },
    icon: "calendar",
    colors: ["#8e2f9c", "#752880", "#3f0e44"],
    link: "CalendarCon",
    isFavorite: false,
    isHidden: false,
  },
  {
    id: 6,
    searchName: "GPA Calculator حاسبة المعدل",
    name: {
      en: "GPA Calculator",
      ar: "حاسبة المعدل",
    },
    description: {
      en: "Calculate your GPA",
      ar: "احسب معدلك الجامعي",
    },
    icon: "graduationcap.fill",
    colors: ["#c29f0c", "#9b740d", "#6d4a16"],
    link: "GPACal",
    isFavorite: false,
    isHidden: false,
  },
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
      "Unable load tools",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const setNoteId = async (id) => {
  try {
    await AsyncStorage.setItem("noteId", `${id}`);
  } catch (e) {
    console.error("Error: setNoteId: ", e);
    Alert.alert(
      "Unable to set noteId",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const getNoteId = async () => {
  try {
    const value = await AsyncStorage.getItem("noteId");
    return value ? value : null;
  } catch (e) {
    console.error("Error: getNoteId: ", e);
    Alert.alert(
      "Unable to get noteId",
      "Please contact with the developer, you can find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
    return true;
  }
};

export const setTrackingStat = async (bool) => {
  try {
    if (bool) {
      await AsyncStorage.setItem("trackingStat", JSON.stringify(true));
    } else {
      await AsyncStorage.setItem("trackingStat", JSON.stringify(false));
    }
  } catch (e) {
    console.error("Error: setTrackingStat: ", e);
    Alert.alert(
      "Unable to set trackingStat",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const getTrackingStat = async () => {
  try {
    const value = await AsyncStorage.getItem("trackingStat");
    return value ? value : null;
  } catch (e) {
    console.error("Error: getTrackingStat: ", e);
    Alert.alert(
      "Unable to get trackingStat",
      "Please contact with the developer, you can find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
    return true;
  }
};

export const setQuickAccessToolId = async (id) => {
  try {
    await AsyncStorage.setItem("quickAccessToolId", `${id}`);
  } catch (e) {
    console.error("Error: setQuickAccessToolId: ", e);
    Alert.alert(
      "Unable to set quickAccessToolId",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const getQuickAccessToolId = async () => {
  try {
    const value = await AsyncStorage.getItem("quickAccessToolId");
    return value ? value : null;
  } catch (e) {
    console.error("Error: getQuickAccessToolId: ", e);
    Alert.alert(
      "Unable to get quickAccessToolId",
      "Please contact with the developer, you can find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
    return true;
  }
};

export const setDontShowAgain = async () => {
  try {
    await AsyncStorage.setItem("DONT_SHOW_AGAIN", JSON.stringify(false));
  } catch (e) {
    console.error("Error: setDontShowAgain: ", e);
    Alert.alert(
      "Unable to set Dont Show Again",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const isDontShowAgain = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("DONT_SHOW_AGAIN");
    console.log("dont show again: " + jsonValue);
    return jsonValue ? true : JSON.parse(jsonValue);
  } catch (e) {
    console.error("Error: isDontShowAgain: ", e);
    Alert.alert(
      "Unable to get Dont Show Again",
      "Please contact with the developer, you can find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
    return true;
  }
};

export const setFirstTimeLaunch = async () => {
  try {
    await AsyncStorage.setItem("FIRST_TIME_LAUNCH", JSON.stringify(false));
  } catch (e) {
    console.error("Error: setFirstTimeLaunch: ", e);
    Alert.alert(
      "Unable to set First Time Launch",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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

export const isFirstTimeLaunch = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("FIRST_TIME_LAUNCH");
    return jsonValue != null ? JSON.parse(jsonValue) : true;
  } catch (e) {
    console.error("Error: isFirstTimeLaunch: ", e);
    Alert.alert(
      "Unable to get First Time Launch",
      "Please contact with the developer, you can find developer socials in the Settings tab",
      [
        {
          text: "Will Do",
          onPress: () => null,
          style: "Ok",
        },
      ]
    );
    return true;
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
        "Please contact with the developer, you can find developer socials in the Settings tab",
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
    if ((await getTools()).filter((tool) => tool.id === 6).length < 1) {
      await storeTools(
        JSON.stringify([
          ...(await getTools()),

          {
            id: 6,
            searchName: "GPA Calculator حاسبة المعدل",
            name: {
              en: "GPA Calculator",
              ar: "حاسبة المعدل",
            },
            description: {
              en: "Calculate your GPA",
              ar: "احسب معدلك الجامعي",
            },
            icon: "graduationcap.fill",
            colors: ["#c29f0c", "#9b740d", "#6d4a16"],
            link: "GPACal",
            isFavorite: false,
            isHidden: false,
          },
        ]),
        "ADD"
      );
    }
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
      "Unable to store tools",
      "Please contact with the developer, you can find developer socials in the Settings tab",
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
