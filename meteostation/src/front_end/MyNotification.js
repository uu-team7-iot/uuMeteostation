import React from "react";
import { useState, useContext, useEffect, useNavigate } from "react";
import './css/Notification.css'
import AuthContext from "./utils/AuthContext";
import NavbarProtected from "./NavbarProtected";
import Notification from "./Notification";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faTemperatureLow, faPlusCircle } from '@fortawesome/free-solid-svg-icons'


function MyNotification() {

    const [noti, setNoti] = useState([])
    const [isOpenNoti, setIsOpenNoti] = useState(false)
    const [alertContent, setAlertContent] = useState(null)
    const [openAlert, setOpenAlert] = useState(false);

    const {AlertBox} = useContext(AuthContext)

    useEffect(() => {
        console.log("Log from useEffect MyNotification.js")
        get_notifications()
        
    }, [])

    async function get_notifications () {
        console.log('get_notification function called.')
        const url = '/api/notifications/get-notifications'
    
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
    }

    async function deleteNotification(noti_name) {
        const url = '/api/notifications/delete-notification'

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
            if (!data_json.error) {
                return {success:true, msg: data_json.msg}
            } else {
                return {success:false, msg: data_json.msg}
            }

        } catch (error) {
            console.error(error);
            return {success:false, msg: error.msg}
        }
    }

    function openModalNoti() {
        if (!isOpenNoti) {
            setIsOpenNoti(true)
        } else {
            setIsOpenNoti(false)
        }
    }

    const modalStylesNoti = {
        display: isOpenNoti ? 'block' : 'none',
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
            <Notification openModalNoti={openModalNoti} modalStylesNoti={modalStylesNoti} get_notifications={get_notifications} setContentBox={setContentBox}/>
            {(isOpenNoti) ? <div className="overlay"></div> : <></>}
            { openAlert && <AlertBox success={alertContent.success} msg={alertContent.msg} hideAlertBox={hideAlertBox}/>}
            <section className="all_notification_section">
                <h2>All my notifications</h2>
                <h3>
                    Stay informed about the weather conditions that matter to you.
                    Get notified about changes in temperature and humidity, so you can adjust your activities or make necessary adjustments to your environment for maximum comfort
                </h3>
                <button className="notification_btn"  onClick={openModalNoti}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                    <span>Create notification</span>
                </button>
                <ul>
                    {
                        Array.isArray(noti) && noti.map((el) => {
                            return (
                                <li className="noti_tab">
                                    <h3>{el.name}</h3>
                                    <span>
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        {new Date(el.date_from).toLocaleDateString('en-GB')} - {new Date(el.date_to).toLocaleDateString('en-GB')}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faTemperatureLow} />
                                        {el.temperature_below} °C - {el.temperature_above} °C
                                    </span>
                                    <button onClick={async () => {
                                        const result_val = await deleteNotification(el.name)
                                        if (result_val.success){
                                            get_notifications()
                                        }
                                        setContentBox(result_val)
                                        }}>Delete</button>
                                </li>
                            )
                        })
                    }
                </ul>

            </section>
            <Footer />
        </section >
    )
}

export default MyNotification