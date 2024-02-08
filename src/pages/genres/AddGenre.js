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

export default function AddGenre() {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const [genre, setGenre] = useState("");
  const [starter, setStarter] = useState("");
  const [description, setDescription] = useState("");
  const [colour, setColour] = useState("");
  const [starterArray, setStarterArray] = useState([]);
  const [backgroundColour, setBackgroundColour] = useState("");
  const [image, setImage] = useState("");
  const [load, setLoad] = useState(false);
  console.log(image);

  const resetForm = (e) => {
    setGenre("");
    setStarter("");
    setStarterArray([]);
    setColour("");
    setDescription("");
  };

  // const fileHandler = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (file.type.startsWith("image/")) {
  //       setImage(file);
  //     } else {
  //       toast.warning("Please select a valid image file.");
  //       e.target.value = null;
  //       return;
  //     }
  //   }

  //   if (e.target.files.length > 1) {
  //     toast.warning("Please select only one file.");
  //     e.target.value = null;
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!colour) {
      toast.warning("Please Add Genre Colour", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!backgroundColour) {
      toast.warning("Please Add Genre Background Colour", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    if (!image) {
      toast.warning("Please Add or Crop image", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    // e.preventDefault();
    const formData = new FormData();
    formData.append("genre", genre);
    formData.append("starter", JSON.stringify(starterArray));
    formData.append("colour", colour);
    formData.append("backgroundColour", backgroundColour);
    formData.append("image", image);
    if (starterArray.length === 0) {
      toast.warning("Please add atleast one starter");
      return;
    }
    try {
      setLoad(true);
      const { data } = await axiosInstance.post(
        "/api/genre/addGenre",
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setLoad(false);
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
    if (starter.length && description.length) {
      setStarterArray((p) => [...p, { starter, description }]);
      setStarter("");
      setDescription("");
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
                    <Form.Label>Colour</Form.Label>
                    <Form.Control
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      required
                      type="color"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Background Colour</Form.Label>
                    <Form.Control
                      value={backgroundColour}
                      onChange={(e) => setBackgroundColour(e.target.value)}
                      required
                      type="color"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Image</Form.Label>
                    <Cropper setImage={setImage} w={194} h={112} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Starter</Form.Label>
                    <Form.Control
                      value={starter}
                      maxLength={50}
                      onChange={(e) => setStarter(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      maxLength={250}
                      style={{ height: "120px" }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Button onClick={addStarter} variant="primary">
                    Add Starter
                  </Button>
                  <ul>
                    {starterArray.map((data, index) => {
                      return <li key={index}>{data.starter}</li>;
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
