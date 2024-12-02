import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/app");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-4 text-danger">Access Denied</h1>
        <p className="lead">You do not have permission to view this page.</p>
        <button className="btn btn-primary mt-3" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
