import React from 'react'
import { useState, useContext } from "react";
import WeatherGraph from './WeatherGraph'
import './css/SearchBar.css'
import './css/WeatherTab.css';
import './css/Main.css'
import Navbar from "./Navbar";
import NavbarProtected from './NavbarProtected';
import Footer from "./Footer";
import Suggest from './Suggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudShowersHeavy, faPlus, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "./utils/AuthContext";

function Main() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [locality, setLocality] = useState('')
    const [meteo_nm, setMeteo_nm] = useState('Prague')
    const [meteo_last_tmp, setMeteo_last_tmp] = useState(17)

    const [temp_data, settemp_data] = useState([])

    const { createMeteo, isAuthenticated } = useContext(AuthContext);

    function openCreateModal() {
        if (!isOpen) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }

    const modalStyles = {
        display: isOpen ? 'block' : 'none',
    }

    async function fetchMeteo(meteo_name) {
        console.log('here   ' + meteo_name)
        const mt_response = await fetch(`/api/meteo-info/${meteo_name}`)
        const mt_data = await mt_response.json()
        if (!mt_data.error) {
            setMeteo_nm(mt_data.name)
        }
        console.log()
        const response = await fetch(`/api/get-meassure/${mt_data._id}`);
        const data = await response.json();
        console.log(data)
        if (!data.error) {
            settemp_data(data)
            setMeteo_last_tmp(data[data.length - 1].temp)
        }


    }

    return (
        <>
            {isAuthenticated ? <NavbarProtected /> : <Navbar />}
            <aside>
                <section className='new_meteo_form' style={modalStyles}>
                    <FontAwesomeIcon icon={faXmark} onClick={openCreateModal} />
                    <label>Meteostation name</label>
                    <input type='text' onChange={(e) => setName(e.target.value)} />
                    <label>Locality</label>
                    <input type='text' onChange={(e) => setLocality(e.target.value)} />
                    <button onClick={async () => {
                        const meteo_response = await createMeteo(name, locality)
                        if (meteo_response) {
                            setIsOpen(false)
                        }
                    }
                    }>
                        Create
                    </button>
                </section>
                {isOpen ? <div className="overlay"></div> : <></>}
            </aside>
            <section className='top_main_section'>
                <section className="search_bar_section">
                    <div>
                        <Suggest fch_meassure={fetchMeteo} />

                    </div>

                </section>
                {
                    isAuthenticated ? (
                        <section className='new_meteo_section' onClick={openCreateModal}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Create new meteostation</span>
                        </section>
                    ) : <></>
                }

            </section>


            <section className="weather_tab_section">
                <article className="weather_tab">
                    <span className="item1">{meteo_nm}</span>
                    <FontAwesomeIcon icon={faCloudShowersHeavy} className="item2" />
                    <span className="item3">{meteo_last_tmp} °C</span>

                </article>
            </section>
            {
                (temp_data.length > 0) && <WeatherGraph meassure_data={temp_data} />
            }
            <Footer />
        </>
    )
}

export default Main