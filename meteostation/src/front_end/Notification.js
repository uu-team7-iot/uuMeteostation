import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import NavbarProtected from "./NavbarProtected";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function Notification({openModalNoti, modalStylesNoti, meteo_nm}) {
    const [date_from, setDate_from] = useState('');
    const [date_to, setDate_to] = useState('');
    const [temperature_below, setTemp_below] = useState('');
    const [temperature_above, setTemp_above] = useState('');

    const { createNotification } = useContext(AuthContext);

    const handleCreateNotification = async (e) => {
        createNotification(meteo_nm, date_from, date_to, temperature_below, temperature_above)
    }


    return (
        <section>
            <section className="mynotification_section" style={modalStylesNoti}>
                <article className="create_notification_form">
                <FontAwesomeIcon icon={faXmark} onClick={openModalNoti} />
                    <h2>New Notification</h2>
                    <div className="dates_form">
                        <label>Date from</label>
                        <input type='date' onChange={(e) => setDate_from(e.target.value)} />
                        <label>Date to</label>
                        <input type="date" onChange={(e) => setDate_to(e.target.value)} />
                    </div>
                    <div className="temps_form">
                        <label>Temperature below</label>
                        <input type="number" onChange={(e) => setTemp_below(e.target.value)} />
                        <label>Temperature above</label>
                        <input type="number" onChange={(e) => setTemp_above(e.target.value)} />
                    </div>

                    <button onClick={handleCreateNotification}>Create</button>
                </article>
            </section>
        </section>
    )
}

export default Notification