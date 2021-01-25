import {
  Button,
  Col,
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

export default function ChangeDayOFF() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const onClose = () => history.goBack();
  async function handleCDOSubmit({ day, reason }) {
    setLoading(true);
    console.log(day);
    let res = await axios.post(
      "http://localhost:3000/sendChangeDayOffRequest",
      {
        day,
        reason,
      }
    );
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
      title="Create a (Change Day Off) Request"
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
          onFinish={handleCDOSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="day"
                label="Day"
                rules={[
                  {
                    required: true,
                    message: "Please choose the desired day",
                  },
                ]}
              >
                <Select placeholder="Please choose the desired day" allowClear>
                  <Option value="Saturday">Saturday</Option>
                  <Option value="Sunday">Sunday</Option>
                  <Option value="Monday">Monday</Option>
                  <Option value="Tuesday">Tuesday</Option>
                  <Option value="Wednesday">Wednesday</Option>
                  <Option value="Thursday">Thursday</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="reason" label="Reason">
                <Input.TextArea
                  rows={4}
                  placeholder="please enter the reason"
                />
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
