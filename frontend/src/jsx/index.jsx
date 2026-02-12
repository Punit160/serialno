import { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import Setting from "./layouts/Setting";
import ScrollToTop from './pages/ScrollToTop';

import { ThemeContext } from "../context/ThemeContext";

import Home from "./components/Dashboard/Home";
import DashboardDark from "./components/Dashboard/DashboardDark";
import CardsCenter from "./components/Dashboard/CardsCenter";

import Generatepanel from "./components/GeneratePanel/Generatepanel";
import ViewGeneratePanel from "./components/GeneratePanel/ViewGeneratePanel";
import DispatchPanel from "./components/DispatchPanel/DispatchPanel";
import ViewDispatchPanel from "./components/DispatchPanel/ViewDispatch";
import DamagePanel from "./components/DamagePanel/Damagepanel";
import ViewDamagePanel from "./components/DamagePanel/ViewDamagePanel";
import AddUser from "./components/User/AddUser";
import ViewUser from "./components/User/ViewUser";
import ReceiveDamagedPanel from "./components/DamagePanel/ReceiveDamagedPanel";
import LockScreen from "./pages/LockScreen";

const Markup = () => {
  const allroutes = [
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    { url: "dashboard-dark", component: <DashboardDark /> },
    { url: "cards-center", component: <CardsCenter /> },

    { url: "panel/generate", component: <Generatepanel /> },
    { url: "generate/panel/list", component: <ViewGeneratePanel /> },

    { url: "dispatch/create", component: <DispatchPanel /> },
    { url: "dispatch/list", component: <ViewDispatchPanel /> },

    { url: "sender/damage/create", component: <DamagePanel /> },
    { url: "receiver/damage/create", component: <ReceiveDamagedPanel /> },
    { url: "damage/list", component: <ViewDamagePanel /> },

    { url: "user/add", component: <AddUser /> },
    { url: "user/list", component: <ViewUser /> },
  ];

  return (
    <>
      <Routes>
        <Route path="/page-lock-screen" element={<LockScreen />} />

        <Route path="/" element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route key={i} path={data.url} element={data.component} />
          ))}
        </Route>
      </Routes>

      <ScrollToTop />
    </>
  );
};


// ----- ADD THIS HERE (below Markup, above export) -----
function MainLayout() {
  const { sidebariconHover } = useContext(ThemeContext);
  const sideMenu = useSelector((state) => state.sideMenu);

  return (
    <>
      <div
        id="main-wrapper"
        className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${
          sideMenu ? "menu-toggle" : ""
        }`}
      >
        <Nav />

        <div
          className="content-body"
          style={{ minHeight: window.screen.height - 60 }}
        >
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>

        <Footer />
      </div>

      <Setting />
    </>
  );
}



export default Markup;
