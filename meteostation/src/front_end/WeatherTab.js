import React, {useContext} from "react";
import './css/WeatherTab.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudShowersHeavy, faHammer } from '@fortawesome/free-solid-svg-icons'
import AuthContext from "./utils/AuthContext";

function WeatherTab({ meteo_nm, meteo_last_tmp, openModalNoti }) {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <section className="weather_tab_section">
            <article className="weather_tab">
                <span className="item1">{meteo_nm}</span>
                <FontAwesomeIcon icon={faCloudShowersHeavy} className="item2" />
                <span className="item3">{meteo_last_tmp} °C</span>
                <span className="item4" onClick={()=>{
                    openModalNoti()
                }}>
                    {isAuthenticated ? <><FontAwesomeIcon icon={faHammer} /><span>Set notification</span></> : <></>}
                </span>

            </article>
        </section>
    )
}

export default WeatherTab