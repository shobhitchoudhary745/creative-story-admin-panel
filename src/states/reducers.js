export const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, success: false };
    case "FETCH_SUCCESS":
      // console.log("success", action.payload)
      return { ...state, loading: false, success: true, zip: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload, success: false };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};
