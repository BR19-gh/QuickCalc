/* eslint-disable no-empty */
import {
  DELETE_TOOLS,
  RECEIVE_TOOLS,
  REORDER_TOOLS,
  EDIT_VISIBILITY,
} from "../actions/tools.js";

export default function tools(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOOLS:
      return {
        ...state,
        ...action.tools,
      };

    case REORDER_TOOLS:
      const toolsArray = action.tools; // Assuming action.tools is the array of tools

      const toolsArrayObject = toolsArray.reduce((acc, tool, index) => {
        acc[index.toString()] = tool;
        return acc;
      }, {});
      return {
        ...state,
        ...toolsArrayObject,
      };

    case EDIT_VISIBILITY:
      const tools = action.tools;

      const toolsObject = tools.reduce((acc, tool, index) => {
        acc[index.toString()] = tool;
        return acc;
      }, {});
      return {
        ...state,
        ...toolsObject,
      };
    // case DELETE_ACCOUNT:
    //   const newState = { ...state };
    //   delete newState[action.id - 1];
    //   return newState;

    default:
      return state;
  }
}
