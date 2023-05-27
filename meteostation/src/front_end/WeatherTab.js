import React from "react";
import './css/WeatherTab.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons'

function WeatherTab () {
    return (
        <section className="weather_tab_section">
            <article className="weather_tab">
                <span className="item1">Prague</span>
                <FontAwesomeIcon icon={faCloudShowersHeavy} className="item2"/>
                <span className="item3">11 °C</span>

            </article>
        </section>
    )
}

export default WeatherTab