import { Fragment, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { navtoggle } from "../../../store/actions/AuthActions";
import img from "../../../assets/images/logo.png";

const NavHader = () => {

  const { navigationHader, openMenuToggle, background } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const sideMenu = useSelector(state => state.sideMenu);

  const handleToogle = () => {
    dispatch(navtoggle());
  };

  return (
    <div className="nav-header">

      <Link to="/dashboard" className="brand-logo d-flex align-items-center">

        {background.value === "dark" || navigationHader !== "color_1" ? (
          <Fragment>
            <img src={img} alt="Logo img" className="logo" width={40} height={40} />

            {!sideMenu && (
              <h3 className="fw-bold pt-3 mx-2 mb-0 d-none d-md-block">
                VenturesPvt Ltd.
              </h3>
            )}

          </Fragment>
        ) : (
          <Fragment>
            <img
              src={img} alt="Logo img" className="logo" width={40} height={40} />

            {!sideMenu && (
              <h3 className="fw-bold pt-3 mx-2 mb-0 d-none d-md-block">
                VenturesPvt Ltd.
              </h3>
            )}

          </Fragment>
        )}

      </Link>

      <div
        className="nav-control"
        onClick={() => { openMenuToggle(); handleToogle(); }}      >
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>

    </div>
  );
};

export default NavHader;
