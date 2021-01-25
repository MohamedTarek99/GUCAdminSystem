// import { connect } from "react-redux";
import React, { useState } from "react";
import axios from "axios";

import { Form, Input, Button, message, Radio, Table } from "antd";
// import { useHistory } from "react-router-dom";
//import jwtDecode from "jwt-decode";

import "./ViewStaff.css";
function ViewStaff(props) {
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const [courseid, setCourseid] = useState("");
  const [tData, SetTData] = useState("");
  console.log("hi");
  const token = localStorage.getItem("JWT");
  // const history = useHistory();
  const getProfilePerCourse = async () => {
    axios.defaults.headers.common["token"] = token;

    const res = await axios.post(
      "http://localhost:3000/ViewStaffInCourse",
      {
        courseid: courseid,
      },
      {
        headers: {
          token: token,
        },
      }
    );
    console.log(res.data);
    console.log(res.data.length);
    if (res.data === "This course does not belong to your department") {
      message.error(res.data);
    } else if (res.data === "This page can not be accessed !!") {
      message.error(res.data);
    } else {
      // final = res.data;
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i].ID);

        data.push({
          id: res.data[i].ID,
          name: res.data[i].Name,
          email: res.data[i].Email,
        });
      }
      SetTData(data);
    }
  };

  const getProfileInDep = async () => {
    axios.defaults.headers.common["token"] = token;

    const res = await axios.post(
      "http://localhost:3000/ViewStaffInDep",
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    console.log(res.data);
    console.log(res.data.length);
    if (res.data === "There is no Staff in your department !!") {
      message.error(res.data);
    } else if (res.data === "This page can not be accessed !!") {
      message.error(res.data);
    } else {
      // final = res.data;
      for (let i = 0; i < res.data.length; i++) {
        console.log(res.data[i].ID);

        data.push({
          id: res.data[i].ID,
          name: res.data[i].Name,
          email: res.data[i].Email,
        });
      }
      SetTData(data);
    }
  };

  const [value, setValue] = React.useState(1);
  const handleCourseChange = (evt) => {
    setCourseid(evt.target.value);
  };

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 4 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 14 },
  };
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div>
      <div>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>View all the staff in his/her department</Radio>
          <Radio value={2}>View all the staff per course</Radio>
        </Radio.Group>
      </div>
      <Form
        {...layout}
        name="basic"
        //  onChange={handleCourseChange}
        //     value={assignID}
      >
        {value === 1 && (
          <Form.Item label="Course id" rules={[{ required: false }]}>
            <Input className="input_course" disabled />
          </Form.Item>
        )}
        {value === 1 && (
          <Form.Item className="login-btn" {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={getProfileInDep}>
              Submit
            </Button>
          </Form.Item>
        )}

        {value === 2 && (
          <Form.Item
            label="Course id"
            name="courseid"
            rules={[
              { required: true, message: "Please input the course name !" },
            ]}
          >
            <Input className="input_course" onChange={handleCourseChange} />
          </Form.Item>
        )}
        {value === 2 && (
          <Form.Item className="login-btn" {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={getProfilePerCourse}
            >
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
          scroll={{ x: 1000, y: 800 }}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default ViewStaff;
