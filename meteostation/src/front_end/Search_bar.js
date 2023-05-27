import React, { useState, useEffect } from 'react';
import './css/SearchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


function Search_bar() {
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
        const response = await fetch(`/api/meteostations/suggest?search=${searchTerm}`);
        const data = await response.json();
        console.log(data)
        setSuggestions(data);
    };


    return (
        <section className="search_bar_section">
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Hledat meteostanici"
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            {
                setSuggestions.length > 0
                &&
                <ul>
                    {suggestions.map((suggestion) => (
                        <li key={suggestion._id}>{suggestion.name}</li>
                    ))}
                </ul>
            }
        </section>
    )
}

export default Search_bar