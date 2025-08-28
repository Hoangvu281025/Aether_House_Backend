const express = require('express');
const app = express();
const Port = 3000;
app.use(express.json());

const UserRouter = require('./Router/User')


app.use('/', UserRouter);



app.listen(Port, () => {
    console.log('server chạy tại port 3000')
})