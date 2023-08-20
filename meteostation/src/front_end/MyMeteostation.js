import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import NavbarProtected from "./NavbarProtected";
import './css/MyMeteostation.css'
import Footer from "./Footer";
import MeteoTab from "./MeteoTab";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons'


function MyMeteostation() {
    const { createMeteo, AlertBox } = useContext(AuthContext)
    const [meteostations, setMeteostations] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [locality, setLocality] = useState('')
    const [alertContent, setAlertContent] = useState(null)
    const [openAlert, setOpenAlert] = useState(false);

    async function get_meteos() {
        console.log('get_meteos function called.')
        const url = '/api/meteostations/get-by-user'

        const options = {
            method: "GET", // specify the HTTP method
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        try {
            const response = await fetch(url, options);
            const data_json = await response.json();
            console.log(data_json); // handle the response from the server
            if (data_json.success) {
                setMeteostations(data_json.meteostations)
            } else {
                console.log(data_json.msg)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        get_meteos()
    }, [])

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

    function hideAlertBox () {
        setOpenAlert(false)
    }

    function setContentBox (obj) {
        setAlertContent({msg:obj.msg, success:obj.success})
        setOpenAlert(true)
    }

    return (
        <section>
            <NavbarProtected />


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
                            get_meteos()
                        }
                    }
                    }>
                        Create
                    </button>
                </section>

            </aside>
            {isOpen ? <div className="overlay"></div> : <></>}
            { openAlert && <AlertBox success={alertContent.success} msg={alertContent.msg} hideAlertBox={hideAlertBox}/>}

            <section className="myMeteoSection">
                <h2>
                    My Meteostations
                </h2>
                <p className="myMeteoDescription">
                    With our user-friendly interface, adding new meteostations to your collection is a breeze.
                    Simply click on the "Create Meteostation" button, input the necessary details such as location and name... and voila!
                    Your new meteostation is ready to provide valuable weather information.
                </p>
                <button className="meteo_btn" onClick={openCreateModal}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                    Create Meteostaion
                </button>
                <section className="listMeteostations">
                    <ul>
                        {
                            meteostations.map((el) => {
                                return <MeteoTab key={el.name}
                                                name={el.name} 
                                                locality={el.locality} 
                                                access_key={el.access_key} 
                                                owner={el.owner} 
                                                _id={el._id}
                                                get_meteos={get_meteos}/>
                            })
                        }
                    </ul>
                </section>
            </section>
            <Footer />
        </section>

    )
}

export default MyMeteostation