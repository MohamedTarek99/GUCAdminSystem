import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Input,
  message,
  Row,
  Select,
  Spin,
  Form,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function handleMonth(month) {
  switch (month) {
    case "Jan":
      return 1;
    case "Feb":
      return 2;
    case "Mar":
      return 3;
    case "Apr":
      return 4;
    case "May":
      return 5;
    case "Jun":
      return 6;
    case "Jul":
      return 7;
    case "Aug":
      return 8;
    case "Sep":
      return 9;
    case "Oct":
      return 10;
    case "Nov":
      return 11;
    case "Dec":
      return 12;
    default:
  }
}
export default function LeaveRequests() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const onClose = () => history.goBack();
  axios.defaults.headers.common["token"] = localStorage.getItem("JWT");

  async function handleLeaveSubmit({ dateTime, dateTime2, type, reason }) {
    setLoading(true);
    var x = "" + dateTime._d;
    var dateArray1 = x.split(" ");
    let dayTo;
    let yearTo;
    let monthTo;

    if (dateTime2) {
      var x2 = "" + dateTime2._d;
      var dateArray2 = x2.split(" ");
      dayTo = dateArray2[2];
      yearTo = dateArray2[3];
      monthTo = handleMonth(dateArray2[1]);
    }
    console.log(dateArray1);
    console.log(dateArray2);
    const day = dateArray1[2];
    const year = dateArray1[3];
    const month = handleMonth(dateArray1[1]);

    let res = await axios.post("http://localhost:3000/sendLeaveRequest", {
      type,
      reason,
      dayTo,
      yearTo,
      monthTo,
      day,
      year,
      month,
    });
    if (res.data === "request sent") {
      setLoading(false);
      message.success("Done");
    } else {
      setLoading(false);
      message.error(res.data);
    }
  }
  function onFinishFailed(params) {
    console.log(params);
  }
  return (
    <Drawer
      title="Create a Leave Request"
      width={720}
      onClose={onClose}
      visible
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
        </div>
      }
    >
      <Spin indicator={antIcon} spinning={loading} tip="Loading...">
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={handleLeaveSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={12}></Col>
            <Col span={12}></Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: "Please select the Type" }]}
              >
                <Select placeholder="Please select a type" allowClear>
                  <Option value="MATERNITY">Maternity</Option>
                  <Option value="ANNUAL">Annual</Option>
                  <Option value="ACCIDENTAL">Accidental</Option>
                  <Option value="SICK">Sick</Option>
                  <Option value="COMPENSATION">Compensation</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: true, message: "Please choose the dateTime" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateTime2" label="DateTime2">
                <DatePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="reason" label="Reason">
                <Input.TextArea rows={4} placeholder="please enter reason" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Drawer>
  );
}
