import React, { useContext, useEffect, useReducer, useState } from "react";
import { useTitle } from "../components";
import { Container } from "react-bootstrap";
import { getDashboardData } from "../states/actions";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const dummyArray = [1, 2, 3, 4, 5, 6];
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { dashboardData, token } = state;
  const arr = [
    "bg-info",
    "bg-success",
    "bg-primary",
    "bg-danger",
    "bg-secondary",
    "bg-warning",
  ];
  const redirectArray = [
    "/users",
    "/stories",
    "/genres",
    "/stories",
    "/stories",
    "/stories",
  ];
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  // console.log("ssssssssssssssssssss",loading);
  useTitle("Dashboard");
  useEffect(() => {
    getDashboardData(ctxDispatch, dispatch, token);
  }, [token]);

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        exit={{ x: "100%" }}
      >
        <Container fluid className="p-3">
          <h3>{loading?<Skeleton/>:"Dashboard"}</h3>
          <hr />

          <div
            className={`d-flex ${loading && " items-center"} flex-wrap gap-3`}
          >
            {loading
              ? dummyArray.map((data,index) => {
                return(<div key={index} className="dashboard_cards"><Skeleton height={200} /></div>)
              })
              : dashboardData.map((data, index) => {
                  return (
                    <div
                      onClick={() => {
                        navigate(`/admin${redirectArray[index]}`);
                      }}
                      key={index}
                      className={`dashboard_cards ${arr[index]} card d-flex justify-content-center align-items-center gap-1 flex-column`}
                    >
                      <h2>
                        <CountUp
                          end={data.value}
                          useGrouping={false}
                          duration={"2"}
                          style={{ color: "#f3f3f3" }}
                        />
                      </h2>
                      <h3 style={{ color: "#f3f3f3", fontSize: "16px" }}>
                        {data.key}
                      </h3>
                    </div>
                  );
                })}
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default Dashboard;
