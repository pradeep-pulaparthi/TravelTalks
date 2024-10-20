const express=require('express')
const app=express()
const connectDB = require("./db/connect");
// const connectHotelDB=require('./db/hoteldb_connect')
const router=require('./routes/controller')
const hotelrouter=require('./routes/hotelcontroller')
require('dotenv').config()
const session=require('express-session')
app.use(express.json())
app.use(express.static('./frontend'));

app.use(session({
    secret: process.env.SECRET, // Change this to something secure
    resave: false,
    saveUninitialized: true,
}));
app.use('/api/v1/hotels',router);
app.use('/api/hotels',hotelrouter);
const start=async()=>{
    try {
        await connectDB(process.env.MONGOURI);
        console.log("Data base connected Sucessfully");
        // await connectHotelDB(process.env.HOTELURI);
        let port=process.env.port;
        app.listen(port,console.log(`app is runnig on ${port}....`));
    } catch (error) {
        console.log(error.message);
    }
}
start()