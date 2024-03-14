/* eslint-disable no-empty */
import { DELETE_TOOLS, RECEIVE_TOOLS } from "../actions/tools.js";

export default function tools(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOOLS:
      return {
        ...state,
        ...action.tools,
      };
    // case DELETE_ACCOUNT:
    //   const newState = { ...state };
    //   delete newState[action.id - 1];
    //   return newState;

    default:
      return state;
  }
}
