const API_BASE_URL = "http://localhost:5000/api";

const API = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch tasks: ${errorText}`);
    }

    if (!contentType.includes("application/json")) {
      throw new Error("Received non-JSON response.");
    }

    return await response.json();
  },

  getTasks: async (userId = null) => {
    try {
      const url = userId ? `${API_BASE_URL}/tasks?user_id=${userId}` : `${API_BASE_URL}/tasks`;
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tasks: ${errorText}`);
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Received non-JSON response.");
      }

      const tasks = await response.json();
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
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

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task.");
  },

  updateTask: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task.");
    return await response.json();
  },
};

export default API;
