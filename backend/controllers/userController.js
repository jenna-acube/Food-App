import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// Login user

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message:"User Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.json({success: false, message: "Invalid credentials"})
        } 

        const token = createToken(user._id);
        res.json({ success: true, token });
        
        }
        catch(error) {
            console.error(error);
            res.json({ success: false, message: "Error" });
        }
}
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        console.log("Password received:", password); // Debugging log

        // Hash password and save new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        // Send success response
        return res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

  
export {loginUser, registerUser}