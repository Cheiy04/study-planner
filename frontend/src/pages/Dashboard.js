import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [progressData, setProgressData] = useState({
    total_hours_studied: 0,
    total_sessions_completed: 0,
    average_progress: 0
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch analytics overview
      const analyticsResponse = await axios.get(
        'http://localhost:5000/api/progress/analytics/overview',
        config
      );
      setProgressData(analyticsResponse.data);

      // Fetch recent sessions
      const sessionsResponse = await axios.get(
        'http://localhost:5000/api/schedule',
        config
      );
      setSessions(sessionsResponse.data.slice(0, 5));
      
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        <div className="stat-card">
          <h2>Total Hours Studied</h2>
          <p>{progressData.total_hours_studied || 0}h</p>
        </div>
        <div className="stat-card">
          <h2>Study Sessions</h2>
          <p>{progressData.total_sessions_completed || 0}</p>
        </div>
        <div className="stat-card">
          <h2>Average Progress</h2>
          <p>{progressData.average_progress || 0}%</p>
        </div>
      </div>

      <div className="chart-section">
        <h2>Recent Study Sessions</h2>
        {sessions.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned_duration" stroke="#8884d8" name="Planned Duration" />
                <Line type="monotone" dataKey="actual_duration" stroke="#82ca9d" name="Actual Duration" />
              </LineChart>
            </ResponsiveContainer>
            
            <h3 style={{ marginTop: '30px' }}>Sessions Table</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.date || 'N/A'}</td>
                    <td>{session.start_time || 'N/A'} - {session.end_time || 'N/A'}</td>
                    <td>{session.planned_duration || 0}h</td>
                    <td>{session.completed ? '✅ Completed' : '⏳ Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No sessions yet. Start creating study sessions to see data here!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
