import React, { useEffect } from 'react'
import { useState, useContext } from "react";
import { useLocation } from 'react-router-dom';
import WeatherGraph from './WeatherGraph'
import './css/SearchBar.css'
import './css/WeatherTab.css';
import './css/Main.css'
import Navbar from "./Navbar";
import NavbarProtected from './NavbarProtected';
import Footer from "./Footer";
import Suggest from './Suggest';
import WeatherTab from './WeatherTab';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudShowersHeavy, faPlus, faMagnifyingGlass, faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "./utils/AuthContext";

function Main() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const meteoStationParam = queryParams.get('meteoStation');
    console.log(meteoStationParam); // Output: "ARDUINO"

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [locality, setLocality] = useState('')
    const [meteo_nm, setMeteo_nm] = useState(meteoStationParam || 'Prague')
    const [meteo_id, setMeteoId] = useState('')
    const [meteo_last_tmp, setMeteo_last_tmp] = useState(17)

    const [isOpenNoti, setIsOpenNoti] = useState(false)

    const [temp_data, settemp_data] = useState(false)

    const [alertContent, setAlertContent] = useState(null)
    const [openAlert, setOpenAlert] = useState(false);

    const { createMeteo, isAuthenticated, AlertBox } = useContext(AuthContext);

    useEffect(() => {
        fetchMeteo(meteo_nm)
    }, [meteo_nm])

    function openCreateModal() {
        if (!isOpen) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }

    function openModalNoti() {
        if (!isOpenNoti) {
            setIsOpenNoti(true)
        } else {
            setIsOpenNoti(false)
        }
    }


    const modalStyles = {
        display: isOpen ? 'block' : 'none',
    }

    const modalStylesNoti = {
        display: isOpenNoti ? 'block' : 'none',
    }

    async function fetchMeteo(meteo_name) {
        try{
            console.log('here   ' + meteo_name)
            const mt_response = await fetch(`/api/meteostations/meteo-info/${meteo_name}`)
            const mt_data = await mt_response.json()
            if (!mt_data.error) {
                setMeteo_nm(mt_data.name)
                setMeteoId(mt_data._id)
    
    
                const response = await fetch(`/api/measure/get-last-measure/${mt_data._id}`);
                const data = await response.json();
                console.log(data)
                if (!data.error) {
                    settemp_data(true)
                    setMeteo_last_tmp(data.temp)
                } else {
                    settemp_data(false)
                }
            }
    
        } catch (e) {
            console.log(e)
        }
        



    }

    function hideAlertBox () {
        setOpenAlert(false)
    }

    function setContentBox (obj) {
        setAlertContent({msg:obj.msg, success:obj.success})
        setOpenAlert(true)
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
                        const result_val = await createMeteo(name, locality)
                        setContentBox(result_val)
                        if (result_val.success) {
                            setIsOpen(false)
                        }
                    }
                    }>
                        Create
                    </button>
                </section>

            </aside>
            {(isOpen || isOpenNoti) ? <div className="overlay"></div> : <></>}
            { openAlert && <AlertBox success={alertContent.success} msg={alertContent.msg} hideAlertBox={hideAlertBox}/>}

            <section className='top_main_section'>
                <section className="search_bar_section">
                    <div>
                        <Suggest fch_meteo={fetchMeteo} />

                    </div>

                </section>
                {
                    isAuthenticated ? (
                        <section className='new_meteo_section' onClick={openCreateModal}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>New meteostation</span>
                        </section>
                    ) : <></>
                }

            </section>

            <WeatherTab
                meteo_nm={meteo_nm}
                meteo_last_tmp={meteo_last_tmp}
                openModalNoti={openModalNoti}
            />
            <Notification openModalNoti={openModalNoti} modalStylesNoti={modalStylesNoti} meteo_nm={meteo_nm} setContentBox={setContentBox}/>

            {
                temp_data && <WeatherGraph meteo_id={meteo_id} />
            }
            {
                !temp_data && <section className='info_no_temp'><FontAwesomeIcon icon={faCircleInfo} /> <p>No temperatures have been measured yet.</p></section>
            }
            <Footer />
        </>
    )
}

export default Main