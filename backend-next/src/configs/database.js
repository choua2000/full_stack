import mongoose from "mongoose";
// const URL = process.env.URL
const connectDB = async () =>{
    const URL = process.env.URL
    try {
        await mongoose.connect(URL)
        .then(() => {
            console.log("Database connected successfully");
        })
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;