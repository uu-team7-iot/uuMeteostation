import React from 'react'
import './css/Navbar.css'

function Navbar () {
    return (
        <ol className='navbar'>
            <li><a href='/'>Logo</a></li>
            <li><a href='/login'>Log in</a></li>
            <li><a href='/signup'>Sign up</a></li>
            <li><a href=''>About</a></li>
        </ol>
    )
}

export default Navbar