import React, { Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

const Navbar = React.lazy(() => import('./components/Navbar'));
const BankAccounts = React.lazy(() => import('./components/ViewBanks'));
const AdminLogin = React.lazy(() => import('./components/Admin'));
const AdminHome = React.lazy(() => import('./components/AdminHome'));
const AuthForm = React.lazy(() => import('./components/signup'));
const HomePage = React.lazy(() => import('./components/HomePage'));

const AppRoutes = () => {
    const location = useLocation();

    return (
        <>
           {!(location.pathname === '/admin' || location.pathname === '/adminhome') && (
    <Suspense fallback={<div>Loading Navbar...</div>}>
        <Navbar />
    </Suspense>
)}

            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/adminhome" element={<AdminHome />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/allbanks" element={<BankAccounts />} />
                    <Route path="/signup" element={<AuthForm />} />
                </Routes>
            </Suspense>
        </>
    );
};

const App = () => {
    return (
        <AppRoutes />
    );
};

export default App;
