import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="footer" id='footer'>
        <div className="footer-content">
            <div className='footer-content-left'>
                <img src={assets.logo} alt=''/>
                <p>Browse menus, read reviews, and ratings to find the best eateries in your area. Place orders and track delivery through the app, with options for pick-up, reservations, and more.</p>
                <div className='footer-social-icons'>
                <a href="https://www.facebook.com/">
                    <img src={assets.facebook_icon} alt=""></img>
                </a>
                <a href="https://x.com/">    
                    <img src={assets.twitter_icon} alt=""></img>
                </a>
                <a href="https://www.linkedin.com/">
                    <img src={assets.linkedin_icon} alt=""></img>
                </a>
                </div>
            </div>
            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                <li>+91 9207817373</li>
                <li>contact@delicacy.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>Copyright 2024 &copy; Delicacy.com - All Right Reserved</p>
    </div>
  );
};

export default Footer;