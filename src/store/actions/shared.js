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
