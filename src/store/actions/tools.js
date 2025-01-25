import { storeTools } from "../../../_DATA";
import { Alert } from "react-native";

export const RECEIVE_TOOLS = "RECEIVE_TOOLS";
export const REORDER_TOOLS = "REORDER_TOOLS";
export const EDIT_VISIBILITY = "EDIT_VISIBILITY";
export const FAVORITE_TOOLS = "FAVORITE_TOOLS";
export const ADD_TOOL = "ADD_TOOL";
export const DELETE_TOOL = "DELETE_TOOL";

export function receiveTools(tools) {
  return {
    type: RECEIVE_TOOLS,
    tools,
  };
}

export function favoriteTools(tools) {
  return {
    type: FAVORITE_TOOLS,
    tools,
  };
}

export function reorderTools(tools) {
  return {
    type: REORDER_TOOLS,
    tools,
  };
}

export function editVis(tools) {
  return {
    type: EDIT_VISIBILITY,
    tools,
  };
}

export function addTool(tools) {
  return {
    type: ADD_TOOL,
    tools,
  };
}

export function deleteTool(tools) {
  return {
    type: DELETE_TOOL,
    tools,
  };
}

export function handleDeleteTool(tools, oldTools) {
  return (dispatch) => {
    dispatch(deleteTool(tools));
    try {
      storeTools(JSON.stringify(tools), "deleteTool").then(() => {
        dispatch(receiveTools(tools));
      });
    } catch {
      (e) => {
        dispatch(deleteTool(oldTools));
        Alert.alert(
          "Error: Unable to delete tool",
          "Please connect with the developer, developer socials in the Settings",
          [
            {
              text: "Will Do",
              onPress: () => null,
              style: "Ok",
            },
          ]
        );
        console.error("Error: deleteTool: ", e);
      };
    }
  };
}

export function handleAddTool(tools, oldTools) {
  console.log("Adding tool: ", tools);
  return (dispatch) => {
    dispatch(addTool(tools));
    try {
      storeTools(JSON.stringify(tools), "addTool").then(() => {});
    } catch {
      (e) => {
        dispatch(addTool(oldTools));
        Alert.alert(
          "Error: Unable to add tool",
          "Please connect with the developer, developer socials in the Settings",
          [
            {
              text: "Will Do",
              onPress: () => null,
              style: "Ok",
            },
          ]
        );
        console.error("Error: addTool: ", e);
      };
    }
  };
}

export function handleFavoriteTools(tools, oldTools) {
  return (dispatch) => {
    dispatch(favoriteTools(tools));
    try {
      storeTools(JSON.stringify(tools), "favoriteTools").then(() => {});
    } catch {
      (e) => {
        dispatch(editVis(oldTools));
        Alert.alert(
          "Error: Unable to favorite tool",
          "Please connect with the developer, developer socials in the Settings",
          [
            {
              text: "Will Do",
              onPress: () => null,
              style: "Ok",
            },
          ]
        );
        console.error("Error: favoriteTools: ", e);
      };
    }
  };
}

export function handleEditVisTools(tools, oldTools) {
  return (dispatch) => {
    dispatch(editVis(tools));
    try {
      storeTools(JSON.stringify(tools), "editVis").then(() => {});
    } catch {
      (e) => {
        dispatch(editVis(oldTools));
        Alert.alert(
          "Error: Unable to hide tool",
          "Please connect with the developer, developer socials in the Settings",
          [
            {
              text: "Will Do",
              onPress: () => null,
              style: "Ok",
            },
          ]
        );
        console.error("Error: handleEditVisTools: ", e);
      };
    }
  };
}

export function handleReorderTools(tools, oldTools) {
  return (dispatch) => {
    dispatch(reorderTools(tools));
    try {
      storeTools(JSON.stringify(tools), "reorderTools").then(() => {});
    } catch (e) {
      dispatch(reorderTools(oldTools));
      Alert.alert(
        "Error: Unable to reorder tools",
        "Please connect with the developer, developer socials in the Settings",
        [
          {
            text: "Will Do",
            onPress: () => null,
            style: "Ok",
          },
        ]
      );
      console.error("Error: handleReorderTools: ", e);
    }
  };
}
