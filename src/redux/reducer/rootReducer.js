import { combineReducers } from "redux";
import userReducer from "../actions/userReducer";

export default combineReducers({
  user: userReducer,
});
