import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { Cropper, LoadingBox } from "../../components";

export default function EditBannersModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, banner } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [clientName, setClientName] = useState("");
  const [navigationLink, setNavigationLink] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (banner.clientName) {
      setClientName(banner?.clientName ? banner.clientName : "");
      setNavigationLink(banner?.navigationUrl ? banner.navigationUrl : "");
    }
  }, [banner]);

  const resetForm = () => {
    setClientName("");
    setNavigationLink("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image && !clientName && !navigationLink) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const formData = new FormData();
      formData.append("clientName", clientName);
      formData.append("navigationUrl", navigationLink);
      
      formData.append("image", image);
      const { data } = await axiosInstance.put(
        `/api/banner/update-banner/${id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success("Banner Updated Succesfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setLoad(false);
        setTimeout(() => {
          navigate("/admin/banners");
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 1200);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      setLoad(false);
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Banner</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Banner</Form.Label>
              <Cropper h={120} w={337} setImage={setImage} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                type="text"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Navigation Url</Form.Label>
              <Form.Control
                value={navigationLink}
                onChange={(e) => setNavigationLink(e.target.value)}
                // required
                type="text"
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
