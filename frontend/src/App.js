import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Progress from './pages/Progress';
import Navigation from './components/Navigation';
import authService from './services/authService';
import './App.css';
import './pages/Auth.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      authService.setAuthHeader();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navigation />}
        <div className="app-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Register setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/schedule" 
              element={isAuthenticated ? <Schedule /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks" 
              element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/progress" 
              element={isAuthenticated ? <Progress /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
