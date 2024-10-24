import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Validate that both userId and itemId are provided
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Invalid user or item ID" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};  // Ensure cartData is an object

    // If the item does not exist in the cart, set the quantity to 1
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      // If the item already exists, increment the quantity
      cartData[itemId] += 1;
    }

    // Update user cart
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Validate that both userId and itemId are provided
    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Invalid user or item ID" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};  // Ensure cartData is an object

    // If the item exists in the cart and the quantity is greater than 0, reduce it by 1
    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      // If the quantity is zero, remove the item from the cart
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    // Update user cart
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};  // Ensure cartData is an object

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };
