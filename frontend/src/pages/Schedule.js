import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Schedule = () => {
    const [sessions, setSessions] = useState([]);
    const [dateTime, setDateTime] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [plannedDuration, setPlannedDuration] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const response = await axios.get('/api/schedule');
        setSessions(response.data);
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        const newSession = { dateTime, subjectId, plannedDuration };
        await axios.post('/api/schedule', newSession);
        fetchSessions(); // Refresh the session list
        setDateTime('');
        setSubjectId('');
        setPlannedDuration('');
    };

    const handleDeleteSession = async (id) => {
        await axios.delete(`/api/schedule/${id}`);
        fetchSessions(); // Refresh the session list
    };

    return (
        <div>
            <h1>Create Study Session</h1>
            <form onSubmit={handleCreateSession}>
                <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Subject ID"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Planned Duration (minutes)"
                    value={plannedDuration}
                    onChange={(e) => setPlannedDuration(e.target.value)}
                    required
                />
                <button type="submit">Create Session</button>
            </form>
            <h2>Study Sessions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date Time</th>
                        <th>Subject ID</th>
                        <th>Planned Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td>{session.dateTime}</td>
                            <td>{session.subjectId}</td>
                            <td>{session.plannedDuration}</td>
                            <td>
                                <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Schedule;
