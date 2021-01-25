import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Table,
  Select,
  Button,
  message,
  Spin,
  Tag,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import {
  ACCEPTED_STATE,
  ALL_STATE,
  PENDING_STATE,
  REJECTED_STATE,
} from "./constants";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function createData(type, date, status, canceled, leaveType, ID) {
  let tagsArray = [];
  tagsArray.push(status);
  if (canceled) tagsArray.push("Canceled");
  if (leaveType) tagsArray.push(leaveType);
  return {
    key: ID,
    type,
    date,
    tags: tagsArray,
    ID,
  };
}
const getRequests = async (state) => {
  let requests;
  switch (state) {
    case ALL_STATE:
      requests = await axios.get("http://localhost:3000/viewSubmittedRequests");
      break;
    case PENDING_STATE:
      requests = await axios.get("http://localhost:3000/viewPendingRequests");
      break;
    case ACCEPTED_STATE:
      requests = await axios.get("http://localhost:3000/viewAcceptedRequests");
      break;
    case REJECTED_STATE:
      requests = await axios.get("http://localhost:3000/viewRejectedRequests");
      break;

    default:
      return;
  }

  const response = requests.data;
  if (response.length === 0) {
    message.warning("No available requests");
  }

  const result = [];

  // eslint-disable-next-line array-callback-return
  response.changeDayOffRequests.map((req) => {
    result.push(
      createData("CHANGEDAYOFF", "N/A", req.status, req.canceled, null, req._id)
    );
  });
  // eslint-disable-next-line array-callback-return
  response.leaveRequests.map((req) => {
    result.push(
      createData("LEAVE", req.date, req.status, req.canceled, req.type, req._id)
    );
  });
  // eslint-disable-next-line array-callback-return
  response.replacementRequests.map((req) => {
    result.push(
      createData("REPLACEMENT", "N/A", req.status, req.canceled, null, req._id)
    );
  });
  // eslint-disable-next-line array-callback-return
  response.slotLinkingRequests.map((req) => {
    result.push(
      createData("SLOTLINKING", "N/A", req.status, req.canceled, null, req._id)
    );
  });
  return result;
};
const ViewSubRequest = (props) => {
  const [loading, setLoading] = useState(false);
  const [columnsDate, setCData] = useState([]);
  const [selectedRequestState, setSelectedRequestState] = useState(ALL_STATE);
  useEffect(() => {
    async function reloadRequests() {
      setLoading(true);
      const result = await getRequests(selectedRequestState);
      setCData(result.reverse());
      setLoading(false);
      return;
    }
    reloadRequests();
  }, [selectedRequestState]);
  axios.defaults.headers.common["token"] = props.token;
  function info(requestInfo) {
    Modal.info({
      title: "Request Details",
      content: <div>{requestInfo}</div>,
      onOk() {},
    });
  }
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color;
            switch (tag) {
              case "CANCELED":
                color = "red";
                break;
              case "ACCEPTED":
                color = "green";
                break;
              case "PENDING":
                color = "geekblue";
                break;
              case "Canceled":
                color = "purple";
                break;
              default:
                color = "gold";
            }

            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",

      render: (text, record) => (
        <>
          <Space size="small">
            <Button
              key={record.ID + "2"}
              onClick={() => handleView(record.ID, record.type)}
            >
              View
            </Button>

            {record.tags.includes("PENDING") &&
              !record.tags.includes("Canceled") && (
                <Popconfirm
                  title="Are you sure you want to cancel this request?"
                  onConfirm={() => handleCancel(record.ID, record.type, 1)}
                >
                  <Button key={record.ID} danger>
                    Cancel
                  </Button>
                </Popconfirm>
              )}
            {record.tags.includes("ACCEPTED") &&
              !record.tags.includes("Canceled") && (
                <Popconfirm
                  title="Are you sure you want to cancel this request?"
                  onConfirm={() => handleCancel(record.ID, record.type, 2)}
                >
                  <Button type="primary" key={record.ID} danger>
                    Cancel
                  </Button>
                </Popconfirm>
              )}
          </Space>
        </>
      ),
    },
  ];

  async function handleView(reqId, type) {
    setLoading(true);
    let reqDisplay;
    try {
      const res = await axios.post("http://localhost:3000/viewRequestByID", {
        id: reqId,
        type: type,
      });
      const resMessage = res.data.request;
      console.log(resMessage);
      let slots, slot;

      switch (type) {
        case "CHANGEDAYOFF":
          reqDisplay = (
            <div>
              <br />
              <p>Type : Change Day Off Request</p>
              <p>{`Sent By : ${resMessage.senderId}`}</p>
              <p>{`New Day Off : ${resMessage.reqDay}`}</p>
              <p>{`Satus : ${resMessage.status}`}</p>
              {resMessage.canceled ? <p>Request is canceled</p> : <></>}
            </div>
          );
          break;
        case "LEAVE":
          switch (resMessage.type) {
            case "COMPENSATION":
              reqDisplay = (
                <div>
                  <br />
                  <p>Type : Leave Request</p>
                  <p>Leave Type : Compensation</p>
                  <p>{`Sent By : ${resMessage.senderId}`}</p>
                  <p>{`Satus : ${resMessage.status}`}</p>
                  <p>{`Leave Date : ${resMessage.date}`}</p>
                  <p>{`Attended Date : ${resMessage.dateTo}`}</p>
                  <p>{`Leave Reason : ${resMessage.reason}`}</p>

                  {resMessage.canceled ? <p>Request is canceled</p> : <></>}
                </div>
              );
              break;
            default:
              reqDisplay = (
                <div>
                  <br />
                  <p>Type : Leave Request</p>
                  <p>
                    Leave Type :{" "}
                    {resMessage.type === "ANNUAL"
                      ? "Annual"
                      : resMessage.type === "MATERNITY"
                      ? "Maternity"
                      : resMessage.type === "SICK"
                      ? "Sick"
                      : "Accidental"}
                  </p>
                  <p>{`Sent By : ${resMessage.senderId}`}</p>
                  <p>{`Satus : ${resMessage.status}`}</p>
                  <p>{`Leave Date : ${resMessage.date}`}</p>
                  <p>{`Leave Reason : ${
                    resMessage.reason ? resMessage.reason : "Not stated"
                  }`}</p>

                  {resMessage.canceled ? <p>Request is canceled</p> : <></>}
                </div>
              );
          }
          break;
        case "REPLACEMENT":
          slots = await axios.post("http://localhost:3000/viewSlotById", {
            id: resMessage.slotID,
          });
          slot = slots.data;
          reqDisplay = (
            <div>
              <br />
              <p>Type : Replacement Request</p>
              <p>{`Sent By : ${resMessage.senderId}`}</p>
              <p>{`Sent to : ${resMessage.recipientId}`}</p>
              <p>{`Satus : ${resMessage.status}`}</p>
              <b>Slot details :</b>
              <p>----------------------------------------------</p>
              <p>{`Slot instructor : ${slot.instructor}`}</p>
              <p>{`Slot course : ${slot.course}`}</p>
              <p>{`Slot location : ${slot.location}`}</p>
              <p>{`Slot date : ${slot.date}`}</p>
              {resMessage.canceled ? <p>Request is canceled</p> : <></>}
            </div>
          );
          break;
        case "SLOTLINKING":
          slots = await axios.post("http://localhost:3000/viewSlotById", {
            id: resMessage.slotID,
          });
          slot = slots.data;
          reqDisplay = (
            <div>
              <br />
              <p>Type : Slot Linking Request</p>
              <p>{`Sent By : ${resMessage.senderId}`}</p>
              <p>{`Satus : ${resMessage.status}`}</p>
              <b>Slot details :</b>
              <p>----------------------------------------------</p>
              <p>{`Slot instructor : ${
                slot.instructor ? slot.instructor : "Not Assigned"
              }`}</p>
              <p>{`Slot course : ${slot.course}`}</p>
              <p>{`Slot location : ${slot.location}`}</p>
              <p>{`Slot date : ${slot.date}`}</p>

              {resMessage.canceled ? <p>Request is canceled</p> : <></>}
            </div>
          );
          break;
        default:
      }
    } catch (error) {
      message.error(error.message);
    }

    setTimeout(function () {
      info(reqDisplay);
    }, 500);
    setLoading(false);
  }
  async function handleCancel(reqId, type, status) {
    setLoading(true);
    switch (status) {
      case 1:
        try {
          const res = await axios.post(
            "http://localhost:3000/cancelPendingRequest",
            {
              reqId: reqId,
              type: type,
            }
          );
          const resMessage = res.data;
          if (resMessage === "request canceled") {
            message.success(resMessage);
          } else {
            message.error("Something went wrong");
          }
        } catch (error) {
          message.error(error.message);
        }
        break;
      case 2:
        try {
          const res = await axios.post(
            "http://localhost:3000/cancelUpComingRequest",
            {
              reqId: reqId,
              type: type,
            }
          );
          const resMessage = res.data;
          if (resMessage === "request canceled") {
            message.success(resMessage);
          } else {
            message.error(resMessage);
          }
        } catch (error) {
          message.error(error.message);
        }
        break;
      default:
    }
    const result = await getRequests(selectedRequestState);
    setCData(result.reverse());
    setLoading(false);
  }

  return (
    <>
      <Spin indicator={antIcon} spinning={loading}>
        <Select
          style={{ width: 250 }}
          placeholder="Please select what to view"
          onChange={(value) => {
            if (value !== selectedRequestState) {
              setSelectedRequestState(value);
            }
          }}
        >
          <Option key="0" value={ALL_STATE}>
            All
          </Option>
          <Option key="1" value={PENDING_STATE}>
            Pending
          </Option>
          <Option key="2" value={ACCEPTED_STATE}>
            Accepted
          </Option>
          <Option key="3" value={REJECTED_STATE}>
            Rejected
          </Option>
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

export default connect(mapStateToProps, null)(ViewSubRequest);
