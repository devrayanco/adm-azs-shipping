import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { 
    getAllMedidas, 
    createMedida, 
    updateMedida, 
    deleteMedida 
} from '../services/medidaService';

const initialState = {
    nome: '',
    unidade: '',
    valorBaseCalculo: ''
};

const MedidasPage = () => {
    const [medidas, setMedidas] = useState([]); 
    const [formData, setFormData] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMedidaId, setCurrentMedidaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMedidas();
    }, []);

    const loadMedidas = async () => {
        setLoading(true);
        try {
            const data = await getAllMedidas();
            setMedidas(data);
        } catch (err) {
            setError('Falha ao carregar formas de medida.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData(initialState);
        setIsEditing(false);
        setCurrentMedidaId(null);
    };

    const handleEdit = (medida) => {
        setFormData({
            nome: medida.nome,
            unidade: medida.unidade,
            valorBaseCalculo: medida.valorBaseCalculo
        });
        setIsEditing(true);
        setCurrentMedidaId(medida.id);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta medida?')) {
            try {
                await deleteMedida(id);
                loadMedidas();
            } catch (err) {
                setError('Falha ao excluir medida. Verifique se ela não está em uso por um frete.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            valorBaseCalculo: parseFloat(formData.valorBaseCalculo)
        };

        if (isNaN(dataToSave.valorBaseCalculo) || dataToSave.valorBaseCalculo <= 0) {
            setError("O valor base deve ser um número maior que zero.");
            return;
        }

        setError('');

        try {
            if (isEditing) {
                await updateMedida(currentMedidaId, dataToSave);
            } else {
                await createMedida(dataToSave);
            }
            loadMedidas();
            resetForm();
        } catch (err) {
            setError('Falha ao salvar a medida. Verifique os dados.');
        }
    };

    return (
        <div className="page-container">
            <form className="form-container" onSubmit={handleSubmit}>
                <h3>{isEditing ? 'Editar Forma de Medida' : 'Nova Forma de Medida'}</h3>
                
                <div className="form-group">
                    <label htmlFor="nome">Nome (Ex: Peso, Distância)</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="unidade">Unidade (Ex: kg, km)</label>
                    <input
                        type="text"
                        id="unidade"
                        name="unidade"
                        value={formData.unidade}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="valorBaseCalculo">Valor Base (Ex: 2.50)</label>
                    <input
                        type="number"
                        id="valorBaseCalculo"
                        name="valorBaseCalculo"
                        value={formData.valorBaseCalculo}
                        onChange={handleChange}
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    {isEditing && (
                        <button type="button" className="button-secondary" onClick={resetForm}>
                            Cancelar Edição
                        </button>
                    )}
                    <Link to="/fretes" className="button-secondary">
                        Cancelar
                    </Link>                    
                    <button type="submit">{isEditing ? 'Atualizar' : 'Criar Medida'}</button>
                </div>
            </form>

            <h2>Minhas Formas de Medida</h2>
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Unidade</th>
                            <th>Valor Base (R$)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medidas.length > 0 ? (
                            medidas.map(medida => (
                                <tr key={medida.id}>
                                    <td>{medida.nome}</td>
                                    <td>{medida.unidade}</td>
                                    <td>{medida.valorBaseCalculo.toFixed(2)}</td>
                                    <td className="table-actions">
                                        <button className="button-edit" onClick={() => handleEdit(medida)}>
                                            Editar
                                        </button>
                                        <button className="button-delete" onClick={() => handleDelete(medida.id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Nenhuma forma de medida cadastrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MedidasPage;