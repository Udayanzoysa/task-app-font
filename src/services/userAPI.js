const API_BASE_URL = "http://localhost:5000/api";

const API = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users: ${errorText}`);
    }

    if (!contentType.includes("application/json")) {
      throw new Error("Received non-JSON response.");
    }

    return await response.json();
  },

  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user: ${errorText}`);
    }

    if (!contentType.includes("application/json")) {
      throw new Error("Received non-JSON response.");
    }

    return await response.json();
  },

  addTask: async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to add task.");
    return await response.json();
  },

  addUser: async (user) => {
    console.log(user);
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to add user.");
    return await response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task.");
  },

  updateUser: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task.");
    return await response.json();
  },
};

export default API;
