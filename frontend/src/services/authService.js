const authService = {
    login: function(username, password) {
        // API call to log the user in
        return fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        }).then(response => response.json());
    },
    register: function(username, password) {
        // API call to register the user
        return fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        }).then(response => response.json());
    },
    logout: function() {
        // Logic to log the user out
        localStorage.removeItem('token');
    },
    getToken: function() {
        // Get the token from local storage
        return localStorage.getItem('token');
    },
    getUser: function() {
        // Decode the token to get user information
        const token = this.getToken();
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    },
    isAuthenticated: function() {
        // Check if user is authenticated
        return !!this.getToken();
    }
};

export default authService;
