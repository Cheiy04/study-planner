import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    session_id: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/tasks', config);
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post('http://localhost:5000/api/tasks', formData, config);
      setFormData({ session_id: '', title: '', description: '' });
      setShowForm(false);
      setError('');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task.');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`http://localhost:5000/api/tasks/${id}`, 
        { completed: !completed }, 
        config
      );
      setError('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
        setError('');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task.');
      }
    }
  };

  if (loading) return <div className="tasks-page"><p>Loading...</p></div>;

  return (
    <div className="tasks-page">
      <h1>✅ Tasks</h1>
      
      {error && <div className="error-message">{error}</div>}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✕ Cancel' : '+ New Task'}
      </button>

      {showForm && (
        <div className="form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="session_id"
              placeholder="Session ID"
              value={formData.session_id}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
            />
            <button type="submit" className="btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div className="task-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => handleToggle(task.id, task.completed)}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                <h2 style={{ margin: 0 }}>{task.title}</h2>
              </div>
              <p>{task.description || 'No description'}</p>
              <small>Session ID: {task.session_id}</small>
              <button 
                onClick={() => handleDelete(task.id)} 
                className="btn-danger"
                style={{ marginTop: '10px', width: '100%' }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No tasks yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
