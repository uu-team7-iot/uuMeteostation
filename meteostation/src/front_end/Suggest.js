import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Suggest = ({fch_meassure}) => {
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
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={()=>{
                console.log(searchTerm)
                fch_meassure(searchTerm)

                }
                }/>
            <ul>
                {
                    suggestions.map((suggestion) => (
                        <li key={suggestion._id}>
                            <button onClick={(e) => {
                                setSearchTerm(e.target.innerText)
                            }
                            }>{suggestion.name}</button>
                        </li>
                    ))
                }
            </ul>

        </div>
    );
};

export default Suggest;
