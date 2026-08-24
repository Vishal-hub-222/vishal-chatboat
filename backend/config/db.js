import mongoose  from "mongoose";

 const connectDB=async()=>{
    try{
      await  mongoose.connect(process.env.MONGOOSE_URL)
      console.log("mongooDB is connected...")
    }catch(e){
        console.log(e.message);
    }

 };

 export default connectDB;