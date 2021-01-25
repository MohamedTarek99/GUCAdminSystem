import React from "react";

import { connect } from "react-redux";

const WelcomePage = (props) => {
  return (
    <>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        jimmy
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    token: state.app.token,
  };
};

export default connect(mapStateToProps, null)(WelcomePage);
