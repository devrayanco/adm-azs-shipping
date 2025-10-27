import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !email || !password) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        try {
            const data = await registerUser(username, email, password);
            setSuccess(data + " Você será redirecionado para o login."); 
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message); 
        }
    };

    return (
        <div className="register-page">
            <h2>Registro - Gestão de Fretes AZ Ship</h2>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Usuário</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                {success && <p style={{ color: '#70e0a0' }}>{success}</p>}
                
                <button type="submit" disabled={!!success}>
                    {success ? 'Registrado!' : 'Registrar'}
                </button>
                <p>
                    Já tem uma conta? <Link className='link' to="/login">Faça login aqui</Link>
                </p>
                
            </form>
            <div className='blank-space'>

            </div>
        </div>
    );
};

export default RegisterPage;