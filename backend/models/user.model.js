import mongoose, { mongo } from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
      type:String,
      required:true,
      
    },
    email:{
      type:String,
      required:true,
      unique:true,
    },
    password:{
      type:String,
      required:true,
      minLength:[6,"Password must be at least 6 characters long"],
    },
    lastCheckIn:{
      type:Date,
      default:Date.now,
    },
    checkInFrequency:{
      type:Number,
      default:7, // Default to weekly check-ins
    },
    isAlive:{
      type:Boolean,
      default:true,
    },
    warningStage: { type: Number, default: 0 }, // 0=OK, 1=First Warning, 2=Final Warning
   
  nomineeName: {type:String, default:null},
  nomineeEmail: {type:String, default:null},
  })


  const User = mongoose.model("User", userSchema) 
  export default User