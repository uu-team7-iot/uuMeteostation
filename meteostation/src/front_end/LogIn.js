import React from "react";
import { useState, useContext } from "react";
import './css/LogIn.css'
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthContext from "./utils/AuthContext";


function LogIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(AuthContext);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async () => {
        login(email, password)
    }


    return (
            <section>
                <Navbar />
                <main className="sign_log">
                    <article className="sign_log_form">
                        <label htmlFor='email'>Email</label>
                        <input type="email" onChange={handleEmailChange} />
                        <label htmlFor='password'>Password</label>
                        <input type="password" onChange={handlePasswordChange} />
                        <button onClick={handleSubmit}>Log In</button>
                    </article>
                    <aside className="right_part_login">
                    </aside>
                </main>
                <Footer />
            </section>
        )

}

export default LogIn