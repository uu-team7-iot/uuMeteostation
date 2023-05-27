import React, { useState, useEffect } from 'react';

const Suggest = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    const fetchSuggestions = async () => {
        const response = await fetch(`/api/meteostations?search=${searchTerm}`);
        const data = await response.json();
        setSuggestions(data);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hledat meteostanici"
            />
            <ul>
                {suggestions.map((suggestion) => (
                    <li key={suggestion._id}>{suggestion.name}</li>
                ))}
            </ul>

        </div>
    );
};

export default Suggest;
