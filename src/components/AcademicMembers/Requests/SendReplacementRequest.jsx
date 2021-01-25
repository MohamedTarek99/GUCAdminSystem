import { Button, Space } from "antd";
import Text from "antd/lib/typography/Text";
import React from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const SendReplacementReq = (props) => {
  const history = useHistory();
  function handleClick() {
    history.push("/acHome/schedule");
  }
  return (
    <>
      <Button onClick={handleClick} type="primary" block>
        Send a replacement request
      </Button>
      <br />
      <br />
      <br />

      <Text strong>How To Send A Replacement Request:</Text>
      <Space direction="vertical">
        <div>
          <br />
          <Text strong>Step 1: </Text>
          <br />
          <Text>
            Click on the button above to get redirected to schedule page
          </Text>
          <br />
          <Text strong>Step 2: </Text>
          <br />
          <Text>Choose a working day</Text>
          <br />
          <Text strong>Step 3: </Text>
          <br />
          <Text>Choose a slot</Text>
          <br />
          <Text strong>Step 4: </Text>
          <br />
          <Text>
            Click on the "request" button and fill in the required fields
          </Text>
        </div>
      </Space>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    token: state.app.token,
  };
};

export default connect(mapStateToProps, null)(SendReplacementReq);
