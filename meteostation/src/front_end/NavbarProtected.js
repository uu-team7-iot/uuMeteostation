import React from 'react'
import './css/Navbar.css'
import { useNavigate, Link } from "react-router-dom";


function NavbarProtected () {

    const navigate = useNavigate();

    
    const logout = () => {
        const tokenString = localStorage.getItem("token");
        const token = tokenString ? JSON.parse(tokenString) : null;

        if (token) {
            localStorage.removeItem("token");
            console.log('Sucessfully token removed')
        } else {
            console.log('No token available to remove.')
        }
        navigate(0)
    }


    return (
        <ol className='navbar'>
            <li><a href='/'>MeteoApp</a></li>
            <li><a href='/notification'>My notification</a></li>
            <li><a href='/meteostations'>Meteostations</a></li>
            <li><button onClick={logout}>Log out</button></li>

        </ol>
    )
}

export default NavbarProtected