import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import axios from 'axios';

const signupSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true); 
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema), 
  });

  const router = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (isSignup) {

      const result = await axios.post('https://bank-info-backend.vercel.app/api/register', data, { withCredentials: true });
      localStorage.setItem('token', result.data.token);
      console.log(result.data)
    } else {
      const result = await axios.post('https://bank-info-backend.vercel.app/api/login', data, { withCredentials: true });
      localStorage.setItem('token', result.data.token);
      console.log(result.data);
    }
    router('/');
    reset();
  };

  const onError = () => {
    toast.error('Invalid input');
  };

  return (
    <div className="auth-container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="auth-box">
        <h2 className="auth-title">{isSignup ? 'Sign up' : 'Login'}</h2>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          {isSignup && (
            <div className="form-group">
              <label htmlFor="username" className="label">Username</label>
              <input
                type="text"
                id="username"
                {...register('username')}
                className={`input-field ${errors.username ? 'input-error' : ''}`}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="label">Email address</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'input-error' : ''}`}
            />
          </div>

          <div className="form-group password-container">
            <label htmlFor="password" className="label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              className={`input-field ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password"
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            {isSignup ? 'Signup' : 'Login'}
          </button>

          <div className="auth-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? 'Login' : 'Signup'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
