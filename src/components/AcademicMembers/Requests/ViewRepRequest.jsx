import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Table,
  Select,
  Button,
  message,
  Spin,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function createData(senderId, recipientId, slotID, status, ID) {
  return { key: ID, senderId, recipientId, slotID, status, ID };
}
const ViewRepRequest = (props) => {
  const [loading, setLoading] = useState(false);
  const [columnsDate, setCData] = useState([]);
  const [reload, setReload] = useState(true);
  axios.defaults.headers.common["token"] = props.token;

  const columns = [
    {
      title: "Sender Id",
      dataIndex: "senderId",
      key: "senderId",
    },
    {
      title: "Recipient Id",
      dataIndex: "recipientId",
      key: "recipientId",
    },
    {
      title: "Slot",
      key: "slot",
      render: (text, record) => (
        <Button key={record.slotID} onClick={() => handleView(record.slotID)}>
          View
        </Button>
      ),
    },

    {
      title: "Action",
      key: "action",

      render: (text, record) => (
        <>
          <Space size="small">
            {console.log(props.user.id, record.recipientId, record.status)}
            {record.recipientId === props.user.id &&
              record.status === "PENDING" && (
                <>
                  <Popconfirm
                    title="Are you sure you want to accept this request?"
                    onConfirm={() => handleAccept(record.ID)}
                  >
                    <Button key={record.ID}>Accept</Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Are you sure you want to reject this request?"
                    onConfirm={() => handleReject(record.ID)}
                  >
                    <Button type="primary" key={record.ID} danger>
                      Reject
                    </Button>
                  </Popconfirm>
                </>
              )}
          </Space>
        </>
      ),
    },
  ];
  function info(slotInfo) {
    Modal.info({
      title: "Slot Details",
      content: <div>{slotInfo}</div>,
      onOk() {},
    });
  }
  async function handleView(slotID) {
    setLoading(true);
    let slotDisplay;
    try {
      let slots, slot;
      slots = await axios.post("http://localhost:3000/viewSlotById", {
        id: slotID,
      });
      slot = slots.data;
      slotDisplay = (
        <div>
          <br />
          <b>Slot details :</b>
          <p>----------------------------------------------</p>
          <p>{`Slot instructor : ${slot.instructor}`}</p>
          <p>{`Slot course : ${slot.course}`}</p>
          <p>{`Slot location : ${slot.location}`}</p>
          <p>{`Slot date : ${slot.date}`}</p>
        </div>
      );
    } catch (error) {
      message.error(error.message);
    }

    setTimeout(function () {
      info(slotDisplay);
    }, 500);
    setLoading(false);
  }

  async function handleAccept(reqId) {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/acceptReplacementRequest",
        {
          reqId: reqId,
        }
      );
      const resMessage = res.data;
      if (resMessage === "request accepted") {
        message.success(resMessage);
      } else {
        message.error(resMessage);
      }
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
    setReload(!reload);
  }
  async function handleReject(reqId) {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/rejectReplacementRequest",
        {
          reqId: reqId,
        }
      );
      const resMessage = res.data;
      if (resMessage === "request rejected") {
        message.success(resMessage);
      } else {
        message.error(resMessage);
      }
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
    setReload(!reload);
  }

  async function viewRequests() {
    setLoading(true);
    const requests = await axios.get(
      "http://localhost:3000/viewReplacementRequest"
    );

    const response = requests.data;
    if (response.length === 0) {
      return message.warning("No available requests");
    }
    const result = [];

    // eslint-disable-next-line array-callback-return
    response.map((request) => {
      if (!request.canceled)
        result.push(
          createData(
            request.senderId,
            request.recipientId,
            request.slotID,
            request.status,
            request._id
          )
        );
    });
    setCData(result);
    setLoading(false);
  }

  useEffect(() => {
    viewRequests();
  }, [reload]);

  return (
    <>
      <Spin indicator={antIcon} spinning={loading}>
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

export default connect(mapStateToProps, null)(ViewRepRequest);
