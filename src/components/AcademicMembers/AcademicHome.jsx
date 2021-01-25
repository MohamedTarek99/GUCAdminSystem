import React, { useState } from "react";
import "antd/dist/antd.css";
import "./AcademicHome.css";
import axios from "axios";
import { connect } from "react-redux";
import Schedule from "./Schedule";
import ViewRepRequest from "./Requests/ViewRepRequest";
import ViewSubRequest from "./Requests/ViewSubRequest";
import ViewSlotsForSL from "./Requests/ViewSlotsForSL";
import ViewSlotsForRep from "./Requests/ViewSlotsForRep";
import SlotLinkingRequests from "./Coordinator/SlotLinkingRequests";
import ViewSlots from "./Coordinator/ViewSlots";
import { Layout, Menu, Breadcrumb, Button, notification, Spin } from "antd";
import {
  NotificationOutlined,
  ScheduleOutlined,
  QuestionOutlined,
  UserOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  LogoutOutlined,
  LoadingOutlined,
  RightCircleOutlined,
  IdcardOutlined,
  CopyrightOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Route, useHistory, useLocation } from "react-router-dom";
import gucLogo from "../../images/GUCsLogo.png";
import { AuthRoute } from "../AuthRoute";
import Notifications from "./Notifications";
import LeaveRequests from "./Requests/LeaveRequests";
import ChangeDayOFF from "./Requests/ChangeDayOFF";
import WelcomePage from "../StaffWelcomePage";
import ViewAssign from "./Instructor/ViewAssign";
import ViewCourseStaff from "./Instructor/ViewCourseStaff";
import ViewDepartmentStaff from "./Instructor/ViewDepartmentStaff";
import Coverage from "./HeadOfDepartment/Coverage";
import RequestsDayOff from "./HeadOfDepartment/RequestsDayOff";
import RequestsLeaves from "./HeadOfDepartment/RequestsLeaves";
import ViewDayOff from "./HeadOfDepartment/ViewDayOff";
import ViewStaff from "./HeadOfDepartment/ViewStaff";
import InstructorAssigns from "./HeadOfDepartment/InstructorsAssign";
import ViewProfile from "../ViewProfile"
import ResetPassword from "../ResetPassword";
import UpdateProfile from "../UpdateProfile";
import ViewAttendanceRecords from "../ViewAttendanceRecords"
import ViewMissingDaysAndHours from "../ViewMissingDaysAndHours"
import SendReplacementReq from "./Requests/SendReplacementRequest"

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const routeNames = [
  {
    name: "Reset Password",
    path: "resetpassword",
    component: ResetPassword,
    icon: ArrowRightOutlined,
 user:true },
  {
    name: "Update Profile",
    path: "updateprofile",
    component: UpdateProfile,
    icon: ArrowRightOutlined,
    user:true},{
    name: "View My Attendance",
    path: "myattendance",
    component: ViewAttendanceRecords,
    icon: ArrowRightOutlined,
    user:true},
  {
    name: "View my missng days/hours",
    path: "viewmissing",
    component: ViewMissingDaysAndHours,
    icon: ArrowRightOutlined,
    user:true},
  {
    name: "My Profile",
    path: "myprofile",
    component: ViewProfile,
    icon: ArrowRightOutlined,
    user:true
  },
  {
    name: "Welcome",
    path: "welcomePage",
    component: WelcomePage,
    icon: HomeOutlined,
  },

  {
    name: "Schedule",
    path: "schedule",
    component: Schedule,
    icon: ScheduleOutlined,
  },
  {
    name: "Coverage",
    path: "coverage",
    component: Coverage,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "Day Off Requests",
    path: "requestDayOff",
    component: RequestsDayOff,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "Leave Requests",
    path: "viewLeaveRequests",
    component: RequestsLeaves,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "View Day Off",
    path: "viewDayOff",
    component: ViewDayOff,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "View Staff",
    path: "viewStaff",
    component: ViewStaff,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "Instructors Assign",
    path: "IntructorsAssign",
    component: InstructorAssigns,
    icon: ArrowRightOutlined,
    hod: true,
  },
  {
    name: "View Slot Linking Request",
    path: "viewSlotLinkingRequest",
    component: SlotLinkingRequests,
    icon: ArrowRightOutlined,
    coordinator: true,
  },
  {
    name: "View Slots",
    path: "viewSlots",
    component: ViewSlots,
    icon: ArrowRightOutlined,
    coordinator: true,
  },
  {
    name: "View Assigns",
    path: "viewAssign",
    component: ViewAssign,
    icon: ArrowRightOutlined,
    instructor: true,
  },
  {
    name: "View Course Staff",
    path: "viewCourseStaff",
    component: ViewCourseStaff,
    icon: ArrowRightOutlined,
    instructor: true,
  },
  {
    name: "View Department Staff",
    path: "viewDepartmentStaff",
    component: ViewDepartmentStaff,
    icon: ArrowRightOutlined,
    instructor: true,
  },
  {
    name: "Change Day Off",
    path: "changeDayOff",
    component: ChangeDayOFF,
    submenu: true,
    icon: PlusOutlined,
  },
  {
    name: "Leave Requests",
    path: "leaveRequests",
    component: LeaveRequests,
    submenu: true,
    icon: PlusOutlined,
  },

  {
    name: "View Submitted Request(s)",
    path: "viewSubmittedRequest",
    component: ViewSubRequest,
    submenu: true,
    icon: ArrowRightOutlined,
  },
  {
    name: "Send Replacement Request(s)",
    path: "sendreplacementrequest",
    component: SendReplacementReq,
    submenu: true,
    icon: ArrowRightOutlined,
  },
  {
    name: "View Replacement Request(s)",
    path: "viewReplacementRequest",
    component: ViewRepRequest,
    submenu: true,
    icon: ArrowRightOutlined,
  },

  {
    name: "Available Slots For Replacement",
    path: "availableRepSlots",
    component: ViewSlotsForRep,
    submenu: true,
    icon: RightCircleOutlined,
  },
  {
    name: "Available Slots For Slot Linking",
    path: "availableSlots",
    component: ViewSlotsForSL,
    submenu: true,
    icon: RightCircleOutlined,
  },
  {
    name: "Notifications",
    path: "notifications",
    component: Notifications,
    icon: NotificationOutlined,
  },
];
const AcademicHome = (props) => {
  axios.defaults.headers.common["token"] = props.token;
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


  const history = useHistory();
  const location = useLocation();
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  function openLogoutNotification() {
    const key = `LogoutNotification`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={async () => {
          notification.close(key);
          setLoading(true);
          await axios.post("http://localhost:3000/logout");
          setLoading(false);
          localStorage.clear();
          history.push("/");
        }}
      >
        Confirm
      </Button>
    );

    notification.open({
      message: "Logout",
      description: "Are you sure you want to logout",
      btn,
      key,
      duration: 3,
    });
  }

  const currentPath = location.pathname.split("/").reverse().shift();
  const currentRoute = routeNames.filter((r) => r.path === currentPath).pop();
  return (
    <>
      <Spin indicator={antIcon} spinning={loading}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            width="300px"
          >
            <div className="logo">
              <img src={gucLogo} alt="" height="40px" width="43px" />
            </div>
            <Menu theme="dark" selectedKeys={[currentPath]} mode="inline">
              {routeNames
                .filter(
                  (r) => !r.submenu && !r.coordinator && !r.instructor && !r.hod &&!r.user
                )
                .map(({ name, path, icon: Icon }) => {
                  return (
                    <Menu.Item
                      key={path}
                      icon={<Icon />}
                      onClick={() => history.push(`/acHome/${path}`)}
                    >
                      {name}
                    </Menu.Item>
                  );
                })}
              <SubMenu key="sub1" icon={<QuestionOutlined />} title="Requests">
                {routeNames
                  .filter((r) => r.submenu)
                  .map(({ name, path, icon: Icon }) => {
                    return (
                      <Menu.Item
                        key={path}
                        icon={<Icon />}
                        onClick={() => history.push(`/acHome/${path}`)}
                      >
                        {name}
                      </Menu.Item>
                    );
                  })}
              </SubMenu>
              <SubMenu key="sub" icon={<UserOutlined />} title="User">
                {routeNames
                  .filter((r) => r.user)
                  .map(({ name, path, icon: Icon }) => {
                    return (
                      <Menu.Item
                        key={path}
                        icon={<Icon />}
                        onClick={() => history.push(`/acHome/${path}`)}
                      >
                        {name}
                      </Menu.Item>
                    );
                  })}
              </SubMenu>

              {props.user.roles.includes("Coordinator") && (
                <SubMenu
                  key="sub2"
                  icon={<CopyrightOutlined />}
                  title="Coordinator Actions"
                >
                  {routeNames
                    .filter((r) => r.coordinator)
                    .map(({ name, path, icon: Icon }) => {
                      return (
                        <Menu.Item
                          key={path}
                          icon={<Icon />}
                          onClick={() => history.push(`/acHome/${path}`)}
                        >
                          {name}
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              )}


              {props.user.roles.includes("HeadOfDepartment") && (
                <SubMenu
                  key="sub4"
                  icon={<TeamOutlined />}
                  title="Head Of Department Actions"
                >
                  {routeNames
                    .filter((r) => r.hod)
                    .map(({ name, path, icon: Icon }) => {
                      return (
                        <Menu.Item
                          key={path}
                          icon={<Icon />}
                          onClick={() => history.push(`/acHome/${path}`)}
                        >
                          {name}
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              )}
              {props.user.roles.includes("Instructor") && (
                <SubMenu
                  key="sub3"
                  icon={<IdcardOutlined />}
                  title="Instructor Actions"
                >
                  {routeNames
                    .filter((r) => r.instructor)
                    .map(({ name, path, icon: Icon }) => {
                      return (
                        <Menu.Item
                          key={path}
                          icon={<Icon />}
                          onClick={() => history.push(`/acHome/${path}`)}
                        >
                          {name}
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              )}
            </Menu>
            <Menu selectable={false}>
              <Menu.Item
                key="Logout"
                icon={<LogoutOutlined />}
                onClick={() => {
                  openLogoutNotification();
                }}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="layout-header">GUC</Header>
            <Content style={{ margin: "0 16px" }}>
              {currentRoute && (
                <Breadcrumb style={{ margin: "16px 0" }}>
                  {currentRoute.submenu && (
                    <Breadcrumb.Item>Requests</Breadcrumb.Item>
                  )}
                  {currentRoute.coordinator && (
                    <Breadcrumb.Item>Coordinator</Breadcrumb.Item>
                  )}
                  {currentRoute.instructor && (
                    <Breadcrumb.Item>Instructor</Breadcrumb.Item>
                  )}
                  {currentRoute.hod && (
                    <Breadcrumb.Item>Head Of Department</Breadcrumb.Item>
                  )}
                  <Breadcrumb.Item>{currentRoute.name}</Breadcrumb.Item>
                </Breadcrumb>
              )}
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 600 }}
              >
                {routeNames.map(({ component: RouteComponent, path }) => {
                  return (
                    <Route key={path} path={`/acHome/${path}`}>
                      <AuthRoute component={RouteComponent} />
                    </Route>
                  );
                })}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>GUC Academic</Footer>
          </Layout>
        </Layout>
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

export default connect(mapStateToProps, null)(AcademicHome);
