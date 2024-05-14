/* eslint-disable no-empty */
import { GET_RESULT_CURR } from "../actions/currResult.js";

export default function currResult(state = {}, action) {
  switch (action.type) {
    case GET_RESULT_CURR:
      return {
        ...state,
        ...action.result,
      };

    default:
      return state;
  }
}
