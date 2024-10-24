import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "./../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, setCartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, isFirstTimeCustomer } = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState(""); 
  const [discount, setDiscount] = useState(0); 
  const [promoMessage, setPromoMessage] = useState(""); 
  const [appliedPromoCode, setAppliedPromoCode] = useState(""); 
  

  const promoCodes = {
    WELCOME50: { type: 'percentage', value: 50, minSubtotal: 50 },
    SAVE10: { type: 'percentage', value: 10, minSubtotal: 30 },
    SAVE20: { type: 'fixed', value: 20, minSubtotal: 70 },
  };

  const hasItemsInCart = food_list.some(item => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee - (subtotal * (discount / 100)) - (discount.type === 'fixed' ? discount.value : 0); 

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems'));
    if (savedCart) {
      setCartItems(savedCart);
    }
  }, [setCartItems]);

  useEffect(() => {
    // This will run whenever cartItems changes
    console.log('Current cart items:', cartItems);
    setCartItems(prevCartItems => {
      const savedCart = JSON.parse(localStorage.getItem('cartItems'));
      return savedCart || prevCartItems;
    });
  }, [cartItems]);

  const handlePromoCodeSubmit = () => {
    let appliedDiscount = 0;

    if (promoCode === "WELCOME50" && isFirstTimeCustomer && subtotal >= promoCodes.WELCOME50.minSubtotal) {
      appliedDiscount = promoCodes.WELCOME50.value;
      setPromoMessage("Welcome code applied! You get 50% off your first order.");
      setAppliedPromoCode(promoCode);
    } else if (promoCode === "SAVE10" && subtotal >= promoCodes.SAVE10.minSubtotal) {
      appliedDiscount = promoCodes.SAVE10.value;
      setPromoMessage("10% discount applied!");
      setAppliedPromoCode(promoCode);
    } else if (promoCode === "SAVE20" && subtotal >= promoCodes.SAVE20.minSubtotal) {
      appliedDiscount = promoCodes.SAVE20.value;
      setPromoMessage("$20 discount applied!");
      setAppliedPromoCode(promoCode);
    } else {
      const minSubtotal = promoCodes[promoCode]?.minSubtotal;
      if (minSubtotal) {
        const amountNeeded = minSubtotal - subtotal;
        if (amountNeeded <= 0) {
          setPromoMessage(`Promo code applied successfully!`);
          setDiscount(promoCodes[promoCode].value);
          setAppliedPromoCode(promoCode);
        } else {
          setPromoMessage(`Invalid promo code. You need to add $${amountNeeded.toFixed(2)} more to apply this code.`);
        }
      } else {
        setPromoMessage("Invalid promo code.");
      }
      return;
    }

    setDiscount(appliedDiscount);
  };

  const handleItemRemove = (itemId) => {
    removeFromCart(itemId);
    const newSubtotal = getTotalCartAmount();
    if (newSubtotal < promoCodes[appliedPromoCode]?.minSubtotal) {
      setDiscount(0);
      setPromoMessage(""); 
      setAppliedPromoCode(""); 
    }
  };

  const handleNavigate = () => {
    if (hasItemsInCart) {
      setAppliedPromoCode("");
      setDiscount(0);
      setPromoMessage("");
    }
    navigate('/');
  };

  const handleAddToCart = (itemId) => {
    addToCart(itemId); 
  };

  return (
    <div className="cart">
      <div className="cart-items">
        {hasItemsInCart ? (
          <>
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Add</p>
              <p>Remove</p>
              
            </div>
            <br />
            <hr />
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id}>
                    <div className="cart-items-title cart-items-item">
                      <img src={url + "/images/" + item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <p>{cartItems[item._id]}</p>
                      <p>${item.price * cartItems[item._id]}</p>
                      <p onClick={() => handleAddToCart(item._id)} className="cross">+</p>
                      <p onClick={() => handleItemRemove(item._id)} className="cross">x</p>
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </>
        ) : (
          <div className="cart-empty">
            <h2>Your Cart is Empty</h2>
            <p>It looks like you haven't added any items yet.</p>
          </div>
        )}
      </div>
      <br />
      <button onClick={handleNavigate}>Missed something? Browse more tasty choices</button>
      {hasItemsInCart && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Discount</p>
                <p>
                  {discount > 0 
                    ? `$${promoCodes[appliedPromoCode]?.type === 'percentage' 
                      ? (subtotal * (discount / 100)).toFixed(2) 
                      : discount}` 
                    : `$0`}
                </p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${total.toFixed(2)}</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>

          <div className="cart-promocode card">
            <div>
              <p>If you have a promo code, enter it here:</p>
              <div className="cart-promocode-input">
                <input 
                  type="text" 
                  placeholder="promo code" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)} 
                />
                <button onClick={handlePromoCodeSubmit}>Submit</button>
              </div>
              {promoMessage && <p className="promo-message">{promoMessage}</p>}
            </div>

            <div className="available-promocodes">
              <h4>Available Promo Codes:</h4>
              <ul>
                <li>
                  <strong>WELCOME50:</strong> 50% off your first order (requires $50 minimum subtotal) 
                  {subtotal < promoCodes.WELCOME50.minSubtotal && <span> - Add ${promoCodes.WELCOME50.minSubtotal - subtotal} more!</span>}
                </li>
                <li>
                  <strong>SAVE10:</strong> 10% off your order (requires $30 minimum subtotal) 
                  {subtotal < promoCodes.SAVE10.minSubtotal && <span> - Add ${promoCodes.SAVE10.minSubtotal - subtotal} more!</span>}
                </li>
                <li>
                  <strong>SAVE20:</strong> $20 off orders over $70 
                  {subtotal < promoCodes.SAVE20.minSubtotal && <span> - Add ${promoCodes.SAVE20.minSubtotal - subtotal} more!</span>}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
``
