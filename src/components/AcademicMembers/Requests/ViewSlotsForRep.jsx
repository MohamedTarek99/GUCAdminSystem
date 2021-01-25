import React from "react";

import { connect } from "react-redux";

const ViewSlotsForRep = (props) => {
  return (
    <>
      {props.user.id}
      <br />
      {props.user.role}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    token: state.app.token,
  };
};

export default connect(mapStateToProps, null)(ViewSlotsForRep);
