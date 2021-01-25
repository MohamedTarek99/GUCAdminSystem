import { Drawer, message, Spin, Timeline } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { EyeOutlined, CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { setNotifications } from "../../redux/actions";
import { connect } from "react-redux";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
function Notifications({ notifications, setNotifications }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getNotifications() {
    setLoading(true);
    const notifications = await axios.get(
      "http://localhost:3000/notifications",
      {
        headers: { token: localStorage.getItem("JWT") },
      }
    );
    console.log(notifications.data);
    setNotifications(notifications.data);
    setLoading(false);
  }
  return (
    <Drawer
      title="Notifications"
      placement="right"
      closable
      onClose={() => history.goBack()}
      visible
      width={600}
    >
      <Spin indicator={antIcon} spinning={loading}>
        <Timeline>
          {notifications
            .map((n) => (
              <Timeline.Item key={n._id} color={n.seen ? "gray" : "green"}>
                {n.seen ? (
                  <CheckOutlined />
                ) : (
                  <EyeOutlined
                    style={{ margin: 0, cursor: "pointer", paddingRight: 5 }}
                    onClick={async () => {
                      await axios.put(
                        `http://localhost:3000/notifications/${n._id}/mark-as-seen`,
                        {
                          headers: { token: localStorage.getItem("JWT") },
                        }
                      );
                      getNotifications();
                      message.success("Marked as seen!");
                    }}
                  />
                )}{" "}
                {n.message}
              </Timeline.Item>
            ))
            .reverse()}
        </Timeline>
      </Spin>
    </Drawer>
  );
}
const mapStateToProps = (state) => {
  return {
    notifications: state.app.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotifications: (notifications) =>
      dispatch(setNotifications(notifications)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
