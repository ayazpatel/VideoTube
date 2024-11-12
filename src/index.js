// require("dotenv").config({path: './env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: './.env'
})

connectDB()
.then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(` Server is running on port ${port}`);
  })
})
.catch((error) => {
  console.log("MongoDB connection failed !!! ", error);
})



/* 
*alternate approach in db-folder

const app = express();
const app = express()
;( async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    })

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })

  } catch (error) {
    console.log("Error: ",error);
    throw error;
  }
})()
*/