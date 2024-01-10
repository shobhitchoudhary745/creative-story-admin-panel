import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";

export default function EditGenresModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, genre } = state;
  const { id } = useParams(); // category/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [genres, setGenre] = useState("");
  const [starter1, setStarter1] = useState("");
  const [starter2, setStarter2] = useState("");
  const [starter3, setStarter3] = useState("");

  useEffect(()=>{
    if(genre.starter&&genre.starter){
      setGenre(genre?.genre?genre.genre:"");
      setStarter1(genre?.starter[0]?genre.starter[0]:"");
      setStarter2(genre?.starter[1]?genre.starter[1]:"");
      setStarter3(genre?.starter[2]?genre.starter[2]:"");
    }
   

  },[genre])

  const resetForm = () => {
    setGenre("");
    setStarter1("");
    setStarter2("");
    setStarter3("");
  };

  useEffect(() => {}, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!genre && !starter1 && !starter2 && !starter3) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axiosInstance.put(
        `/api/admin/updateGenre/${id}`,
        {
          genre: genres,
          starter1,
          starter2,
          starter3,
        },
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

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Starter 1</Form.Label>
              <Form.Control
                value={starter1}
                onChange={(e) => setStarter1(e.target.value)}
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
              <Form.Label>Starter 3</Form.Label>
              <Form.Control
                value={starter3}
                onChange={(e) => setStarter3(e.target.value)}
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
