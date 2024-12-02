import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../services/userAPI.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.getUser(loggedInUserId);
        setUser(response);
        setFormData({
          email: response.email,
          username: response.username,
          full_name: response.full_name,
          role: response.role,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${loggedInUserId}`,
        formData
      );
      setUser(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="text-center my-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>User Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Role:</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />
            <div className="text-center">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={handleEditClick}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>

              {isEditing && (
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
