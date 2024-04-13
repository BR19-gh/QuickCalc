/* eslint-disable no-empty */
import { GET_RESULT } from "../actions/currResult.js";

export default function currResult(state = {}, action) {
  switch (action.type) {
    case GET_RESULT:
      return {
        ...state,
        ...action.result,
      };

    default:
      return state;
  }
}
