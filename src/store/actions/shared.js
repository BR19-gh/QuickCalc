import { _getColors } from "../../../_DATA";
import { receiveTools } from "./tools";
import { getToolsInitial } from "../../../_DATA";
import { receiveColors } from "./colors";
import { receiveCurrResult } from "./currResult";

export function handleInitialData() {
  return (dispatch) => {
    getToolsInitial().then((tools) => {
      _getColors()
        .then((colors) => {
          dispatch(receiveTools(tools));
          dispatch(receiveColors(colors));
          dispatch(receiveCurrResult({ currResult: "" }));
        })

        .catch((error) => {
          alert(error);
        });
    });
  };
}
