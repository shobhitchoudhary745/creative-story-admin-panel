import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditTermsAndConditionModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, termsAndCondition } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [content, setContent] = useState("");
  useEffect(() => {
    setContent(termsAndCondition);
  }, [termsAndCondition]);

  const resetForm = () => {
    setContent("");
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image", "video"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
      ["paragraph"],
      [{ align: [] }],
      [{ font: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "font",
    "align",
    "color",
    "background",
    "header",
    "indent",
    "size",
    "script",
    "clean",
    "code",
    "direction",
  ];
  

  const handleChange = (value) => {
    setContent(value);
    console.log(value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!content) {
      toast.warning("Please fill Some content before edit.");
      return;
    }
    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const { data } = await axiosInstance.put(
        `/api/admin/updateTermsAndCondition`,
        {
          content,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        setLoad(false);
        toast.success("Terms & Condition Content Updated Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          props.onHide();
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 1500);
      } else {
        setLoad(false);
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      setLoad(false);
      //   dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className="m-3">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        style={{ border: "1px solid black" }}
      />
      <div className="m-2 d-flex gap-1 justify-content-end">
        <Button onClick={() => props.onHide()} variant="danger">
          Cancel
        </Button>
        <Button onClick={submitHandler} variant="primary">
          {load ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
}
