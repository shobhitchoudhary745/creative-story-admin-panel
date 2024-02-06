import "./SideNavBar.css";
import React, { useContext, useState } from "react";
import { Store } from "../../states/store";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../utils/creativestory.svg";
import {
  
  MdAutoStories,
  MdPrivacyTip,
} from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";
import {
 
  FaSignOutAlt,
 
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { AiFillDashboard } from "react-icons/ai";
import { RiAdvertisementFill } from "react-icons/ri";
import { VscListUnordered } from "react-icons/vsc";

const linkList = [
  {
    icon: <AiFillDashboard className="icon-md" />,
    text: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    icon: <FaUsers className="icon-md" />,
    text: "Users",
    url: "/admin/users",
  },
  {
    icon: <MdAutoStories className="icon-md" />,
    text: "Stories",
    url: "/admin/stories",
  },
  {
    icon: <VscListUnordered className="icon-md" />,
    text: "Genres",
    url: "/admin/genres",
  },
  {
    icon: <RiAdvertisementFill className="icon-md" />,
    text: "Banners",
    url: "/admin/banners",
  },
  {
    icon: <MdPrivacyTip className="icon-md" />,
    text: "Privacy Policy",
    url: "/admin/privacy-policy",
  },
  {
    icon: <RiFileList2Line className="icon-md" />,
    text: "Terms & Condition",
    url: "/admin/terms-and-condition",
  },
];

const active_text = {
  Dashboard: "dashboard",
  Users: "users",
  Stories: "stories",
  Genres: "genres",
  "Banners":"banners",
  "Privacy Policy": "privacy-policy",
  "Terms & Condition": "terms-and-condition",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.href.split("/").slice(-1);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = {
    userInfo: {
      fullname: "Codify",
      avatar:
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/2-Boy-512.png",
    },
  };
  const navigate = useNavigate();
  const signoutHandler = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to Logout?") === true) {
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const activeLinkHandler = (text) => {
    // console.log(pathname);
    return pathname.includes(active_text[text]);
  };

  const cls = `nav-item has-treeview ${
    isExpanded ? "menu-item" : "menu-item menu-item-NX"
  }`;
  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            <Link to="/admin/dashboard">
              <img
                src={logo}
                alt=""
                style={{ width: "50px", cursor: "pointer" }}
                height="50px"
              />
              <span className={`brand-text ms-2 ${!isExpanded&&"d-none"} font-weight-light info-text`}>
                Creative Story
              </span>
            </Link>
          </div>

          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to="/admin/view-profile/" className="d-block">
                  {userInfo.avatar && (
                    <img
                      src={userInfo.avatar}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  <span className="info-text">Welcome Admin</span>
                </Link>
              </div>
            </div>
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {linkList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`${cls} ${
                      activeLinkHandler(text) && "active-item"
                    }`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                <li className={cls}>
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
