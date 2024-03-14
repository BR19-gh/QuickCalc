/* eslint-disable no-empty */
import { GET_COLORS } from "../actions/colors.js";

export default function colors(state = {}, action) {
  switch (action.type) {
    case GET_COLORS:
      return {
        ...state,
        ...action.colors,
      };
    // case DELETE_ACCOUNT:
    //   const newState = { ...state };
    //   delete newState[action.id - 1];
    //   return newState;

    default:
      return state;
  }
}
