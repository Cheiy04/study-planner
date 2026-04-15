import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Schedule.css';

const Schedule = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: '',
    date: '',
    start_time: '',
    end_time: '',
    planned_duration: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:5000/api/schedule', config);
      setSessions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions.');
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
      await axios.post('http://localhost:5000/api/schedule', formData, config);
      setFormData({
        subject_id: '',
        date: '',
        start_time: '',
        end_time: '',
        planned_duration: '',
        notes: ''
      });
      setShowForm(false);
      setError('');
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create session.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:5000/api/schedule/${id}`, config);
        setError('');
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        setError('Failed to delete session.');
      }
    }
  };

  if (loading) return <div className="schedule-page"><p>Loading...</p></div>;

  return (
    <div className="schedule-page">
      <h1>📅 Study Schedule</h1>
      
      {error && <div className="error-message">{error}</div>}

      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✕ Cancel' : '+ New Session'}
      </button>

      {showForm && (
        <div className="form-container">
          <h2>Create New Study Session</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="subject_id"
              placeholder="Subject ID"
              value={formData.subject_id}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="planned_duration"
              placeholder="Planned Duration (hours)"
              value={formData.planned_duration}
              onChange={handleChange}
              required
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
            <button type="submit" className="btn-primary">Create Session</button>
          </form>
        </div>
      )}

      <div className="sessions-list">
        <h2>Upcoming Sessions</h2>
        {sessions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.date || 'N/A'}</td>
                  <td>{session.start_time || 'N/A'} - {session.end_time || 'N/A'}</td>
                  <td>{session.planned_duration || 0}h</td>
                  <td>Subject {session.subject_id}</td>
                  <td>{session.completed ? '✅ Completed' : '⏳ Pending'}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(session.id)} 
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sessions scheduled yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Schedule;
