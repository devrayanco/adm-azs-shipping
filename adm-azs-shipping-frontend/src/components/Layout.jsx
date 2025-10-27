import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import './Layout.css';

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            <header className="navbar">
                <div className="navbar-brand">AZShip</div>
                <nav className="nav-links">
                    <NavLink to="/fretes">Meus Fretes</NavLink>
                    <NavLink to="/medidas">Formas de Medida</NavLink>
                </nav>
                <div className="nav-actions">
                    <button onClick={handleLogout} className="logout-button">
                        Sair
                    </button>
                </div>
            </header>
            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
};

export default Layout;