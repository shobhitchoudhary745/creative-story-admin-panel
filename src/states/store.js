import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  dashboardData: [],
  users: [],
  userLength: 0,
  user: {},
  stories: [],
  storyLength: 0,
  story: {},
  genres: [],
  genreLength: 0,
  genre: {},
  privacyPolicy: "",
  termsAndCondition: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return {
        ...state,
        userInfo: action.payload.user,
        token: action.payload.token,
      };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        token: null,
      };
    case "PROFILE_UPDATE":
      return { ...state, userInfo: action.payload };
    case "DASHBOARD_DATA_FETCH_SUCCESSFULLY":
      return { ...state, dashboardData: action.payload };
    case "USERS_DATA_FETCH_SUCCESSFULLY":
      return {
        ...state,
        users: action.payload.users,
        userLength: action.payload.length,
      };
    case "USER_DATA_FETCH_SUCCESSFULLY":
      return { ...state, user: action.payload.user };
    case "STORIES_DATA_FETCH_SUCCESSFULLY":
      return {
        ...state,
        stories: action.payload.stories,
        storyLength: action.payload.length,
      };
    case "STORY_DATA_FETCH_SUCCESSFULLY":
      return {
        ...state,
        story: action.payload.story,
      };
      case "GENRES_DATA_FETCH_SUCCESSFULLY":
        return {
          ...state,
          genres: action.payload.genres,
          genreLengthLength: action.payload.length,
        };
      case "GENRE_DATA_FETCH_SUCCESSFULLY":
        return {
          ...state,
          genre: action.payload.genre,
        };
    case "FETCH_PRIVACY_POLICY":
      return {
        ...state,
        privacyPolicy: action.payload,
      };
    case "FETCH_TERMS_AND_CONDITION":
      return {
        ...state,
        termsAndCondition: action.payload,
      };
    default:
      return state;
  }
}

export default function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
