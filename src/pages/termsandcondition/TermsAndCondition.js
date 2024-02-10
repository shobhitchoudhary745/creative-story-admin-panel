import React, { useContext, useEffect, useReducer, useState } from "react";
import { reducer } from "../../states/reducers";
import axiosInstance from "../../utils/axiosUtil";
import { Store } from "../../states/store";
import { motion } from "framer-motion";
import { Container } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import EditTermsAndConditionModel from "./EditTermsAndCondition";

export default function TermsAndCondition() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, termsAndCondition } = state;
  //   console.log(privacyPolicy);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosInstance.get(
        "/api/admin/terms_and_conditions"
      );

      if (data.success) {
        ctxDispatch({ type: "FETCH_TERMS_AND_CONDITION", payload: data.data });
      }
    };
    fetchData();
  }, [token, modalShow]);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container>
        {!modalShow && (
          <div>
            <div className="d-flex mt-2 justify-content-between">
              <div>
                <h5>Terms & Condition Content</h5>
              </div>
              {token&&<div className="card-tools">
                <FaEdit
                  style={{ color: "blue" }}
                  size={20}
                  onClick={() => setModalShow(true)}
                />
              </div>}
            </div>
            <div dangerouslySetInnerHTML={{ __html: termsAndCondition }} />
          </div>
        )}
        {modalShow && (
          <EditTermsAndConditionModel onHide={() => setModalShow(false)} />
        )}
      </Container>
    </motion.div>
  );
}
