import React from 'react'
import { useState, useContext } from "react";
import WeatherGraph from './WeatherGraph'
import './css/SearchBar.css'
import './css/WeatherTab.css';
import './css/Main.css'
import Navbar from "./Navbar";
import NavbarProtected from './NavbarProtected';
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudShowersHeavy, faPlus, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "./utils/AuthContext";

function Main() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [locality, setLocality] = useState('')

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

    return (
        <>
        {isAuthenticated ? <NavbarProtected /> : <Navbar />}
        <aside>
            <section className='new_meteo_form'  style={modalStyles}>
                <FontAwesomeIcon icon={faXmark} onClick={openCreateModal}/>
                <label>Meteostation name</label>
                <input type='text' onChange={(e) => setName(e.target.value)}/>
                <label>Locality</label>
                <input type='text' onChange={(e) => setLocality(e.target.value)}/>
                <button onClick={()=>{createMeteo(name, locality)}}>Create</button>
            </section>
            {isOpen ? <div className="overlay"></div> : <></>}
        </aside>
        <section className='top_main_section'>
        <section className="search_bar_section">
                <div>
                    <input type="text" placeholder="Praha 4 - Kolbenova" autoComplete="off" />
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>

            </section>
            <section className='new_meteo_section' onClick={openCreateModal}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Create new meteostation</span>
            </section>
        </section>
            
            
            <section className="weather_tab_section">
                <article className="weather_tab">
                    <span className="item1">Prague</span>
                    <FontAwesomeIcon icon={faCloudShowersHeavy} className="item2" />
                    <span className="item3">11 °C</span>

                </article>
            </section>
            <WeatherGraph />
            <Footer />
        </>
    )
}

export default Main