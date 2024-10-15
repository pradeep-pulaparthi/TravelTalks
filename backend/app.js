const express=require('express')
const app=express()
const connectDB = require("./db/connect");
const router=require('./routes/controller')
require('dotenv').config()

app.use(express.json())
app.use(express.static('../frontend'));


app.use('/api/v1/hotels',router);
const start=async()=>{
    try {
        await connectDB(process.env.MONGOURI);
        console.log("Data base connected Sucessfully");
        let port=process.env.port;
        app.listen(port,console.log(`app is runnig on ${port}....`));
    } catch (error) {
        console.log(error.message);
    }
}
start()