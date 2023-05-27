import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons"
import './css/Footer.css'


function Footer () {
    return (
        <footer className='footer_section'>
            <ol>
            <li>
                    <a href=''>
                    <FontAwesomeIcon icon={faFacebook} />
                    </a>
                </li>
                <li>
                    <a href=''>
                    <FontAwesomeIcon icon={faTwitter} />
                    </a>
                </li>
                <li>
                    <a href=''>
                    <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </li>
            </ol>
            <p className='author_paragraph'>Designed by TEAM 7, 2023</p>
        </footer>
    )
}

export default Footer