import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Progress from './pages/Progress';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />} />
                <Route path="/schedule" element={isAuthenticated ? <Schedule /> : <Navigate to='/login' />} />
                <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to='/login' />} />
                <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to='/login' />} />
                <Route path="/" element={<Navigate to='/login' />} />
            </Routes>
        </Router>
    );
}

export default App;
