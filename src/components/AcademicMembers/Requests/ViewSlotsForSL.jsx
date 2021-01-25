import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Select, Button, message, Spin } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function createData(course, date, location, ID) {
  return { key: ID, course, date, location, ID };
}
const ViewSlotsForSL = (props) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRData] = useState([]);
  const [columnsDate, setCData] = useState([]);
  const [courseName, setCourse] = useState("");
  axios.defaults.headers.common["token"] = props.token;

  const columns = [
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button key={record.ID} onClick={() => handleRequest(record.ID)}>
          Request
        </Button>
      ),
    },
  ];

  async function handleRequest(slotID) {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/sendSlotLinkingRequest",
        {
          course: courseName,
          slotID: slotID,
        }
      );
      const resMessage = res.data;
      if (resMessage === "request sent") {
        message.success(resMessage);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  }
  async function handleChange(value) {
    setCourse(value);
    setLoading(true);

    const slots = await axios.post(
      "http://localhost:3000/viewAvailableSlotsByCourse",
      {
        course: value,
      }
    );

    const response = slots.data;
    if (response.length === 0) {
      message.warning("No available slots for the chosen course");
    }
    const result = [];

    // eslint-disable-next-line array-callback-return
    response.map((slot) => {
      result.push(createData(slot.course, slot.date, slot.location, slot._id));
    });
    setCData(result);
    setLoading(false);
    return;
  }

  useEffect(() => {
    getCourses();
  }, []);

  async function getCourses() {
    setLoading(true);
    const courses = await axios.get(
      "http://localhost:3000/getInstructorCourses"
    );
    console.log(courses.data);
    setRData(courses.data);
    setLoading(false);
  }

  return (
    <>
      <Spin indicator={antIcon} spinning={loading}>
        <Select placeholder="Please select a course" onChange={handleChange}>
          {rows.map((course, index) => (
            <Option key={index} value={course.id}>
              {course.id}
            </Option>
          ))}
        </Select>

        <Table columns={columns} dataSource={columnsDate} />
      </Spin>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    token: state.app.token,
  };
};

export default connect(mapStateToProps, null)(ViewSlotsForSL);
