import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import 'react-toastify/dist/ReactToastify.css';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };
  
  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url+"/api/order/status", {
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

useEffect(() => {
  const fetchAndSortOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        // Sort orders in descending order based on date or another key (assuming `date` field exists)
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error("Error fetching and sorting orders:", error);
    }
  };

  fetchAndSortOrders();
}, []);

  
  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Order parcel" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return `${item.name} x${item.quantity}`;
                  } else {
                    return `${item.name} x${item.quantity}, `;
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName+ " " +order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street+""}</p>
                <p>{order.address.city+","+order.address.state+","+order.address.country+","+order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
