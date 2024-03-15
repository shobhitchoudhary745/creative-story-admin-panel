import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
// import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import {  useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  
  Card,
  Col,
  Container,
  Row,
  
} from "react-bootstrap";
import EditStoriesModel from "./EditStoriesModel.js";
// import axiosInstance from "../../utils/axiosUtil.js";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import {  MessageBox } from "../../components";

import { getStory } from "../../states/actions.js";

const ViewStories = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token,story } = state;
  const { id } = useParams(); // category/:id
  // const navigate = useNavigate();
  // console.log("in this room")
  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    getStory(ctxDispatch, dispatch, token, id);
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : story.roomName} Details
                </Card.Title>

                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  {/* <Col md={4}>
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      <img
                        src={user.profileUrl}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        // height={"200px"}
                      />
                    )}
                  </Col> */}
                  <Col md={12}>
                    <Row>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Room Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story.roomName}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Status</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story.status}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Theme</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story.theme}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Participants</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story.participants.length}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Description</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story.description}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Host</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : story?.firstName?(story.host.firstName+" "+story.host.lastName):"Creative Story User"}</p>
                      </Col>
                      
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(story.createdAt)}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(story.updatedAt)}
                        </p>
                      </Col>
                    </Row>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
            <EditStoriesModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewStories;
