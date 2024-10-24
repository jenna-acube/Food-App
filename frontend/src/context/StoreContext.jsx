import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "https://food-app-backend-jrwn.onrender.com";

  const addToCart = (itemId) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [itemId]: (prevItems[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 0) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

      if (token) {
        try {
          await axios.post(
            `${url}/api/cart/remove`,
            { itemId },
            { headers: { token } }
          );
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      }
    }
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, item) => {
      const itemInfo = food_list.find((product) => product._id === item);
      return total + (itemInfo ? itemInfo.price * cartItems[item] : 0);
    }, 0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
      await fetchFoodList();

      if (savedToken) {
        await loadCartData(savedToken);
      }
    };

    init();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
