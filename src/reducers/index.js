import snakeReducers from "./snakeReducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  snake: snakeReducers
});

export default rootReducer;
