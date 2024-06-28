    import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connetDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(`\n Mongo DB is connected!!!${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection is errr", error);
    process.exit(1);
  }
};
export default connetDB