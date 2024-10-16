
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/adminLogin.css'; 
import toast ,{Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch('https://bank-info-backend.vercel.app/api/loginadmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Invalid email or password');
            }
    
            const data = await response.json();
            console.log('Login successful:', data);
            toast.success('Login successful!');
            navigate('/adminhome');
    
        } catch (err) {
            toast.error('Invalid email or password');
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <Toaster />
        </div>
    );
};

export default AdminLogin;
