import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../states/store";
import jwt_decode from "jwt-decode";

export default function AdminProtectedRoute({ children }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      if(!token){
        navigate("/")
      }
      if (token &&jwt_decode(token)?.exp < Date.now() / 1000) {
        ctxDispatch({ type: "USER_SIGNOUT" });
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    checkToken();
  }, [token]);

  return token&&children;
}
