import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
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

    const [noti, setNoti] = useState([])

    const { createNotification } = useContext(AuthContext);

    const handleCreateNotification = async (e) => {
        createNotification(name, date_from, date_to, temperature_below, temperature_above)
    }

    useEffect(async () => {

        const url = '/api/get-notifications'

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
            if (data_json.msg) {
                setNoti(data_json.notifications)
            } else {
                //alert(data_json.error)
            }

        } catch (error) {
            console.error(error);
        }
    }, [])

    async function deleteNotification(noti_name) {
        const url = '/api/delete-notification'

        const options = {
            method: "DELETE", // specify the HTTP method
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: noti_name })
        };

        try {
            const response = await fetch(url, options);
            const data_json = await response.json();
            console.log(data_json); // handle the response from the server
            if (data_json.msg) {
                alert(data_json.msg)
            } else {
                alert(data_json.error)
            }

        } catch (error) {
            console.error(error);
        }
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
            <section className="all_notification_section">
                <h2>All my notifications</h2>
                <ul>
                    {
                        noti.map((el) => {
                            return (
                                <li className="noti_tab">
                                    <h3>{el.name}</h3>
                                    <span>{new Date(el.date_from).toLocaleDateString('en-GB')} - {new Date(el.date_to).toLocaleDateString('en-GB')}</span>
                                    <span>{el.temperature_below} - {el.temperature_above}</span>
                                    <button onClick={() => deleteNotification(el.name)}>Delete</button>
                                </li>
                            )
                        })
                    }
                </ul>

            </section>
            <Footer />
        </section>
    )
}

export default Notification