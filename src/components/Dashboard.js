import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/taskAPI";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner";
import { StoreContext } from "../provider/contextProvider";

const Dashboard = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const loggedInUserId = loggedInUser?.id;

  const [message, setMessage] = useState("Waiting for message...");
  const { getValue, setValue } = useContext(StoreContext);

  const isrefetch = getValue("refetch-dashboard-page");

  console.log(isrefetch);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await API.getTasks(
        currentUserRole === "admin" ? null : loggedInUserId
      );
      setTasks(response);
      setValue({
        path: "refetch-dashboard-page",
        data: false,
      });
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddTask = async (e) => {
    const assignedUserId =
      userId || (currentUserRole === "admin" ? "" : loggedInUser.id);
    e.preventDefault();
    if (task) {
      try {
        const newTask = await API.addTask({
          task_name: task,
          status: "in_progress",
          user_id: assignedUserId,
        });
        setTasks([...tasks, newTask]);
        setTask("");
      } catch (err) {
        console.error("Error adding task:", err);
        setError("Failed to add task.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  };

  const handleFinish = async (id) => {
    try {
      const updatedTask = await API.updateTask(id, { status: "completed" });
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.updateTask(id, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (id) => {
    const response = await API.deleteTask(id);
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    if (loggedInUser) {
      setCurrentUserRole(loggedInUser.role);
    }
  }, []);

  useEffect(() => {
    if (isrefetch) fetchTasks();
  }, [isrefetch]);

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-10">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">Task Manager</h4>
                <form
                  className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2"
                  onSubmit={handleAddTask}
                >
                  <div className="col-12">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="form1"
                        className="form-control"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                      <label className="form-label" htmlFor="form1">
                        Enter a task here
                      </label>
                    </div>
                  </div>

                  {currentUserRole === "admin" && (
                    <div className="col-12">
                      <div className="form-outline">
                        <select
                          id="userSelect"
                          className="form-select"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        >
                          <option value="">Select User</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Save Task
                    </button>
                  </div>
                </form>
                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Todo item</th>
                      <th scope="col">Status</th>
                      <th scope="col">Assigned User</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <th scope="row">{task.id}</th>
                        <td>{task.task_name}</td>
                        <td>{task.status}</td>
                        <td>{task.User ? task.User.username : "Unassigned"}</td>
                        <td>
                          {task.status === "in_progress" && (
                            <button
                              type="button"
                              className="btn btn-warning ms-1"
                              onClick={() =>
                                handleStatusChange(task.id, "completed")
                              }
                            >
                              Finish
                            </button>
                          )}
                          {task.status === "pending" && (
                            <button
                              type="button"
                              className="btn btn-primary ms-1"
                              onClick={() =>
                                handleStatusChange(task.id, "in_progress")
                              }
                            >
                              In Progress
                            </button>
                          )}
                          {task.status === "completed" && (
                            <button
                              type="button"
                              className="btn btn-secondary ms-1"
                              onClick={() =>
                                handleStatusChange(task.id, "pending")
                              }
                            >
                              Pending
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-danger mx-2"
                            onClick={() => handleDelete(task.id)}
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

export default Dashboard;
