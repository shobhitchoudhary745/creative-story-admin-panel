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
import EditUserModel from "./EditUserModel.js";
// import axiosInstance from "../../utils/axiosUtil.js";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import {  MessageBox } from "../../components";

import { getUser } from "../../states/actions.js";

const ViewUser = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token,user } = state;
  const { id } = useParams(); // category/:id
  // const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    getUser(ctxDispatch, dispatch, token, id);
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
                  {loading ? <Skeleton /> : (user.firstName+" "+user.lastName)} Details
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
                          <strong>First Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.firstName}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Last Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.lastName}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>User Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.userName}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Email</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.email}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Mobile</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.mobile_no}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Gender</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : user.gender}</p>
                      </Col>
                      
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(user.createdAt)}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : getDateTime(user.updatedAt)}
                        </p>
                      </Col>
                    </Row>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
            <EditUserModel
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

export default ViewUser;
