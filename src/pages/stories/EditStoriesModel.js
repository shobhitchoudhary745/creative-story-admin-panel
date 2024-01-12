import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";
// import { getAllGenres } from "../../states/actions.js";

export default function EditStoriesModel(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, story, genres } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance("/api/genre/getAllGenre", {
          headers: { authorization: `Bearer ${token}` },
        });
        if (data.success) {
          ctxDispatch({
            type: "GENRES_DATA_FETCH_SUCCESSFULLY",
            payload: { genres: data.data, length: data.length },
          });
        }
      } catch (err) {
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token]);

  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setRoomName(story?.roomName ? story.roomName : "");
    setStatus(story?.status ? story.status : "");
    setTheme(story?.theme ? story.theme : "");
    setDescription(story?.description ? story.description : "");
  }, [story]);

  const resetForm = () => {
    setRoomName("");
    setStatus("");
    setTheme("");
    setDescription("");
  };

  useEffect(() => {}, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!roomName && !status && !theme && !description) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const { data } = await axiosInstance.put(
        `/api/admin/updateStory/${id}`,
        {
          roomName,
          status,
          theme,
          description,
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
        toast.success("Story Room Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/stories");
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 1200);
      } else {
        setLoad(false)
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
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Story Room
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Room Name</Form.Label>
              <Form.Control
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value={"active"}>Active</option>
                <option value={"upcoming"}>Upcoming</option>
                <option value={"completed"}>Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <Form.Select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                }}
                aria-label="Default select example"
              >
                {genres.map((data, index) => {
                  return <option key={index} value={data.genre}>{data.genre}</option>;
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
