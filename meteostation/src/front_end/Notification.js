import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function formatDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function Notification({ openModalNoti, modalStylesNoti, meteo_nm, get_notifications, setContentBox }) {
    const [date_from, setDate_from] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const [date_to, setDate_to] = useState(new Date());
    const [meteoNames, setMeteoNames] = useState([])
    const [meteoNameOption, setMeteoNameOption] = useState('')
    const [temperature_below, setTemp_below] = useState('');
    const [temperature_above, setTemp_above] = useState('');

    useEffect(() => {
        get_meteo_name()
    }, [])

    const { createNotification } = useContext(AuthContext);

    const handleCreateNotification = async (e) => {
        let return_val
        if (meteoNameOption) {
            console.log(meteoNameOption)
            return_val = await createNotification(meteoNameOption, date_from, date_to, temperature_below, temperature_above)
        } else {
            console.log(meteoNameOption)
            return_val = await createNotification(meteo_nm, date_from, date_to, temperature_below, temperature_above)
        }
        return return_val

    }

    async function get_meteo_name() {
        const response = await fetch('/api/meteostations/all-meteo-names')
        const data = await response.json()
        if (!data.error) {
            setMeteoNames(data)
            console.log(data)
        } else {
            console.log(data)
        }
    }


    // Format the dates as YYYY-MM-DD strings
    const formattedFromDate = formatDate(date_from);
    const formattedToDate = formatDate(date_to);


    return (
        <section>
            <section className="mynotification_section" style={modalStylesNoti}>
                <article className="create_notification_form">
                    <FontAwesomeIcon icon={faXmark} onClick={openModalNoti} />
                    <h2>New Notification</h2>
                    {
                        !meteo_nm &&
                        <div className="select_meteo">
                            <label for='meteostation'>Choose meteostation</label>
                            <select name="meteostation" onClick={(e) => {
                                setMeteoNameOption(e.target.value)
                                console.log(e.target.value)
                            }}>
                                {meteoNames.map((el) => {
                                    return <option value={el.name} >{el.name}</option>
                                })}
                            </select>
                        </div>
                    }

                    <div className="dates_form">
                        <label>Date from</label>
                        <input type='date' onChange={(e) => {
                            const dt = new Date(e.target.value)
                            if (dt < date_to) {
                                setDate_from(dt)
                            } else {
                                console.log('Date from in notification cant be more than date to.')
                            }

                        }} value={formattedFromDate} />
                        <label>Date to</label>
                        <input type="date" onChange={(e) => {
                            const dt = new Date(e.target.value)
                            if (dt > date_from) {
                                setDate_to(dt)
                            } else {
                                console.log('Date to in notification cant be less than date from.')
                            }

                        }} value={formattedToDate} />
                    </div>
                    <div className="temps_form">
                        <label>Temperature below</label>
                        <input type="number" onChange={(e) => {
                            const given_temp = e.target.value
                            if (given_temp > -21) {
                                setTemp_below(given_temp)
                            } else {
                                console.log('Temperature FROM cant be less then -20 C.')
                            }

                        }} value={temperature_below} />
                        <label>Temperature above</label>
                        <input type="number" onChange={(e) => {
                            const given_temp = e.target.value
                            if (given_temp < 35) {
                                setTemp_above(given_temp)
                            } else {
                                console.log('Temperature TO cant be more than 35 C')
                            }

                        }} value={temperature_above} />
                    </div>

                    <button onClick={async () => {
                        const return_val = await handleCreateNotification()
                        if (setContentBox){
                            setContentBox(return_val)
                        }
                        
                        if (return_val.success) {
                            openModalNoti()
                            if (get_notifications) {
                                get_notifications()
                            }
                        }
                    }}>Create</button>
                </article>
            </section>
        </section>
    )
}

export default Notification