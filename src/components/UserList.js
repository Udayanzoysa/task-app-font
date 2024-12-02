import React, { useEffect, useState } from "react";
import API from "../services/userAPI.js";
import axios from "axios";

const UserList = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (username && email) {
      const newUser = {
        username,
        email,
        role,
        password: "123456",
        full_name: "Defult User",
      };

      try {
        const addedUser = await API.addUser(newUser);
        setUsers([...users, addedUser]);
        setUsername("");
        setEmail("");
        setRole("user");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateRole = async (id) => {
    try {
      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          const newRole = user.role === "admin" ? "user" : "admin";
          return { ...user, role: newRole };
        }
        return user;
      });
      setUsers(updatedUsers);
      const updatedUser = await API.updateUser(id, {
        role: updatedUsers.find((user) => user.id === id).role,
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-10">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">User Management</h4>

                <form
                  className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2"
                  onSubmit={handleAddUser}
                >
                  <div className="col-12">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <label className="form-label" htmlFor="username">
                        Enter Username
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-outline">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label className="form-label" htmlFor="email">
                        Enter Email
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Add User
                    </button>
                  </div>
                </form>

                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <th scope="row">{user.id}</th>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-warning me-2"
                            onClick={() => handleUpdateRole(user.id)}
                          >
                            {user.role === "admin" ? "Demote" : "Promote"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserList;
