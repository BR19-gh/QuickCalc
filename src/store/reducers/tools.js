/* eslint-disable no-empty */
import {
  DELETE_TOOLS,
  RECEIVE_TOOLS,
  REORDER_TOOLS,
  EDIT_VISIBILITY,
  ADD_TOOL,
  DELETE_TOOL,
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

    case ADD_TOOL:
      const newTools = action.tools;
      const newToolsObject = newTools.reduce((acc, tool, index) => {
        acc[index.toString()] = tool;
        return acc;
      }, {});
      return {
        ...state,
        ...newToolsObject,
      };

    case DELETE_TOOL:
      console.log("Deleting tool", action.tools);
      return {
        ...state,
        ...action.tools,
      };

    default:
      return state;
  }
}
