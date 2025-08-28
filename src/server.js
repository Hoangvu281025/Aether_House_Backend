const express = require('express');
const app = express();
const connectDB = require('./db');
connectDB();
const Port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


const UserRouter = require('./Router/User')


app.use('/api/users', UserRouter);



app.listen(Port, () => {
    console.log('server chạy tại port 3000')
})