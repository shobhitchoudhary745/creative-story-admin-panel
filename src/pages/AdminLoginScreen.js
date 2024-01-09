import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useTitle } from "../components";
import { toastOptions } from "../utils/error";
import { clearErrors, login } from "../states/actions";

export default function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;

  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(ctxDispatch, dispatch, { email:username, password });
  };

  useEffect(() => {
    if (token) {
      // setTimeout(() => {
        navigate("/admin/dashboard");
      // }, 2000);
    }
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error, token]);

  useTitle("Login");
  return (
    <Container fluid className="p-0 vh-100 f-center flex-column login-page">
      <div className="login-logo">
        <Link to="/" className="text-center">
          <b>Creative Story</b>
        </Link>
      </div>

      <Card className="login-box">
        <Card.Body>
          <p className="text-center">Sign in to start your session</p>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="text" className="input-group mb-3">
              <Form.Control
                placeholder="Email"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
            </Form.Group>
            <Form.Group controlId="password" className="input-group mb-3">
              <Form.Control
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaLock />
              </InputGroup.Text>
            </Form.Group>
            {/* <Row>
            <Col sm={7} className="mb-sm-0 mb-3">
                <Form.Group controlId="remember">
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Remember Me"
                  />
                </Form.Group>
              </Col>
              <Col sm={5}>
                {loading ? (
                  <Button disabled className="float-sm-end">
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="float-sm-end">
                    Sign In
                  </Button>
                )}
              </Col>
            </Row> */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <input type="checkbox" />
                <label>Remember Me</label>
              </div>
              <div>
              {loading ? (
                  <Button disabled className="float-sm-end">
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="float-sm-end">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </Form>
          <ToastContainer />
        </Card.Body>
      </Card>
    </Container>
  );
}
