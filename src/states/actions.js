import axiosInstance from "../utils/axiosUtil";
import { getError } from "../utils/error";

export const login = async (ctxDispatch, dispatch, credentials) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.post("/api/admin/login", credentials);

    // console.log("data", data);
    if (data.token) {
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));

      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const clearErrors = async (dispatch) => {
  dispatch({ type: "CLEAR_ERROR" });
};

export const codify = async (dispatch, schemaList) => {
  // console.log({ schemaList });
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const res = await axiosInstance.post("/api/schema/codify", schemaList);

    if (res.status === 201) {
      // console.log({ res });
      setTimeout(async () => {
        const { data } = await axiosInstance.get("/api/schema/get-zip", {
          responseType: "blob",
          headers: { Accept: "application/zip" },
        });

        // console.log({ data });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      }, 5000);
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(res) });
    }
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const getDashboardData = async (ctxDispatch, dispatch, token) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get("/api/admin/getDashboardData", {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "DASHBOARD_DATA_FETCH_SUCCESSFULLY",
        payload: data.data,
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getAllUsers = async (
  ctxDispatch,
  dispatch,
  token,
  resultPerPage,
  currentPage,
  searchInput
) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      `/api/admin/getAllUsers?key=${searchInput}&currentPage=${currentPage}&resultPerPage=${resultPerPage}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "USERS_DATA_FETCH_SUCCESSFULLY",
        payload: { users: data.users, length: data.length },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getUser = async (ctxDispatch, dispatch, token, id) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(`/api/admin/getUser/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "USER_DATA_FETCH_SUCCESSFULLY",
        payload: { user: data.user },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getAllStories = async (
  ctxDispatch,
  dispatch,
  token,
  resultPerPage,
  currentPage,
  searchInput
) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      `/api/admin/getAllStoryRooms?key=${searchInput}&currentPage=${currentPage}&resultPerPage=${resultPerPage}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "STORIES_DATA_FETCH_SUCCESSFULLY",
        payload: { stories: data.stories, length: data.length },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getStory = async (ctxDispatch, dispatch, token, id) => {
  try {
    // console.log("in this route");
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(`/api/admin/getStory/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "STORY_DATA_FETCH_SUCCESSFULLY",
        payload: { story: data.story },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getAllGenres = async (
  ctxDispatch,
  dispatch,
  token,
  resultPerPage,
  currentPage,
  searchInput
) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      `/api/admin/getAllGenres?key=${searchInput}&currentPage=${currentPage}&resultPerPage=${resultPerPage}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "GENRES_DATA_FETCH_SUCCESSFULLY",
        payload: { genres: data.genres, length: data.length },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getGenre = async (ctxDispatch, dispatch, token, id) => {
  try {
    // console.log("in this route");
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(`/api/admin/getGenre/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "GENRE_DATA_FETCH_SUCCESSFULLY",
        payload: { genre: data.genre },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getAllBanners = async (
  ctxDispatch,
  dispatch,
  token,
  resultPerPage,
  currentPage,
  searchInput
) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      `/api/banner/get-banners?key=${searchInput}&currentPage=${currentPage}&resultPerPage=${resultPerPage}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "BANNERS_DATA_FETCH_SUCCESSFULLY",
        payload: { banners: data.banners, length: data.length },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};

export const getBanner = async (ctxDispatch, dispatch, token, id) => {
  try {
    // console.log("in this route");
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(`/api/banner/get-banner/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    // console.log(data);
    if (data.success) {
      ctxDispatch({
        type: "BANNER_DATA_FETCH_SUCCESSFULLY",
        payload: { banner: data.banner },
      });
      dispatch({ type: "FETCH_SUCCESS" });
    } else {
      dispatch({ type: "FETCH_FAIL", payload: getError(data) });
    }
  } catch (err) {
    dispatch({ type: "FETCH_FAIL", payload: getError(err) });
  }
};