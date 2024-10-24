import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import { assets } from './../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    return () => {
      // Enable scrolling again when popup is closed
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const syncCartWithBackend = async (userId, cartData) => {
    try {
      const response = await axios.post(`${url}/api/cart/sync`, {
        userId,
        newCartData: cartData,
      });
      console.log('Cart synced successfully:', response.data);
    } catch (error) {
      console.error('Error syncing cart with backend:', error.response ? error.response.data : error.message);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    // Validate data before sending
    if (currState === "Sign Up" && !data.name) {
      alert("Name is required");
      return;
    }

    if (!data.email) {
      alert("Email is required");
      return;
    }

    if (!data.password) {
      alert("Password is required");
      return;
    }

    // Create the payload for login/register
    const payload = currState === "Login" ? { email: data.email, password: data.password } : data;

    console.log("Sending data:", payload);  // Log the payload being sent

    try {
      const response = await axios.post(newUrl, payload);
      console.log("Response from server:", response.data);  // Log the response data

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);

        // Sync cart data if logging in
        if (currState === "Login") {
          const userId = response.data.userId; // Assuming userId is returned
          const cartData = JSON.parse(localStorage.getItem('cart')) || {}; // Retrieve cart data from local storage
          await syncCartWithBackend(userId, cartData);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during login/register:", error.response ? error.response.data : error.message);
      alert("An error occurred: " + (error.response?.data?.message || "Please try again later."));
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className='login-popup-inputs'>
          {currState === "Login" ? null : <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your name' required autoComplete='name' />}
          <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required autoComplete='email' />
          <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required autoComplete='current-password' />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className='login-popup-condition'>
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  );
};

export default LoginPopup;
