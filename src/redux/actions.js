import { SET_NOTIFICATIONS, SET_USER, SET_TOKEN } from "./actionTypes";

export const setUser = (user) => ({
  type: SET_USER,
  payload: {
    user,
  },
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: {
    token,
  },
});
export const setNotifications = (notifications) => ({
  type: SET_NOTIFICATIONS,
  payload: {
    notifications,
  },
});
