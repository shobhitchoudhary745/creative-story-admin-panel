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
import EditGenreModel from "./EditGenreModel.js";
// import axiosInstance from "../../utils/axiosUtil.js";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import {  MessageBox } from "../../components";

import { getGenre } from "../../states/actions.js";

const ViewGenre = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token,genre } = state;
  const { id } = useParams(); // category/:id
  // const navigate = useNavigate();
  // console.log("in this room")
  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    getGenre(ctxDispatch, dispatch, token, id);
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
                  {loading ? <Skeleton /> : "Genre Details"} 
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
                  <Col md={12}>
                    <Row>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Genre</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : genre.genre}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Starter 1</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : genre.starter[0]}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Starter 2</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : genre.starter[1]}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Starter 3</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : genre.starter[2]}</p>
                      </Col>
                      
                      
                      
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(genre.createdAt)}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(genre.updatedAt)}
                        </p>
                      </Col>
                    </Row>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
            <EditGenreModel
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

export default ViewGenre;
