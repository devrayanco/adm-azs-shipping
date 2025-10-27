import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout.jsx';

import LoginPage from '../pages/Login.jsx';
import FreteListPage from '../pages/FreteListPage.jsx';
import MedidasPage from '../pages/MedidasPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import MainLayout from '../components/MainLayout.jsx';
import FreteFormPage from '../pages/FreteFormPage.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/fretes" replace />} />
                    <Route path="/fretes" element={<FreteListPage />} />
                    <Route path="/fretes/novo" element={<FreteFormPage />} />
                    <Route path="/fretes/:id" element={<FreteFormPage />} />
                    <Route path="/medidas" element={<MedidasPage />} />
                </Route>
            </Route>

            <Route path="*" element={<h2>Página não encontrada (404)</h2>} />
        </Routes>
    );
};

export default AppRoutes;