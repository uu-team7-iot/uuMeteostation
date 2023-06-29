import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Suggest = ({ fch_meteo }) => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [visibleHelp, setVisibleHelp] = useState(true);

    useEffect(() => {
        if (searchTerm.length > 0 && visibleHelp) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, visibleHelp]);

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
                onChange={(e) => {
                    setVisibleHelp(true)
                    setSearchTerm(e.target.value)
                }}
                placeholder="Hledat meteostanici"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                console.log(searchTerm)
                fch_meteo(searchTerm)
                navigate(`/?meteoStation=${encodeURIComponent(searchTerm)}`, { replace: true });
                setVisibleHelp(false)
            }
            } />
            <ul>
                {
                    suggestions.map((suggestion) => (
                        <li key={suggestion._id}>
                            <button onClick={async (e) => {
                                const new_term = e.target.innerText
                                setVisibleHelp(false)
                                fch_meteo(new_term)
                                navigate(`/?meteoStation=${encodeURIComponent(new_term)}`, { replace: true });
                                setSearchTerm(new_term)
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
