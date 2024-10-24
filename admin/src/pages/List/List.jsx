import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import 'react-toastify/dist/ReactToastify.css';

const List = ({url}) => {

  const [list,setList] = useState([]);
 
    // Fetch food list
    const fetchList = async () =>{
    const response = await axios.get(`${url}/api/food/list`)
    console.log(response.data); 
    if (response.data.success){
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }

  }

    // Remove a food item
    const removeFood = async (foodId) => {
      try {
        const response= await axios.delete(`${url}/api/food/${foodId}`);
        await fetchList();
        toast.success(response.data.message) 
      } catch (error) {
        toast.error("Error removing food item");
        console.error("Error removing food item:", error);
      }
    };

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=> removeFood(item._id)} className='cursor'><img src={assets.cross_icon} alt="" /></p>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default List;