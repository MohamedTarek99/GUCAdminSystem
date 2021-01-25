import React, { useState, useEffect } from "react";
import axios from "axios";

import { Form, message, Table, Modal } from "antd";

//import jwtDecode from "jwt-decode";

import "./Coverage.css";

var idC = "";
function Coverage(props) {
  var data = [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Coverage",
      dataIndex: "coverage",
      key: "coverage",
    },

    {
      title: "Action",
      dataIndex: "id",

      render: (dataIndex) => (
        <div>
          <button
            type="primary"
            className="button2"
            onClick={showModal}
            value={dataIndex}
          >
            Show slots
          </button>
        </div>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Instructor ID",
      dataIndex: "instructor",
      key: "instructor",
    },

    {
      title: "Course ID",
      dataIndex: "course",
      key: "course",
    },

    {
      title: "Slot ID",
      dataIndex: "id",
      key: "id",
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
  ];

  const [tData, SetTData] = useState("");
  const [tData2, SetTData2] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const token = localStorage.getItem("JWT");

  const viewCoverage = async () => {
    axios.defaults.headers.common["token"] = token;
    console.log("hihihi");
    const res = await axios.post(
      "http://localhost:3000/coverage",
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
      console.log(res.data);

      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].coverage == null) {
          data.push({
            id: res.data[i].id,
            coverage: "0 %",
            action: res.data[i].id,
          });
        } else {
          data.push({
            id: res.data[i].id,
            coverage: res.data[i].coverage + "%",
            action: res.data[i].id,
          });
        }
      }
      SetTData(data);
    }
  };

  const viewSlots = async () => {
    axios.defaults.headers.common["token"] = token;
    console.log("hihihi");
    const res = await axios.post(
      "http://localhost:3000/coverage",
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
      console.log(res.data);

      for (let i = 0; i < res.data.length; i++) {
        if (idC === res.data[i].id) {
          for (let j = 0; j < res.data[i].Slots.length; j++) {
            console.log(" length ", res.data[i].Slots.length);
            data.push({
              instructor: res.data[i].Slots[j].instructor,
              id: res.data[i].Slots[j].id,
              date: res.data[i].Slots[j].date,
              location: res.data[i].Slots[j].location,
              course: res.data[i].Slots[j].course,
            });
          }
          // data.push({istructor:res.data[i].Slots.istructor,slot:res.data[i].Slots.id,date:res.data[i].Slots.date,location:res.data[i].Slots.location,course:res.data[i].Slots.course});
          console.log(data);
        }
      }
      SetTData2(data);
    }
  };

  const showModal = (event) => {
    // id = event.target.value;
    console.log(event.target.value);
    idC = event.target.value;
    viewSlots();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    SetTData2([]);
    setIsModalVisible(false);
  };

  useEffect(() => {
    viewCoverage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 4 },
  };

  return (
    <div>
      <Form
        {...layout}
        name="basic"
        //  onChange={handleCourseChange}
        //     value={assignID}
      ></Form>
      <div>
        <Table
          className="table"
          columns={columns}
          dataSource={tData}
          pagination={false}
        />
      </div>
      <Modal
        title="Slots"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Table
          className="table2"
          columns={columns2}
          dataSource={tData2}
          pagination={false}
        />
      </Modal>
    </div>
  );
}

export default Coverage;
