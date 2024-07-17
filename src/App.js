import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MedicalForm from "./pages/MedicalForm";
import ExportForm from "./pages/ExportForm";
import logo from "./images/logo2.png";

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  // const [open, setOpen] = useState(false);
  const location = useLocation();

  // const handleDrawerToggle = () => {
  //   setOpen(!open);
  // };

  return (
    <>
      <div id="wrapper">
        <nav className="navbar-default navbar-static-side" role="navigation">
          <div className="sidebar-collapse">
            <ul className="nav metismenu" id="side-menu">
              <li className="nav-header">
                <div
                  className="dropdown profile-element text-center"
                  style={{ marginLeft: "0px", color: "#ffffff" }}
                >
                  <div className="rounded-circle">
                    <img src={logo} alt="image" />
                  </div>
                  <span className="block m-t-xs font-bold ">KSBR</span>
                </div>

                <div className="logo-element">KSBR</div>
              </li>
              <li>
                <a href="index.html">
                  <i className="fa fa-th-large"></i>{" "}
                  <span className="nav-label">ออกปฏิบัติงาน</span>
                  <span className="fa arrow"></span>
                </a>
                <ul className="nav nav-second-level collapse">
                  <li className={location.pathname === "/" ? "active" : ""}>
                    <Link to="/">แบบแจ้งค่ารักษาพยาบาลผู้ป่วยนอก</Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/exportform" ? "active" : ""
                    }
                  >
                    <Link to="/exportform">Export</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
        <div id="page-wrapper" className="gray-bg">
          <div className="row border-bottom">
            <nav
              className="navbar navbar-static-top"
              role="navigation"
              style={{ marginBottom: 0, color: "#808080" }}
            >
              <div className="navbar-header">
                <IconButton className="navbar-minimalize minimalize-styl-2 btn btn-primary">
                  <MenuIcon />
                </IconButton>
              </div>
            </nav>
          </div>
          <Routes>
            <Route path="/" element={<MedicalForm />} />
            <Route path="/exportform" element={<ExportForm />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
