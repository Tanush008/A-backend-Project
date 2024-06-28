import { Schema } from "mongoose";
import mongoose from "mongoose";
const subscriptionSchema = new Schema({
subscriber:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}   
},{timestamps:true})
export const subsctription = mongoose.model("subsctription",subscriptionSchema)