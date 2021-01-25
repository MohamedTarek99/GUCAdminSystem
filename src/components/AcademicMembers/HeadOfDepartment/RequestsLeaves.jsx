import React, { useState, useEffect } from "react";
import axios from "axios";

import { Form, Input, message, Table, Modal } from "antd";
// import { useHistory } from "react-router-dom";
//import jwtDecode from "jwt-decode";

import "./Requests.css";
var idarr = [];
function RequestsLeaves(props) {
  var data = [];
  // var final = [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },

    {
      title: "Sender ID",
      dataIndex: "senderId",
      key: "senderId",
    },
    
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date to",
      dataIndex: "dateTo",
      key: "dateTo",
    },
    {
      title: "Action",
      dataIndex: "id",

      render: (dataIndex) => (
        <div>
          <button
            type="primary"
            className="button2"
            onClick={onClick}
            value={dataIndex}
          >
            Accept
          </button>

          <button
            type="primary"
            className="button3"
            onClick={showModal}
            value={dataIndex}
            danger
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  let reqId = "";
  const [tData, SetTData] = useState("");
  let bval = "";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Comment, setComment] = useState("");

  const token = localStorage.getItem("JWT");
  // const history = useHistory();

  const getViewAllReq = async () => {
    axios.defaults.headers.common["token"] = token;

    const res = await axios.post(
      "http://localhost:3000/ViewAllReq",
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
      var flag = "";
      for (let i = 0; i < res.data.Leaves_requests.length; i++) {
        if (res.data.Leaves_requests[i].canceled === true) {
          flag = "Yes";
        } else {
          flag = "No";
        }
        data.push({
          id: res.data.Leaves_requests[i]._id,
          canceled: flag,
          senderId: res.data.Leaves_requests[i].senderId,
          date: res.data.Leaves_requests[i].date,
          reason: res.data.Leaves_requests[i].reason,
          reqDay: res.data.Leaves_requests[i].reqDay,
          action: res.data.Leaves_requests[i].id,
          dateTo: res.data.Leaves_requests[i].dateTo,
          type: res.data.Leaves_requests[i].type,
        });
      }
      SetTData(data);
    }
  };

  const rejectDayOff = async (request) => {
    axios.defaults.headers.common["token"] = token;
    console.log(idarr, " inside req");
    const temp = [...tData];
    var rejectid = idarr.pop();
    for (let i = 0; i < tData.length; i++) {
      if (temp[i].id === rejectid) {
        temp.splice(i, 1);
        break;
      }
    }

    SetTData(temp);
    await axios.post(
      "http://localhost:3000/rejectLeave",
      { reqId: rejectid, comment: Comment },
      {
        headers: {
          token: token,
        },
      }
    );
  };

  const acceptDayOff = async (request) => {
    axios.defaults.headers.common["token"] = token;
    console.log(reqId);
    const temp = [...tData];

    for (let i = 0; i < tData.length; i++) {
      if (temp[i].id === request) {
        temp.splice(i, 1);
        break;
      }
    }

    SetTData(temp);
    await axios.post(
      "http://localhost:3000/acceptLeave",
      { reqId: request },
      {
        headers: {
          token: token,
        },
      }
    );
  };

  // const acceptDayOff = async () => {
  //     axios.defaults.headers.common['token'] = token;
  //   console.log("hi2");
  // const res = await axios.post("http://localhost:3000/acceptDayOff", {
  //     {"reqId":}
  // },
  // {
  //   headers: {
  //       'token': token
  //   }
  // });
  // }
  const onClick = async (event) => {
    acceptDayOff(event.target.value);
  };
  const showModal = (event) => {
    // id = event.target.value;
    idarr.push(event.target.value);

    console.log(event.target.value, " my bval0 ");
    console.log(idarr[0], " my bva2 ");
    setIsModalVisible(true);
  };
  const handleCommentChange = (evt) => {
    setComment(evt.target.value);
  };

  const handleOk = async (evt) => {
    rejectDayOff();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    idarr.pop();

    //  console.log(event.target.value , " my bval0 ");
    console.log(idarr, " my bva2 ");
    setIsModalVisible(false);
  };

  useEffect(() => {
    getViewAllReq();
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
        title="Leave a comment (optional)"
        visible={isModalVisible}
        value={bval}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          className="input_course"
          placeholder="Comment"
          onChange={handleCommentChange}
        />
      </Modal>
    </div>
  );
}

export default RequestsLeaves;
