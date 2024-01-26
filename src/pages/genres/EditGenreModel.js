import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";

export default function EditGenresModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, genre } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [genres, setGenre] = useState("");
  const [colour, setColour] = useState("");
  const [starter1, setStarter1] = useState("");
  const [starter2, setStarter2] = useState("");
  const [starter3, setStarter3] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [description3, setDescription3] = useState("");
  const [backgroundColour, setBackgroundColour] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (genre.starter && genre.starter) {
      setGenre(genre?.genre ? genre.genre : "");
      setStarter1(genre?.starter[0] ? genre.starter[0].starter : "");
      setStarter2(genre?.starter[1] ? genre.starter[1].starter : "");
      setStarter3(genre?.starter[2] ? genre.starter[2].starter : "");
      setDescription1(genre?.starter[0] ? genre.starter[0].description : "");
      setDescription2(genre?.starter[1] ? genre.starter[1].description : "");
      setDescription3(genre?.starter[2] ? genre.starter[2].description : "");
      setColour(genre?.colour ? genre.colour : "");
      setBackgroundColour(
        genre?.backgroundColour ? genre.backgroundColour : ""
      );
    }
  }, [genre]);

  const resetForm = () => {
    setGenre("");
    setStarter1("");
    setStarter2("");
    setStarter3("");
    setDescription1("");
    setDescription2("");
    setDescription3("");
    setColour("");
    setBackgroundColour("");
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        toast.warning("Please select a valid image file.");
        e.target.value = null;
        return;
      }
    }

    if (e.target.files.length > 1) {
      toast.warning("Please select only one file.");
      e.target.value = null;
    }
  };

  useEffect(() => {}, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!genre && !starter1 && !starter2 && !starter3 &&!description1&&!description2&&!description3) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const formData = new FormData();
      formData.append("genre", genres);
      formData.append("starter1", starter1);
      formData.append("starter2", starter2);
      formData.append("starter3", starter3);
      formData.append("description1", description1);
      formData.append("description2", description2);
      formData.append("description3", description3);
      // formData.append("starter", JSON.stringify(starterArray));
      formData.append("colour", colour);
      formData.append("backgroundColour", backgroundColour);
      formData.append("image", image);
      const { data } = await axiosInstance.put(
        `/api/admin/updateGenre/${id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success("Genre Updated Succesfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setLoad(false);
        setTimeout(() => {
          navigate("/admin/genres");
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Genre</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Genre Description</Form.Label>
              <Form.Control
                value={genres}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                type="color"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Background Colour</Form.Label>
              <Form.Control
                value={backgroundColour}
                onChange={(e) => setBackgroundColour(e.target.value)}
                // required
                type="color"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Image</Form.Label>
              <Form.Control
                // value={image}
                onChange={fileHandler}
                // required
                type="file"
                accept="image/*"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Starter 1</Form.Label>
              <Form.Control
                value={starter1}
                onChange={(e) => setStarter1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Starter 2</Form.Label>
              <Form.Control
                value={starter2}
                onChange={(e) => setStarter2(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description2}
                onChange={(e) => setDescription2(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Starter 3</Form.Label>
              <Form.Control
                value={starter3}
                onChange={(e) => setStarter3(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description3}
                onChange={(e) => setDescription3(e.target.value)}
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
