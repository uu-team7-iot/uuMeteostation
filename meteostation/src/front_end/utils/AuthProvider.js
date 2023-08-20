import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faBan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  console.log('AuthProvider is called')
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists, false otherwise
  });

  const register = async (name, email, password) => {
    console.log('Here')

    const url = "/api/user/register";
    const data = {
      name,
      email,
      password
    };

    const options = {
      method: "POST", // specify the HTTP method
      headers: {
        "Content-Type": "application/json" // tell the server that we are sending JSON data
      },
      body: JSON.stringify(data) // convert the data object to a JSON string
    };

    try {
      const response = await fetch(url, options);
      const data_json = await response.json();
      if (data_json.token) {
        localStorage.setItem("token", JSON.stringify(data_json.token));
        setIsAuthenticated(true);
        console.log(data_json); // handle the response from the server
        alert(data_json.msg)
        navigate('/');
      }
      console.log(data_json); // handle the response from the server

    } catch (error) {
      console.error(error);
      alert(error)
    }
  }

  const login = async (email, password) => {
    console.log('Login function was called from authProvider');
    const url = '/api/user/login';
    const data = {
      email,
      password,
    };

    const options = {
      method: 'POST', // specify the HTTP method
      headers: {
        'Content-Type': 'application/json', // tell the server that we are sending JSON data
      },
      body: JSON.stringify(data), // convert the data object to a JSON string
    };

    try {
      const response = await fetch(url, options);
      const data_json = await response.json();
      if (data_json.token) {
        localStorage.setItem('token', JSON.stringify(data_json.token));
        setIsAuthenticated(true);
        console.log(data_json); // handle the response from the server
        navigate('/');
      }
      console.log(data_json); // handle the response from the server
      console.log('Login function end from authProvider');
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    console.log('Successfully token removed');
  };

  const createMeteo = async (name, locality) => {
    console.log('create Meteo log')

    const url = "/api/meteostations/register-meteo";
    const data = {
      name,
      locality
    };

    const options = {
      method: "POST", // specify the HTTP method
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}` // tell the server that we are sending JSON data
      },
      body: JSON.stringify(data) // convert the data object to a JSON string
    };

    try {
      const response = await fetch(url, options);
      const data_json = await response.json();
      console.log(data_json); // handle the response from the server
      if (data_json.success) {
        return {success:true, msg: data_json.msg}
      } else {
        return {success:false, msg: data_json.msg}
      }

    } catch (error) {
      console.error(error);
      return {success:false, msg: error.msg}
    }
  }

  const createNotification = async (name, date_from, date_to, temperature_below, temperature_above) => {
    console.log('create Notification log')

    const url = "/api/notifications/register-notification";
    const data = {
      name,
      date_from,
      date_to,
      temperature_below,
      temperature_above,
    };

    const options = {
      method: "POST", // specify the HTTP method
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data) // convert the data object to a JSON string
    };

    try {
      const response = await fetch(url, options);
      const data_json = await response.json();
      console.log(data_json); // handle the response from the server
      if (data_json.success) {
        //alert(data_json.msg)
        return {success:true, msg: data_json.msg}
      } else {
        //alert(data_json.msg)
        return {success:false, msg: data_json.msg}
      }

    } catch (error) {
      console.error(error);
      return {success:false, msg: error}
    }
  }

  const AlertBox = ({success, msg, hideAlertBox}) => {

    console.log('In AlertBox')

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        hideAlertBox();
      }, 5000);
  
      return () => clearTimeout(timeoutId);
    }, []);
  
    const alertStyle = {
      background: success ? '#DDF3D5' : '#ECC8C5',
      color: success ? '#597151' : '#B83C37',
      border: success ? '#597151 2px solid' : '#B83C37 2px solid'
    };
  
    return (
          <aside className='alert_box' style={alertStyle}>
            <FontAwesomeIcon icon={success ? faCircleCheck : faBan} />
            <span>{msg}</span>
          </aside>
      )
  };

return (
  <AuthContext.Provider value={{ isAuthenticated, login, logout, register, createMeteo, createNotification, AlertBox }}>
    {children}
  </AuthContext.Provider>
);
};

export default AuthProvider;
