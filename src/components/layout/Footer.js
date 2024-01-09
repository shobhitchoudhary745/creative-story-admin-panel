import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Store } from "../../states/store";

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
              <a href="http://localhost:3000">Creative Story</a>.{" "}
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
