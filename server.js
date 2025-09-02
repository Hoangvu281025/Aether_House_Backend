const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
// hehe
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json())



const storeRouter = require('./src/routers/storeRouter')
app.use('/api/stores' , storeRouter);




app.listen(8000 , () =>{
    console.log('server run on port 8000')
})