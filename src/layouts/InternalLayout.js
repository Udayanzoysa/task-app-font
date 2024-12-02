import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const InternalLayout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");


  const fetchData = async () => {
    try {
      const { data } = await API.get("/protected");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      if (!data.user) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        console.error("Error Response:", err.response.data);
      } else {
        console.error("Error:", err.message);
      }
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default InternalLayout;
