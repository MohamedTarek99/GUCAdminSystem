import React, { useState } from "react";
import axios from "axios";

import { Form, Input, Button, message, Radio, Table } from "antd";
// import { useHistory } from "react-router-dom";
//import jwtDecode from "jwt-decode";

import "./ViewDayOff.css";
function ViewDayOff(props) {
  var data = [];
  // var final = [];
  // var final1 = [];
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Day off",
      dataIndex: "day_off",
      key: "day_off",
    },
  ];

  const [id, setId] = useState("");
  const [tData, SetTData] = useState("");

  const token = localStorage.getItem("JWT");
  // const history = useHistory();
  const getSingleDayOff = async () => {
    axios.defaults.headers.common["token"] = token;

    const res = await axios.post(
      "http://localhost:3000/ViewDayOffByID",
      {
        id: id,
      },
      {
        headers: {
          token: token,
        },
      }
    );

    if (res.data === "This course does not belong to your department") {
      message.error(res.data);
    } else if (res.data === "This page can not be accessed !!") {
      message.error(res.data);
    } else {
      // final = res.data;
      for (let i = 0; i < res.data.length; i++) {
        data.push({
          id: res.data[i].ID,
          name: res.data[i].Name,
          day_off: res.data[i].Day_off,
        });
      }
      SetTData(data);
    }
  };

  const getAllDayOff = async () => {
    axios.defaults.headers.common["token"] = token;

    const res = await axios.post(
      "http://localhost:3000/ViewDayOffAll",
      {},
      {
        headers: {
          token: token,
        },
      }
    );

    if (res.data === "There is no Staff in your department !!") {
      message.error(res.data);
    } else if (res.data === "This page can not be accessed !!") {
      message.error(res.data);
    } else {
      // final = res.data;
      for (let i = 0; i < res.data.length; i++) {
        data.push({
          id: res.data[i].ID,
          name: res.data[i].Name,
          day_off: res.data[i].Day_off,
        });
      }
      SetTData(data);
    }
  };

  const [value, setValue] = React.useState(1);
  const handleCourseChange = (evt) => {
    setId(evt.target.value);
  };

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 4 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 14 },
  };
  const onChange = (e) => {
    // console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  return (
    <div>
      <div>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>
            View the day off of all the staff in the department{" "}
          </Radio>
          <Radio value={2}>
            View the day off of a single staff in the department
          </Radio>
        </Radio.Group>
      </div>
      <Form
        {...layout}
        name="basic"
        //  onChange={handleCourseChange}
        //     value={assignID}
      >
        {value === 1 && (
          <Form.Item label="Id" rules={[{ required: false }]}>
            <Input className="input_course" disabled />
          </Form.Item>
        )}
        {value === 1 && (
          <Form.Item className="login-btn" {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={getAllDayOff}>
              Submit
            </Button>
          </Form.Item>
        )}

        {value === 2 && (
          <Form.Item
            label="Id"
            name="id"
            rules={[{ required: true, message: "Please input the id !" }]}
          >
            <Input className="input_course" onChange={handleCourseChange} />
          </Form.Item>
        )}
        {value === 2 && (
          <Form.Item className="login-btn" {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={getSingleDayOff}>
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
      <div>
        <Table
          className="table"
          columns={columns}
          dataSource={tData}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default ViewDayOff;
