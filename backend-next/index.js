import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './src/configs/database.js';
import router from './src/routes/routes.js';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT  = process.env.PORT
connectDB()
app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


