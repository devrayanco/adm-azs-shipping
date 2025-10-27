import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFretes, deleteFrete } from '../services/freteService';

const FreteListPage = () => {
    const navigate = useNavigate();
        const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0, number: 0, first: true, last: true });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState(''); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString.replace(/-/g, '\/')).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const loadFretes = useCallback(async () => {
        setLoading(true);
        setError('');
        
        const params = {
            page: currentPage,
            size: pageSize,
            sort: 'dataEntrega', 
            dir: 'desc', 
            q: searchTerm, 
        };

        try {
            const data = await getFretes(params);
            setPageData(data);
        } catch (err) {
            setError('Falha ao carregar fretes.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm]); 

    useEffect(() => {
        loadFretes();
    }, [loadFretes]); 

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); 
        setSearchTerm(searchText); 
    };

    const handleClearSearch = () => {
        setSearchText('');
        setSearchTerm('');
        setCurrentPage(0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este frete?')) {
            try {
                await deleteFrete(id);
                loadFretes(); 
            } catch (err) {
                setError('Falha ao excluir frete. Tente novamente.');
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    
    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Meus Fretes</h2>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Buscar por descrição, medida, unidade..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                    {searchTerm && (
                        <button type="button" className="button-secondary" onClick={handleClearSearch}>
                            Limpar
                        </button>
                    )}
                </form>
                <Link to="/fretes/novo" className="button-primary">
                    Novo Frete
                </Link>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Data Entrega</th>
                                <th>Valor Total</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.content.length > 0 ? (
                                pageData.content.map(frete => (
                                    <tr key={frete.id}>
                                        <td>{frete.descricao}</td>
                                        <td>{formatDate(frete.dataEntrega)}</td>
                                        <td>{formatCurrency(frete.valorTotalCalculado)}</td>
                                        <td className="table-actions">
                                            <button 
                                                className="button-edit" 
                                                onClick={() => navigate(`/fretes/${frete.id}`)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className="button-delete"
                                                onClick={() => handleDelete(frete.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">
                                        {searchTerm ? 'Nenhum frete encontrado para esta busca.' : 'Nenhum frete cadastrado.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <span className="pagination-info">
                            Mostrando {pageData.content.length} de {pageData.totalElements} fretes
                        </span>
                        <div className="pagination-controls">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={pageData.first}
                            >
                                Anterior
                            </button>
                            <span style={{alignSelf: 'center'}}>
                                Página {pageData.number + 1} de {pageData.totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={pageData.last}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FreteListPage;