import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://jenna:Acube123@nodet.mwpmt.mongodb.net/food-del').then(()=>console.log("DB connected"));
}