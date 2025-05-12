import React, { useState } from 'react';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';
import { useNavigate } from 'react-router-dom';
import './search.css'
import API_BASE_URL from '../../config';

const Search = () => {
    const [selectedItem, setSelectedItem] = useState('beneficiary');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(
                `${API_BASE_URL}/beneficiary-search`,
                { name: searchTerm },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setResults(response.data.result);
            }
        } catch (error) {
            console.error('Error searching beneficiaries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (beneficiaryName) => {
        navigate(`/beneficiary?highlight=${encodeURIComponent(beneficiaryName)}`);
    };

    return (
        <div className='create__acc'>
            <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
            <div className='benef_search'>
            <div className='benef_form_cont'>
            <form onSubmit={handleSearch} className='benef_search-form'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search beneficiaries by name...'
                />
                <button type='submit' disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            </div>

            <div className='benef_search-results'>
                {results.length > 0 ? (
                    results.map((name, index) => (
                        <div key={index} className='benef_search-result-item' onClick={() => handleClick(name)}>
                            {name}
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default Search;
