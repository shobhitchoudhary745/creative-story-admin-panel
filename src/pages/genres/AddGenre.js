import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Card, Col, Container, Row, Form, Button, Spinner } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils/error";

export default function AddGenre() {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const [genre, setGenre] = useState("");
  const [starter, setStarter] = useState("");
  const [starterArray, setStarterArray] = useState([]);
  const [load, setLoad] = useState(false);

  const resetForm = (e) => {
    setGenre("");
    setStarter("");
    setStarterArray([]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (starterArray.length === 0) {
      toast.warning("Please add atleast one starter");
      return;
    }
    try {
      setLoad(true);
      const { data } = await axiosInstance.post(
        "/api/genre/addGenre",
        {
          genre,
          starter: starterArray,
        },
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setLoad(false)
        toast.success("Genre Added Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/genres");
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

  const addStarter = (e) => {
    if (starter.length) {
      setStarterArray((p) => [...p, starter]);
      setStarter("");
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
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Starter</Form.Label>
                    <Form.Control
                      value={starter}
                      onChange={(e) => setStarter(e.target.value)}
                    />
                  </Form.Group>
                  <Button onClick={addStarter} variant="primary">
                    Add Starter
                  </Button>
                  <ul>
                    {starterArray.map((data, index) => {
                      return <li key={index}>{data}</li>;
                    })}
                  </ul>
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
