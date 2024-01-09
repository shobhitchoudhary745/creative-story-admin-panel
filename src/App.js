import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Store } from "./states/store";

import { AdminProtectedRoute } from "./routes";
import { Header, Footer, SideNavBar, NotFound } from "./components";
import { AdminLoginScreen, Dashboard } from "./pages";
import Users from "./pages/users/Users";
import Genres from "./pages/genres/Genres";
import Stories from "./pages/stories/Stories";
import ViewUser from "./pages/users/ViewUser";
import ViewProfile from "./pages/profile/ViewProfile";
import ViewStories from "./pages/stories/ViewStories";
import PrivacyPolicy from "./pages/privacypolicy/PrivacyPolicy";
import TermsAndCondition from "./pages/termsandcondition/TermsAndCondition";
import ViewGenre from "./pages/genres/ViewGenre";
import AddGenre from "./pages/genres/AddGenre";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  // console.log({ isExpanded, token });
  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      {token && (
        <div className="sidebar-wrapper">
          <SideNavBar isExpanded={isExpanded} />
        </div>
      )}
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} 
        ${token ? "" : "m-0"} d-flex flex-column`}
      >
        {token && <Header sidebarHandler={sidebarHandler} />}
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/genres"
            element={
              <AdminProtectedRoute>
                <Genres />
              </AdminProtectedRoute>
            }
          />
           <Route
            exact path="/admin/genre/add"
            element={
              <AdminProtectedRoute>
                <AddGenre />
              </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/stories"
            element={
              <AdminProtectedRoute>
                <Stories />
              </AdminProtectedRoute>
            }
          />
          <Route path="/" element={<AdminLoginScreen />} />
          <Route
            exact
            path="/admin/view-profile"
            element={
              <AdminProtectedRoute>
                <ViewProfile />
              </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/view/user/:id"
            element={
              <AdminProtectedRoute>
                <ViewUser />
              </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/view/story/:id"
            element={
              <AdminProtectedRoute>
                <ViewStories />
              </AdminProtectedRoute>
            }
          />
          <Route
            exact
            path="/admin/view/genre/:id"
            element={
              <AdminProtectedRoute>
                <ViewGenre />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/privacy-policy"
            element={
              <AdminProtectedRoute>
                <PrivacyPolicy />
              </AdminProtectedRoute>
            }
          ></Route>
          <Route
            path="/admin/terms-and-condition"
            element={
              <AdminProtectedRoute>
                <TermsAndCondition />
              </AdminProtectedRoute>
            }
          ></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
