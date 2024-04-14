import { combineReducers } from "redux";
import tools from "./tools";
import colors from "./colors";
import currResult from "./currResult";
import unitResult from "./unitResult";

export default combineReducers({
  tools,
  colors,
  currResult,
  unitResult,
});
