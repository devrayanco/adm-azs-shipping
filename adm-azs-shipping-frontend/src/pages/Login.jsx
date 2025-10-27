import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, preencha usuário e senha.');
            return;
        }

        try {
            const success = await login(username, password);

            if (success) {
                navigate('/fretes');
            } else {
                setError('Usuário ou senha inválidos.');
            }
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao tentar fazer login.');
        }
    };

    return (
        <div className="login-page">
            <h2>Login - Gestão de Fretes AZ Ship</h2>
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
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Entrar</button>
                <p>
                    Não tem uma conta? <Link className='link' to="/register">Registre-se aqui</Link>
                </p>
                
            </form>
            <div className='blank-space'>
                <section></section>
            </div>
        </div>
    );
};

export default LoginPage;