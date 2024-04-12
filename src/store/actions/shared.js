import { _getColors } from "../../../_DATA";
import { receiveTools } from "./tools";
import { getToolsInitial } from "../../../_DATA";
import { receiveColors } from "./colors";

export function handleInitialData() {
  return (dispatch) => {
    getToolsInitial().then((tools) => {
      _getColors()
        .then((colors) => {
          dispatch(receiveTools(tools));
          dispatch(receiveColors(colors));
        })

        .catch((error) => {
          alert(error);
        });
    });
  };
}

const userId = "br19";
const apiKey = "dI2mGhNHzpffVltyJF85aSpfPWohuip0YLw3FR8hRlzoyZMg";

export function handleCurrencyConversion(
  fromValue,
  fromType,
  toType,
  setResult
) {
  console.log("handleCurrencyConversion", fromValue, fromType, toType);

  const data = new FormData();
  data.append("from-value", fromValue);
  data.append("from-type", fromType);
  data.append("to-type", toType);

  return (dispatch) => {
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
        setResult(data.result);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };
}
