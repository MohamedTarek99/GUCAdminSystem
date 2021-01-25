import { connect } from "react-redux";
import React, { useState } from "react";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";

import { Form, Input, Button, message, Spin } from "antd";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { setUser, setToken } from "../redux/actions";

import "./Login.css";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const [showResetPassword, setResetPassword] = useState(false);
  async function onFinish({ email, password, newPassword }) {
    setLoading(true);
    let res = await axios.post("http://localhost:3000/login", {
      email,
      password,
      newPassword,
    });
    if (res.data === "please enter a valid E-mail") {
      message.error(res.data);
    } else {
      if (res.data === "Invalid Password") {
        message.error(res.data);
      } else {
        if (res.data === "Please reset your password") {
          // TODO handle reset password
          setResetPassword(true);
          message.success(
            "Logged successfully for first time, please reset your password!"
          );
        } else {
          message.success("Logged successfully");
          const token = res.data;
          const user = jwtDecode(token);
          props.setUser(user);
          props.setToken(token);
          localStorage.setItem("JWT", token);
          history.push("/");
        }
      }
      console.log(res.data);
    }
    setLoading(false);
  }

  function onFinishFailed(params) {
    console.log(params);
  }
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 4 },
  };
  const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
  };
  return (
    <Spin indicator={antIcon} spinning={loading}>
      <div className="container">
        <div className="topleft">
          <img src="GUCLOGO.png" alt="ok buddy" />
        </div>

        <h1>Welcome</h1>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          {showResetPassword && (
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item className="login-btn" {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     user: state.app.user,
//   };
// };

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    setToken: (token) => dispatch(setToken(token)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
