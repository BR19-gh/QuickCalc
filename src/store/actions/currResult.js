export const GET_RESULT = "GET_RESULT";
import { Alert } from "react-native";
import { lang } from "../../helpers";

export function receiveCurrResult(result) {
  console.log("receiveCurrResult", result);
  return {
    type: GET_RESULT,
    result,
  };
}

const userId = "br19";
const apiKey = "dI2mGhNHzpffVltyJF85aSpfPWohuip0YLw3FR8hRlzoyZMg";

export function handleCurrencyConversion(fromValue, fromType, toType) {
  console.log("handleCurrencyConversion", fromValue, fromType, toType);

  const data = new FormData();
  data.append("from-value", fromValue);
  data.append("from-type", fromType);
  data.append("to-type", toType);

  return (dispatch) => {
    if (fromValue === null || fromType === null || toType === null) {
      dispatch(
        receiveCurrResult({
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

            Alert.alert(
              //t(text("errorTitle")),
              lang === "ar" ? "خطأ" : "Error",

              lang === "ar"
                ? "رسالة الخطأ: " +
                    result.errorMsg +
                    "\n\nيرجى مشاركة هذه رسالة الخطأ هذه مع المطور، معلومات التواصل في الإعدادات"
                : "Error Message: " +
                    result.errorMsg +
                    "\n\nPlease share this error messag with the developer, developer contact in Settings",
              //+ t(text("pleaseShareError")),
              [
                {
                  text: lang === "ar" ? "فهمت" : "Got it",
                  // t(text("gotIt")),
                  onPress: () => null,
                },
              ]
            );
          } else {
            dispatch(receiveCurrResult(data));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Alert.alert("Error", error.message);
        });
    }
  };
}
