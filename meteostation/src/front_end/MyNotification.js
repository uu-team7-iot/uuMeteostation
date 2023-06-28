import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import NavbarProtected from "./NavbarProtected";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faTemperatureLow } from '@fortawesome/free-solid-svg-icons'

function MyNotification({openModalNoti, modalStylesNoti}) {

    const [noti, setNoti] = useState([])

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


    /*<label>Name of meteostation</label>
                <input type="text" onChange={(e) => setName(e.target.value)} /> */
    return (
        
        <section>
            <NavbarProtected />
            <section className="all_notification_section">
                <h2>All my notifications</h2>
                <ul>
                    {
                        noti.map((el) => {
                            return (
                                <li className="noti_tab">
                                    <h3>{el.name}</h3>
                                    <span>
                                    <FontAwesomeIcon icon={faCalendarDays}/>
                                        {new Date(el.date_from).toLocaleDateString('en-GB')} - {new Date(el.date_to).toLocaleDateString('en-GB')}
                                        </span>
                                    <span>
                                    <FontAwesomeIcon icon={faTemperatureLow}/>
                                        {el.temperature_below} °C - {el.temperature_above} °C
                                        </span>
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

export default MyNotification