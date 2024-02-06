import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { getAllBanners } from "../../states/actions";
import { reducer } from "../../states/reducers";
// import { ColorRing } from "react-loader-spinner";
import { Store } from "../../states/store";
import { CustomPagination, CustomSkeleton, MessageBox } from "../../components";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../../utils/error";
import axiosInstance from "../../utils/axiosUtil";

export default function Banners() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { banners, token, bannerLength } = state;
  const [curPage, setCurPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [resultPerPage, setResultPerPage] = useState(5);
  const curPageHandler = (p) => setCurPage(p);
  const filteredCategoryCount = bannerLength;
  const numOfPages = Math.ceil(filteredCategoryCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  const [del, setDel] = useState(false);
  // console.log("testing", genres);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  useEffect(() => {
    getAllBanners(
      ctxDispatch,
      dispatch,
      token,
      resultPerPage,
      curPage,
      searchInput
    );
  }, [curPage, resultPerPage, token, del, query]);

  const deleteGenre = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Banner?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(
          `/api/banner/delete-banner/${id}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        toast.success("Banner Deleted Succesfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });

        if ((bannerLength - 1) % resultPerPage === 0 && curPage != 1) {
          setCurPage((p) => p - 1);
        }
        setDel(false);
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <Button
                onClick={() => {
                  navigate(`/admin/banner/add`);
                }}
                type="success"
                className="btn btn-primary btn-block mt-1"
              >
                Add Banner
              </Button>
              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Client Name"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery(searchInput);
                      setCurPage(1);
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                style={{ height: "500px", overflowY: "scroll" }}
                responsive
                striped
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Banner</th>
                    <th>Client Name</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={5} column={5} />
                  ) : (
                    banners.length > 0 &&
                    banners.map((banner, i) => (
                      <tr key={i} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td style={{textAlign:"center"}}>
                          <img
                            style={{
                              width: "140px",
                              height: "120px",
                              cursor:"pointer",
                              borderRadius:"10px"
                            }}
                            src={banner.bannerUrl}
                          />
                        </td>
                        <td>{banner.clientName}</td>
                        <td>{banner.navigationUrl}</td>

                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/banner/${banner._id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteGenre(banner._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Row No.</p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredCategoryCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
