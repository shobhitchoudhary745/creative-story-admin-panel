import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error";
import { reducer } from "../../states/reducers";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UpdateProfileModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, userInfo } = state;
  const navigate = useNavigate(); 
  const [firstname, setFirstname] = useState(""); 
  const [lastname, setLastname] = useState(""); 
  const [mobile_no, setMobileNo] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(()=>{
    if(userInfo.firstName){
      setFirstname(userInfo.firstName);
      setLastname(userInfo.lastName);
      setMobileNo(userInfo.mobile_no);
    }
  },[userInfo])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: "FETCH_REQUEST" });

  //       const { data } = await axiosInstance.get("/api/user/user-profile", {
  //         headers: { authorization: `Bearer ${token}` },
  //       });

  //       const user = data.user;

  //       setFirstname(user.firstname);
  //       setLastname(user.lastname);
  //       // setFax(user.fax);
  //       setMobileNo(user.mobile_no);

  //       dispatch({ type: "FETCH_SUCCESS" });
  //     } catch (err) {
  //       dispatch({
  //         type: "FETCH_FAIL",
  //         payload: getError(err),
  //       });
  //       toast.error(getError(error), {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     }
  //   };
  //   if(token)
  //   fetchData();
  // }, [token, props.show]);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setMobileNo("");
    // setFax("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // // console.log("ok");
    try {
      if (!firstname && !lastname && !mobile_no) {
        toast.warning("Please fill atleast one fieled");
        return;
      }
      setLoadingUpdate(true);

      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.patch(
        "/api/admin/updateAdminProfile",
        {
          firstName: firstname,
          lastName: lastname,
          mobile_no,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // // console.log("data", data);
      if (data.success) {
        toast.success("Admin Profile Updated Successfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoadingUpdate(false);
        ctxDispatch({ type: "PROFILE_UPDATE", payload: data.user });
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        resetForm();
        setTimeout(() => {
          props.onHide();
        }, 1200);
      } else {
        dispatch({ type: "UPDATE_FAIL" });
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Profile
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container
            // className="small-container p-3"
            // style={{ backgroundColor: "#f4f6f9" }}
          >
            {/* <img
            src={preview}
            alt={"profile_img"}
            style={{ width: "200px", height: "200px" }}
          /> */}
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstname}
                minLength={4}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={lastname}
                minLength={4}
                onChange={(e) => setLastname(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="fax">
              <Form.Label>Fax</Form.Label>
              <Form.Control
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                required
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </Form.Group>

            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loadingUpdate ? ( 
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
