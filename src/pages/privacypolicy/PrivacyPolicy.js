import React, { useContext, useEffect, useReducer, useState } from "react";
import { reducer } from "../../states/reducers";
import axiosInstance from "../../utils/axiosUtil";
import { Store } from "../../states/store";
import { motion } from "framer-motion";
import { Container } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import EditPrivacyPolicyModel from "./EditPrivacyPolicy";

export default function PrivacyPolicy() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, privacyPolicy } = state;
  //   console.log(privacyPolicy);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axiosInstance.get("/api/admin/privacy_policy");

      if (data.success) {
        ctxDispatch({ type: "FETCH_PRIVACY_POLICY", payload: data.data });
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
        {!modalShow&&<div>
          <div className="d-flex mt-2 justify-content-between">
            <div>
              <h5>Privacy Policy Content</h5>
            </div>
            <div className="card-tools">
              <FaEdit
                style={{ color: "blue" }}
                size={20}
                onClick={() => setModalShow(true)}
              />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        </div>}
        {modalShow&&<EditPrivacyPolicyModel
          onHide={() => setModalShow(false)}
        />}
      </Container>
    </motion.div>
  );
}
