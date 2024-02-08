import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Col,
  Container,
  Row,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils/error";
import { Cropper } from "../../components";

export default function AddBanner() {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [navigationLink, setNavigationLink] = useState("");

  const [image, setImage] = useState("");
  const [load, setLoad] = useState(false);

  const resetForm = (e) => {
    setClientName("");
    setNavigationLink("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("navigationUrl", navigationLink);
    formData.append("image", image);
    if (!clientName || !navigationLink || !image) {
      toast.warning("Please add all fieled");
      return;
    }
    try {
      setLoad(true);
      const { data } = await axiosInstance.post(
        "/api/banner/create-banner",
        formData,
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setLoad(false);
        toast.success("Banner Added Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/banners");
        }, 1200);
      }
      resetForm();
    } catch (err) {
      setLoad(false);
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        <Row
          className="mt-2 mb-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <Col>
            <span style={{ fontSize: "xx-large" }}>Genre</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h6"}>Add</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Banner</Form.Label>
                    <Cropper h={120} w={337} setImage={setImage} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      type="text"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Navigation Link</Form.Label>
                    <Form.Control
                      value={navigationLink}
                      onChange={(e) => setNavigationLink(e.target.value)}
                      required
                      type="text"
                    />
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" type="submit">
                    {load ? <Spinner animation="border" size="sm" /> : "Submit"}
                  </Button>
                </Card.Footer>
                <ToastContainer />
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
