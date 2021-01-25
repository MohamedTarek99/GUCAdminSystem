import jwtDecode from "jwt-decode";
import { SET_USER, SET_TOKEN, SET_NOTIFICATIONS } from "../actionTypes";

const token = localStorage.getItem("JWT");

const initialState = {
  user: token ? jwtDecode(token) : {},
  token: token ? token : {},
  notifications: [],
};

const appReducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case SET_TOKEN: {
      return {
        ...state,
        token: action.payload.token,
      };
    }
    case SET_NOTIFICATIONS: {
      return {
        ...state,
        notifications: action.payload.notifications,
      };
    }
    default:
      return state;
  }
};

export default appReducer;
