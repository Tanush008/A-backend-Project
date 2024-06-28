// import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constant";
import connetDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({path:
    './.env'});


connetDB()
.then(()=>{ 
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Error connecting to database",err);
})






// This is not a professional way to write the code and to import the DB
// // (async () => {
// //   try {
// //     await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
// //   } catch (error) {
// //     console.log("Error", error);
// //     throw error
// //   }
// })();
