import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="main-layout">
            <header className="main-header">
                <h2>AZ Ship</h2>
                <nav className="main-nav">
                    <Link to="/fretes">Meus Fretes</Link>
                    <Link to="/medidas">Formas de Medida</Link>
                </nav>
                <button onClick={handleLogout} className="logout-button">
                    Sair
                </button>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;