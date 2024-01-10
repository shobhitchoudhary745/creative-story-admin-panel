import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Store } from "../../states/store";
import { Link } from "react-router-dom";

export default function Footer() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const d = new Date();
  return (
    <>
      {userInfo ? (
        <Container fluid className="p-0 mt-auto">
          <footer className="text-center">
            <strong>
              Copyright © 2014-{`${d.getFullYear()} `}
              <Link to="/admin/dashboard">Creative Story</Link>.{" "}
            </strong>
            All rights reserved.
          </footer>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}
