import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, user } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    setFirstName(user?.firstName ? user.firstName : "");
    setLastName(user?.lastName ? user.lastName : "");
    setCountryCode(user?.mobile_no ? user.mobile_no.split(" ")[0] : "");
    setMobile(user?.mobile_no ? user.mobile_no.split(" ")[1] : "");
  }, [user]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setCountryCode("");
    setMobile("");
  };

  const changeHandler = (e) =>{
    const value = e.target.value;
    const isValid = /^[0-9]*$/.test(value);
    if(isValid&&value.length<11){
      setMobile(value);
    }
  }
  useEffect(() => {}, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!firstName && !lastName && !mobile && !countryCode) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    const isValidCode = /^\+\d{1,3}$/.test(countryCode);
    if (!isValidCode) {
      toast.warning("please enter valid country code");
      return ;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true)
      const { data } = await axiosInstance.put(
        `/api/admin/updateUser/${id}`,
        {
          firstName,
          lastName,
          countryCode,
          mobile,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        setLoad(false)
        toast.success("User Profile Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/users");
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        setLoad(false);
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      //   dispatch({ type: "UPDATE_FAIL" });
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
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstName}
                minLength={4}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={lastName}
                minLength={4}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Country Code</Form.Label>
              <Form.Control
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Mobile no</Form.Label>
              <Form.Control
                
                value={mobile}
                onChange={changeHandler}
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
            {load ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
