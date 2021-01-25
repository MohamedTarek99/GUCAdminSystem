import React, { useEffect, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { notification } from "antd";
import Login from "./components/Login";
import Home from "./components/Home";
import { AuthRoute } from "./components/AuthRoute";

import AcademicHome from "./components/AcademicMembers/AcademicHome";
import HRHome from "./components/HR/HRHome";

import { setNotifications } from "./redux/actions";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function App({ notifications, setNotifications,user }) {
  useInterval(() => {
    getNotifications();
  }, 5000);

  async function getNotifications() {
    if(user.role=="HR"){
      console.log("hr")
      return;
    }
    const response = await axios.get("http://localhost:3000/notifications", {
      headers: { token: localStorage.getItem("JWT") },
    });

    console.log(localStorage.getItem("JWT"))
      console.log(response.data)
    if (notifications.length < response.data.length) {
      const notificationIds = notifications.map((n) => n._id);
      const newNotifications = response.data.filter(
        (n) => !notificationIds.includes(n._id)
      );
      setNotifications(response.data);
      if (newNotifications.some((n) => !n.seen)) {
        notification.success({
          message: "You have a new notification",
        });
      }
    }
  }
  return ( 
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <AuthRoute component={Login} />
          </Route>
          <Route path="/acHome">
            <AuthRoute component={AcademicHome} />
          </Route>
          <Route path="/hrHome">
            <AuthRoute component={HRHome} />
          </Route>
          <Route path="/">
            <AuthRoute component={Home} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    notifications: state.app.notifications,
    user:state.app.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifications: (notifications) =>
      dispatch(setNotifications(notifications)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
