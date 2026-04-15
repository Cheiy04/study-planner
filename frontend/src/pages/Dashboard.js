import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Dashboard.css'; // Assuming you have some CSS for styling

const Dashboard = () => {
    const [progressData, setProgressData] = useState({ totalHours: 0, totalSessions: 0, progressAverage: 0 });
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        // Fetching the analytics overview and recent sessions
        const fetchData = async () => {
            try {
                const response = await fetch('/api/progress-analytics'); // API call to get progress analytics
                const data = await response.json();
                setProgressData(data.progressOverview);
                setSessions(data.recentSessions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Progress Analytics Overview</h1>
            <div className="stats">
                <div className="stat-card">
                    <h2>Total Hours</h2>
                    <p>{progressData.totalHours}</p>
                </div>
                <div className="stat-card">
                    <h2>Total Sessions</h2>
                    <p>{progressData.totalSessions}</p>
                </div>
                <div className="stat-card">
                    <h2>Progress Average</h2>
                    <p>{progressData.progressAverage}</p>
                </div>
            </div>
            <h2>Recent Sessions</h2>
            <LineChart width={600} height={300} data={sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};

export default Dashboard;
