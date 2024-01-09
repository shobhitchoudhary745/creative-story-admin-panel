import React, { useContext } from "react";
import { Store } from "../../states/store";
import { Link, useNavigate } from "react-router-dom";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header({ sidebarHandler }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { userInfo } = {
    userInfo: {
      fullname: "Codify",
      avatar:
        "https://cdn2.iconfinder.com/data/icons/avatars-60/5985/2-Boy-512.png",
    },
  };
  const signoutHandler = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to Logout?") === true) {
      ctxDispatch({ type: "USER_SIGNOUT" });
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container fluid className="ps-0">
            <GiHamburgerMenu
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginLeft: "1.75rem",
                cursor: "pointer",
              }}
              onClick={() => sidebarHandler()}
            />

            <Nav className="ms-auto">
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="user_profile"
                  className="right-profile-logo"
                >
                  <img
                    src={userInfo.avatar}
                    alt="profile_img"
                    className="dropdown-logo"
                  />
                  {/* <FaUserCircle size={"25px"} /> */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    Signed in as
                    <br />
                    <b>Admin</b>
                  </Dropdown.Header>

                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <Link to="/admin/view-profile/" className="nav-link">
                      <FaUser className="icon-md" /> Profile
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link onClick={signoutHandler} to="/" className="nav-link">
                      <FaSignOutAlt className="icon-md" /> Log Out
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
}
