import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import './Progress.css'; // Make sure to create this CSS file for styles

const Progress = () => {
    const [progressData, setProgressData] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [averageProgress, setAverageProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/progress-data'); // Replace with your API endpoint
                setProgressData(response.data);
                calculateMetrics(response.data);
            } catch (error) {
                console.error('Error fetching progress data:', error);
            }
        };

        fetchData();
    }, []);

    const calculateMetrics = (data) => {
        const totalHrs = data.reduce((acc, week) => acc + week.hours, 0);
        const totalSes = data.reduce((acc, week) => acc + week.sessions, 0);
        const avgProg = data.reduce((acc, week) => acc + week.progress, 0) / data.length;

        setTotalHours(totalHrs);
        setTotalSessions(totalSes);
        setAverageProgress(avgProg);
    };

    return (
        <div className="progress-container">
            <h1>Progress Analytics</h1>
            <div className="analytics-cards">
                <div className="card">
                    <h2>Total Hours</h2>
                    <p>{totalHours}</p>
                </div>
                <div className="card">
                    <h2>Total Sessions</h2>
                    <p>{totalSessions}</p>
                </div>
                <div className="card">
                    <h2>Average Progress</h2>
                    <p>{averageProgress.toFixed(2)}%</p>
                </div>
            </div>
            <h2>Weekly Progress Graphs</h2>
            <LineChart width={600} height={300} data={progressData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            <BarChart width={600} height={300} data={progressData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#82ca9d" />
                <Bar dataKey="hours" fill="#ffc658" />
            </BarChart>
            <h2>Weekly Progress Table</h2>
            <table className="progress-table">
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Hours</th>
                        <th>Sessions</th>
                        <th>Target Achievement (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {progressData.map((weekData) => (
                        <tr key={weekData.week}>
                            <td>{weekData.week}</td>
                            <td>{weekData.hours}</td>
                            <td>{weekData.sessions}</td>
                            <td>{weekData.targetAchievement}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Progress;
