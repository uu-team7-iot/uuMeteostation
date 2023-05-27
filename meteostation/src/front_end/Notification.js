import React from "react";
import { useState, useContext } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import NavbarProtected from "./NavbarProtected";
import Footer from "./Footer";

function Notification() {
    const [name, setName] = useState('');
    const [date_from, setDate_from] = useState('');
    const [date_to, setDate_to] = useState('');
    const [temperature_below, setTemp_below] = useState('');
    const [temperature_above, setTemp_above] = useState('');

    const { createNotification } = useContext(AuthContext);

    const handleCreateNotification = async (e) => {
        createNotification(name, date_from, date_to, temperature_below, temperature_above)
    }



    return (
        <section>
            <NavbarProtected />
            <section className="mynotification_section">
                <article className="create_notification_form">
                    <h2>New Notification</h2>
                    <label>Name of meteostation</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} />
                    <label>Date from</label>
                    <input type='date' onChange={(e) => setDate_from(e.target.value)} />
                    <label>Date to</label>
                    <input type="date" onChange={(e) => setDate_to(e.target.value)} />
                    <label>Temperature below</label>
                    <input type="number" onChange={(e) => setTemp_below(e.target.value)} />
                    <label>Temperature above</label>
                    <input type="number" onChange={(e) => setTemp_above(e.target.value)} />
                    <button onClick={handleCreateNotification}>Create</button>
                </article>
            </section>
            <Footer />
        </section>
    )
}

export default Notification