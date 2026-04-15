import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import './Progress.css';

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_hours_studied: 0,
    total_sessions_completed: 0,
    average_progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch progress data
      const progressResponse = await axios.get(
        'http://localhost:5000/api/progress',
        config
      );
      setProgressData(progressResponse.data);

      // Fetch analytics
      const analyticsResponse = await axios.get(
        'http://localhost:5000/api/progress/analytics/overview',
        config
      );
      setAnalytics(analyticsResponse.data);

      setError('');
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="progress-container"><p>Loading...</p></div>;
  }

  return (
    <div className="progress-container">
      <h1>📊 Progress Analytics</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="analytics-cards">
        <div className="card">
          <h2>Total Hours Studied</h2>
          <p>{analytics.total_hours_studied || 0}h</p>
        </div>
        <div className="card">
          <h2>Sessions Completed</h2>
          <p>{analytics.total_sessions_completed || 0}</p>
        </div>
        <div className="card">
          <h2>Average Progress</h2>
          <p>{analytics.average_progress || 0}%</p>
        </div>
      </div>

      {progressData.length > 0 ? (
        <>
          <div className="progress-chart">
            <h2>Weekly Study Hours</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hours_studied" stroke="#8884d8" name="Hours Studied" />
                <Line type="monotone" dataKey="target_hours" stroke="#82ca9d" name="Target Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="progress-chart">
            <h2>Sessions Completed by Week</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions_completed" fill="#8884d8" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="progress-chart">
            <h2>Detailed Progress Records</h2>
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Hours Studied</th>
                  <th>Sessions</th>
                  <th>Target Hours</th>
                  <th>Achievement %</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((record, index) => (
                  <tr key={index}>
                    <td>Week {record.week}</td>
                    <td>{record.hours_studied}h</td>
                    <td>{record.sessions_completed}</td>
                    <td>{record.target_hours}h</td>
                    <td>
                      {record.target_hours > 0
                        ? ((record.hours_studied / record.target_hours) * 100).toFixed(0)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No progress data available yet. Start creating study sessions to see your progress!</p>
      )}
    </div>
  );
};

export default Progress;
