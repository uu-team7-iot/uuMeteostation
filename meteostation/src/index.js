import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Navbar from './front_end/Navbar';
import Search_bar from './front_end/Search_bar';
import WeatherTab from './front_end/WeatherTab';
import WeatherGraph from './front_end/WeatherGraph';
import SignUp from './front_end/SignUp';
import LogIn from './front_end/LogIn';
import Main from './front_end/Main';
import Notification from './front_end/Notification';
import AuthProvider from "./front_end/utils/AuthProvider";
import reportWebVitals from './reportWebVitals';
import './front_end/css/FormPage.css'
import Footer from './front_end/Footer';
import RouteProvider from './front_end/utils/RouteProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/">
          <Route index element={
            <section>
              <Main />
            </section>
          } />

          <Route path="login" element={
            <RouteProvider Component={LogIn} Protected={false} />
          } />

          <Route path="signup" element={
            <RouteProvider Component={SignUp} Protected={false} />
          } />

          <Route path="notification" element={
            <RouteProvider Component={Notification} Protected={true} />
          } />


        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
