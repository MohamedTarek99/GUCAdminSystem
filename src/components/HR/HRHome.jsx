import React, { useState } from "react";
import "antd/dist/antd.css";
import "./HRHome.css";
import axios from "axios";
import { connect } from "react-redux";

import { Layout, Menu, Breadcrumb, Button, notification, Spin, Row } from "antd";
import {
    BankOutlined,
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
  AccountBookOutlined ,
  DatabaseOutlined 
} from "@ant-design/icons";
import { Route, useHistory, useLocation } from "react-router-dom";
import gucLogo from "../../images/GUCsLogo.png";
import { AuthRoute } from "../AuthRoute";
// import Profile from "./Profile";
import WelcomePage from "../StaffWelcomePage";
import Location from "./Locations";
import Users from "./Users";
import MissingDays from "./MissingHours"
import Faculties from "./Faculties"
import Courses from './Courses'
import Departments from './Departments'
import AddSigns from './AddSigns'

import ViewProfile from "../ViewProfile"
import ResetPassword from "../ResetPassword";
import UpdateProfile from "../UpdateProfile";
import ViewAttendanceRecords from "../ViewAttendanceRecords"
import ViewMissingDaysAndHours from "../ViewMissingDaysAndHours"





const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const routeNames = [
  {
    name: "Welcome",
    path: "welcomePage",
    component: WelcomePage,
    icon: HomeOutlined,
  },{
    name: "Locations",
    path: "location",
    component: Location,
    icon: BankOutlined,
  } ,
  {
    name: "Users",
    path: "users",
    component: Users,
    icon: TeamOutlined,
  } ,
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
      name:"MissingDays",
      path:"missingdays",
      component:MissingDays,
      icon:AccountBookOutlined
  },
  {
    name:"Faculties",
    path:"faculties",
    component:Faculties,
    icon:DatabaseOutlined
},
{
    name:"Courses",
    path:"courses",
    component:Courses,
    icon:DatabaseOutlined
},
{
    name:"Departments",
    path:"department",
    component:Departments,
    icon:DatabaseOutlined
},
{
    name:"AddSigns",
    path:"addsigns",
    component:AddSigns,
    icon:DatabaseOutlined
}
//   {
//     name: "Profile",
//     path: "profile",
//     component: Profile,
//     icon: UserOutlined,
//   }

];
const HRHome = (props) => {
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
                  (r) => !r.submenu &&!r.user
                )
                .map(({ name, path, icon: Icon }) => {
                  return (
                    <Menu.Item
                      key={path}
                      icon={<Icon />}
                      onClick={() => history.push(`/hrHome/${path}`)}
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
                        onClick={() => history.push(`/hrHome/${path}`)}
                      >
                        {name}
                      </Menu.Item>
                    );
                  })}
              </SubMenu>

              <SubMenu key="sub2" icon={<UserOutlined />} title="User">
                {routeNames
                  .filter((r) => r.user)
                  .map(({ name, path, icon: Icon }) => {
                    return (
                      <Menu.Item
                        key={path}
                        icon={<Icon />}
                        onClick={() => history.push(`/hrHome/${path}`)}
                      >
                        {name}
                      </Menu.Item>
                    );
                  })}
              </SubMenu>
        
            
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
                 <Breadcrumb.Item>HR</Breadcrumb.Item>
                  <Breadcrumb.Item>{currentRoute.name}</Breadcrumb.Item>
                </Breadcrumb>
              )}
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 600 }}
              >
                {routeNames.map(({ component: RouteComponent, path }) => {
                  return (
                    <Route key={path} path={`/hrHome/${path}`}>
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

export default connect(mapStateToProps, null)(HRHome);
