import { useState, useContext } from "react";
import React from "react";
import './css/SignUp.css'
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthContext from "./utils/AuthContext";

function SignUp() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_repeat, setPassword_repeat] = useState('')
    const { register } = useContext(AuthContext);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handlePassword_repetChange = (event) => {
        setPassword_repeat(event.target.value);
    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = async () => {
        if (password !== password_repeat) {
            console.log('Password doesnt match.')
        } else {
            register(name, email, password)
        }
    }


    return (
        <section>
            <Navbar />
            <main className="sign_log">
                <article className="sign_log_form">
                    <label for='name'>Name</label>
                    <input type="text" onChange={handleNameChange} />
                    <label for='email'>Email</label>
                    <input type="email" onChange={handleEmailChange} />
                    <label for='password'>Password</label>
                    <input type="password" onChange={handlePasswordChange} />
                    <label for='password'>Password repeat</label>
                    <input type="password" onChange={handlePassword_repetChange}/>
                    <button onClick={handleSubmit}>Sign Up</button>
                </article>
                <aside className="right_part_signup">
                </aside>
            </main>
            <Footer />
        </section>
    )
}

export default SignUp