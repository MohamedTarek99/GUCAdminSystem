import React, { useEffect, useState } from "react";
import * as moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import { Badge, Calendar, message, Spin, Modal, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Schedule.css";
import Text from "antd/lib/typography/Text";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Schedule = (props) => {
  axios.defaults.headers.common["token"] = props.token;
  const [requestVisible, setRequestVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentSelectedSlotId, setCurrentSelectedSlotId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotSelectable, setSlotSelectable] = useState(true);

  const [result, setResult] = useState([]);

  let slots, slotsResult;
  function renderSlots(course, date, location, ID) {
    return {
      key: ID,
      date: date.format(),
      content: `Time: ${date.format(
        "h:mm a"
      )} Location: ${location} Course: ${course}`,
    };
  }
  useEffect(() => {
    getScheduleSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getScheduleSlots() {
    setLoading(true);
    const response = await axios.get("http://localhost:3000/viewSchedule");
    if (!(response.status <= 300)) {
      message.error(response.data);
    } else {
      slots = response.data;
      slotsResult = [];

      // eslint-disable-next-line array-callback-return
      slots.map((slot) => {
        var slotMoment = moment(slot.date);

        slotsResult.push(
          renderSlots(slot.course, slotMoment, slot.location, slot._id)
        );
      });

      setResult(slotsResult);
    }
    setLoading(false);
  }
  function getListData(value) {
    let listData = [];

    if (result.length > 0) {
      // eslint-disable-next-line array-callback-return
      result.map((slot) => {
        if (
          moment(slot.date).format("YYYY-MM-DD") === value.format("YYYY-MM-DD")
        ) {
          var listItem = {
            key: slot.key,
            type: "success",
            content: slot.content,
          };
          listData.push(listItem);
        }
      });
      return listData;
    } else {
      return [];
    }
  }
  function dateCellRender(value) {
    const listData = getListData(value);
    // console.log(listData);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.key}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }
  function getMonthData(value) {
    var slotsNumber = 0;
    // eslint-disable-next-line array-callback-return
    result.map((slot) => {
      if (moment(slot.date).format("YYYY-MM") === value.format("YYYY-MM")) {
        slotsNumber++;
      }
    });
    return slotsNumber;
  }
  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Slots This Month</span>
      </div>
    ) : null;
  }
  function info(slotInfo) {
    Modal.info({
      title: "Slots :",
      content: <div>{slotInfo}</div>,
      onOk() {},
    });
  }

  const modalData = selectedDate ? getListData(selectedDate) : [];

  return (
    <Spin indicator={antIcon} spinning={loading}>
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        onSelect={(value) => {
          setSelectedDate(value);
        }}
      />
      <Modal
        closable
        onCancel={() => {
          setSelectedDate(null);
        }}
        onOk={() => {
          setSelectedDate(null);
        }}
        title="Slots :"
        visible={selectedDate !== null && modalData.length > 0}
      >
        {selectedDate && modalData.length > 0 && (
          <div>
            <br />
            <p>{`Date : ${selectedDate.format("YYYY-MM-DD")}`}</p>
            {
              // eslint-disable-next-line array-callback-return
              modalData.map((item, index) => {
                console.log(index, item.content);
                return (
                  <>
                    <Text strong>{`Slot ${index + 1}:`}</Text>
                    <Button
                      type="text"
                      danger
                      onClick={() => {
                        setRequestVisible(true);
                        setSelectedDate(null);
                        setCurrentSelectedSlotId(item.key);
                      }}
                    >
                      Request Replacement
                    </Button>
                    <p>{`${item.content}`}</p>
                  </>
                );
              })
            }
          </div>
        )}
      </Modal>
      <Modal
        title="Replacement Request"
        visible={requestVisible}
        closable
        onOk={async () => {
          setConfirmLoading(true);
          if (recipientName === "") {
            message.error("Enter recipient name");
          } else {
            try {
              const res = await axios.post(
                "http://localhost:3000/sendReplacementRequest",
                {
                  recipientId: recipientName,
                  slotID: currentSelectedSlotId,
                }
              );
              setRecipientName("");
              const resMessage = res.data;
              if (resMessage === "Request sent succesfully!") {
                message.success(resMessage);
              } else {
                message.error(resMessage);
              }
            } catch (error) {
              message.error(error.message);
              setRecipientName("");
            }
            setRequestVisible(false);
            setCurrentSelectedSlotId(null);
          }
          setConfirmLoading(false);
        }}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setRequestVisible(false);
          setRecipientName("");
          setCurrentSelectedSlotId(null);
        }}
      >
        <Input
          placeholder="Enter Recipient Id"
          allowClear
          size="small"
          value={recipientName}
          required
          onChange={(e) => {
            setRecipientName(e.target.value);
          }}
        />
      </Modal>
    </Spin>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.app.user,
    token: state.app.token,
  };
};

export default connect(mapStateToProps, null)(Schedule);
