const mongoose=require('mongoose')

const connectHotelDB=async(url)=>{
    try {
        await mongoose.connect(url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })   
        console.log("Hotel DataBase connected successfully....");
    } catch (error) {
        console.log("An error Occured while connecting Hotel DB...",error);
    }
}

module.exports=connectHotelDB;