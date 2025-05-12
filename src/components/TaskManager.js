import React, { useEffect, useState } from "react";

function TaskManager() {
  const [tasks, setTasks] = useState([]); // Array of tasks
  const [error, setError] = useState(null); // Error state
  const [taskById, setTaskById] = useState(null); // Fetched task by ID
  const [taskId, setTaskId] = useState(""); // Task ID input
  const [updateTask, setUpdateTask] = useState({
    title: "",
    description: "",
    status: "",
    category: "",
  }); // Update task form state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Modal visibility state

  // Fetch all tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:2030/api/tasks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data); // Set tasks array
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  // Handle task ID input change
  const handleTaskIdChange = (e) => {
    setTaskId(e.target.value);
  };

  // Fetch task by ID
  const fetchTaskById = async () => {
    try {
      const response = await fetch(`http://localhost:2030/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTaskById(data); // Set fetched task
      setUpdateTask(data); // Pre-fill update form
    } catch (err) {
      console.error("Error fetching task by ID:", err.message);
      setError(err.message);
    }
  };

  // Handle update form input change
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateTask({ ...updateTask, [name]: value });
  };

  // Update task by ID
  const updateTaskById = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:2030/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      ); // Update task in list
      setTaskById(updatedTask); // Update displayed task
      setIsUpdateModalOpen(false); // Close modal
    } catch (err) {
      console.error("Error updating task:", err.message);
      setError(err.message);
    }
  };

  // Delete task by ID
  const deleteTaskById = async () => {
    try {
      const response = await fetch(`http://localhost:2030/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskById.id)); // Remove task from list
      setTaskById(null); // Clear the fetched task
    } catch (err) {
      console.error("Error deleting task:", err.message);
      setError(err.message);
    }
  };

  // Clear taskById and show all tasks
  const clearTaskById = () => {
    setTaskById(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Task Manager</h2>

      {/* Input and Button to Fetch Task by ID */}
      <div style={styles.getTaskContainer}>
        <input
          type="text"
          placeholder="Enter Task ID"
          value={taskId}
          onChange={handleTaskIdChange}
          style={styles.input}
        />
        <button onClick={fetchTaskById} style={styles.button}>
          Get Task by ID
        </button>
        {taskById && (
          <button onClick={clearTaskById} style={styles.clearButton}>
            Show All Tasks
          </button>
        )}
      </div>

      {/* Display Task by ID with Update and Delete Options */}
      {taskById ? (
        <div style={styles.card}>
          <h3>{taskById.title}</h3>
          <p>
            <strong>Description:</strong> {taskById.description}
          </p>
          <p>
            <strong>Status:</strong> {taskById.status}
          </p>
          <p>
            <strong>Category:</strong> {taskById.category}
          </p>
          <div style={styles.actionButtons}>
            <button
              style={styles.button}
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Update
            </button>
            <button style={styles.deleteButton} onClick={deleteTaskById}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        /* Display All Tasks */
        tasks.map((task) => (
          <div key={task.id} style={styles.card}>
            <h3>{task.title}</h3>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Category:</strong> {task.category}
            </p>
          </div>
        ))
      )}

      {/* Modal for Updating a Task */}
      {isUpdateModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Update Task</h3>
            <form style={styles.form} onSubmit={updateTaskById}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={updateTask.title}
                onChange={handleUpdateInputChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={updateTask.description}
                onChange={handleUpdateInputChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="status"
                placeholder="Status"
                value={updateTask.status}
                onChange={handleUpdateInputChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={updateTask.category}
                onChange={handleUpdateInputChange}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Update
              </button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
  },
  getTaskContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    marginRight: "10px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#FF4D4D",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  clearButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#FF4D4D",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "400px",
    margin: "20px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default TaskManager;