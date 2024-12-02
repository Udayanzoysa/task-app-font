import { useRoutes, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ExternalLayout from "../layouts/ExternalLayout";
import InternalLayout from "../layouts/InternalLayout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import UserList from "../components/UserList";
import Unauthorized from "../components/Unauthorized";
import Profile from "../components/Profile";
import Register from "../components/Register";

const RouterConfigs = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);
  const ProtectedRoute = ({ element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return element;
  };

  const ProtectedAdminRoute = ({ element, userRole }) => {
    if (userRole !== "admin") {
      console.log(userRole);
      return <Navigate to="/app/unauthorized" />;
    }
    return element;
  };

  //ViewOfficerPage
  const element = useRoutes([
    {
      path: "/",
      element: <ExternalLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/app",
      element: <InternalLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "user-list",
          element: (
            <ProtectedAdminRoute
              element={<UserList />}
              userRole={user.role ?? ""}
            />
          ),
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return element;
};

export default RouterConfigs;
