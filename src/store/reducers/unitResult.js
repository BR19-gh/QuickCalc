/* eslint-disable no-empty */
import { GET_RESULT } from "../actions/unitResult.js";

export default function unitResult(state = {}, action) {
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
