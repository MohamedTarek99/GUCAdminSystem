import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Home = (props) => {
  switch (props.user.role) {
    case "HR":
      return <Redirect to="/hrHome/welcomePage" />;;
    case "ACADEMIC MEMBER":
      return <Redirect to="/acHome/welcomePage" />;
    default:
      return <h1>Welcome</h1>;
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
  };
};

export default connect(mapStateToProps, null)(Home);
