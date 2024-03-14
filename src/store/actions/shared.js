import { _getColors, _getTools } from "../../../_DATA";
import { receiveTools } from "./tools";
import { receiveColors } from "./colors";

export function handleInitialData() {
  return (dispatch) => {
    _getTools().then((tools) => {
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
