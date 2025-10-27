import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFreteById, createFrete, updateFrete } from '../services/freteService';
import { getAllMedidas } from '../services/medidaService';

const initialItemForm = { valorInformado: '' };
const initialVolumeForm = { altura: '', largura: '', comprimento: '' };

const formatLocalDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const FreteFormPage = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [freteForm, setFreteForm] = useState({
        descricao: '',
        dataEntrega: '',
        observacoes: ''
    });

    const [medidasDisponiveis, setMedidasDisponiveis] = useState([]);

    const [itens, setItens] = useState([]);

    const [selectedMedida, setSelectedMedida] = useState(null);
    const [itemForm, setItemForm] = useState(initialItemForm);
    const [volumeForm, setVolumeForm] = useState(initialVolumeForm);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const medidas = await getAllMedidas();
                setMedidasDisponiveis(medidas);
                if (isEditing) {
                    const freteData = await getFreteById(id);
                    setFreteForm({
                        descricao: freteData.descricao,
                        dataEntrega: formatLocalDate(freteData.dataEntrega),
                        observacoes: freteData.observacoes
                    });

                    const loadedItens = freteData.itens.map(itemResp => {
                        const medidaMatch = medidas.find(m => m.nome === itemResp.nomeMedida);
                        return {
                            formaDeMedidaId: medidaMatch ? medidaMatch.id : null,
                            valorInformado: itemResp.valorInformado,
                            nome: itemResp.nomeMedida,
                            unidade: itemResp.unidadeMedida,
                            valorCalculado: itemResp.valorCalculadoItem
                        };
                    });
                    setItens(loadedItens);
                }
            } catch (err) {
                setError('Falha ao carregar dados. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [id, isEditing]); 

    const handleFreteChange = (e) => {
        const { name, value } = e.target;
        setFreteForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (itens.length === 0) {
            setError('Adicione pelo menos um item de medida ao frete.');
            return;
        }

        const payload = {
            ...freteForm,
            itens: itens.map(item => ({
                formaDeMedidaId: item.formaDeMedidaId,
                valorInformado: item.valorInformado
            }))
        };

        try {
            setLoading(true);
            if (isEditing) {
                await updateFrete(id, payload);
            } else {
                await createFrete(payload);
            }
            navigate('/fretes');
        } catch (err) {
            setError('Falha ao salvar o frete. Verifique os dados.');
            setLoading(false);
        }
    };

    const handleMedidaSelect = (e) => {
        const medidaId = e.target.value;
        const medida = medidasDisponiveis.find(m => m.id == medidaId) || null;
        setSelectedMedida(medida);
        setItemForm(initialItemForm);
        setVolumeForm(initialVolumeForm);
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setItemForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVolumeChange = (e) => {
        const { name, value } = e.target;
        setVolumeForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = () => {
        if (!selectedMedida) {
            alert('Por favor, selecione uma forma de medida.');
            return;
        }

        let valorFinal = 0;
        let isVolume = selectedMedida.nome.toLowerCase().includes('volume');

        if (isVolume) {
            const { altura, largura, comprimento } = volumeForm;
            valorFinal = parseFloat(altura) * parseFloat(largura) * parseFloat(comprimento);
        } else {
            valorFinal = parseFloat(itemForm.valorInformado);
        }

        if (isNaN(valorFinal) || valorFinal <= 0) {
            alert('Os valores informados devem ser números positivos.');
            return;
        }

        const newItem = {
            formaDeMedidaId: selectedMedida.id,
            valorInformado: valorFinal,
            nome: selectedMedida.nome,
            unidade: selectedMedida.unidade,
            valorCalculado: valorFinal * selectedMedida.valorBaseCalculo
        };

        setItens(prevItens => [...prevItens, newItem]);

        setSelectedMedida(null);
        setItemForm(initialItemForm);
        setVolumeForm(initialVolumeForm);
    };

    const handleRemoveItem = (indexToRemove) => {
        setItens(prevItens => prevItens.filter((_, index) => index !== indexToRemove));
    };

    const valorTotalCalculado = useMemo(() => {
        return itens.reduce((total, item) => total + item.valorCalculado, 0);
    }, [itens]);

    if (loading && !isEditing) {
        return <p>Carregando...</p>;
    }
    
    const isVolumeSelected = selectedMedida?.nome.toLowerCase().includes('volume');

    return (
        <form className="page-container" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Editar Frete' : 'Criar Novo Frete'}</h2>
            
            <div className="frete-form-layout">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div className="form-container" style={{ margin: 0 }}>
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição</label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                value={freteForm.descricao}
                                onChange={handleFreteChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataEntrega">Data da Entrega</label>
                            <input
                                type="date"
                                id="dataEntrega"
                                name="dataEntrega"
                                value={freteForm.dataEntrega}
                                onChange={handleFreteChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="observacoes">Observações</label>
                            <textarea
                                id="observacoes"
                                name="observacoes"
                                value={freteForm.observacoes}
                                onChange={handleFreteChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="item-list-container">
                        <h4>Itens do Frete</h4>
                        {itens.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#aaa' }}>Nenhum item adicionado.</p>
                        ) : (
                            itens.map((item, index) => (
                                <div key={index} className="item-list-item">
                                    <div>
                                        <span className="item-name">{item.nome}</span>
                                        <span className="item-details">
                                            {item.valorInformado.toFixed(2)} {item.unidade}
                                        </span>
                                    </div>
                                    <div style={{ alignItems: 'flex-end' }}>
                                        <span className="item-subtotal">{formatCurrency(item.valorCalculado)}</span>
                                        <button 
                                            type="button" 
                                            className="button-delete" 
                                            style={{ padding: '0.2em 0.5em', fontSize: '0.8em'}}
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="item-form-container">
                    <h4>Adicionar Item de Medida</h4>

                    <div className="form-group">
                        <label htmlFor="medida">Selecione a Medida</label>
                        <select id="medida" value={selectedMedida?.id || ''} onChange={handleMedidaSelect}>
                            <option value="">-- Selecione --</option>
                            {medidasDisponiveis.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.nome} ({m.unidade})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedMedida && (
                        <div className="item-inputs">
                            {isVolumeSelected ? (
                                <div className="volume-inputs">
                                    <div className="form-group">
                                        <label>Altura (m)</label>
                                        <input
                                            type="number"
                                            name="altura"
                                            value={volumeForm.altura}
                                            onChange={handleVolumeChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Largura (m)</label>
                                        <input
                                            type="number"
                                            name="largura"
                                            value={volumeForm.largura}
                                            onChange={handleVolumeChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Comprimento (m)</label>
                                        <input
                                            type="number"
                                            name="comprimento"
                                            value={volumeForm.comprimento}
                                            onChange={handleVolumeChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Valor ({selectedMedida.unidade})</label>
                                    <input
                                        type="number"
                                        name="valorInformado"
                                        value={itemForm.valorInformado}
                                        onChange={handleItemChange}
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            )}

                            <button type="button" className="button-primary" onClick={handleAddItem}>
                                Adicionar Item
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="total-display">
                    <h3>Valor Total: {formatCurrency(valorTotalCalculado)}</h3>
                </div>

                <div className="frete-form-actions">
                    {error && <p className="error-message">{error}</p>}
                    <Link to="/fretes" className="button-secondary">
                        Cancelar
                    </Link>
                    <button type="submit" className="button-primary" disabled={loading}>
                        {loading ? 'Salvando...' : (isEditing ? 'Atualizar Frete' : 'Salvar Novo Frete')}
                    </button>
                </div>

            </div>
        </form>
    );
};

export default FreteFormPage;