export const GET_RESULT = "GET_RESULT";
import { Alert } from "react-native";
import { lang } from "../../helpers";
import * as Haptics from "expo-haptics";

export function receiveUnitResult(result) {
  console.log("receiveUnitResult", result);
  return {
    type: GET_RESULT,
    result,
  };
}

const userId = "br19";
const apiKey = "dI2mGhNHzpffVltyJF85aSpfPWohuip0YLw3FR8hRlzoyZMg";

export function handleUnitConversion(
  fromValue,
  fromType,
  toType,
  updatedToast
) {
  console.log("handleUnitConversion", fromValue, fromType, toType);

  const data = new FormData();
  data.append("from-value", fromValue);
  data.append("from-type", fromType);
  data.append("to-type", toType);

  return (dispatch) => {
    if (fromValue === null || fromType === null || toType === null) {
      dispatch(
        receiveUnitResult({
          result: "",
          "from-value": "",
          "from-type": "",
          "to-type": "",
        })
      );
      return null;
    } else {
      fetch("https://neutrinoapi.net/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-ID": userId,
          "API-Key": apiKey,
        },
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["api-error"]) {
            let result = {
              error: data["api-error"],
              errorMsg: data["api-error-msg"],
            };
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
              lang === "ar" ? "خطأ" : "Error",

              lang === "ar"
                ? "رسالة الخطأ: " +
                    result.errorMsg +
                    "\n\nيرجى مشاركة رسالة الخطأ هذه مع المطور، معلومات التواصل في الإعدادات"
                : "Error Message: " +
                    result.errorMsg +
                    "\n\nPlease share this error message with the developer, Contact information is available in the settings.",
              [
                {
                  text: lang === "ar" ? "فهمت" : "Got it",
                  onPress: () => null,
                },
              ]
            );
          } else {
            updatedToast();
            dispatch(receiveUnitResult(data));
          }
        })
        .catch((error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          console.error("Error:", error);

          if (error.message.includes("Network")) {
            Alert.alert(
              lang === "ar" ? "خطأ في الاتصال" : "Network Error",
              lang === "ar"
                ? "رسالة الخطأ: " +
                    error.message +
                    "\n\nهناك مشكلة في الاتصال بالانترنت، هذه الاداة تتطلب اتصالا بالانترنت للعمل، يرجى مشاركة رسالة الخطأ هذه مع المطور اذا كنت تعتقد انه لا توجد مشكلة في اتصالك بالانترنت، معلومات التواصل في الإعدادات"
                : "Error Message: " +
                    error.message +
                    "\n\nThere's an issue with internet connection. This tool requires an internet access to function. Please share this error message if you believe there's no issue with your internet. Contact info is available in Settings."
            );
          } else {
            Alert.alert(
              (lang === "ar" ? "خطأ: " : "Error: ") + error,
              lang === "ar"
                ? "رسالة الخطأ: " +
                    error.message +
                    "\n\nيرجى مشاركة رسالة الخطأ هذه مع المطور، معلومات التواصل في الإعدادات"
                : "Error Message: " +
                    error.message +
                    "\n\nPlease share this error message with the developer, developer contact in Settings"
            );
          }
        });
    }
  };
}
