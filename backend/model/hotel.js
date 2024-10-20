const { string, required } = require('joi');
const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:[true,"Name can't be Null"]
    },
    reviews: {
        type:
            [
                {
                    user: {
                        type:String,
                        required:[true,"cannot post without an username"]
                    },
                    rating: {
                        type:Number,
                        required:[true,"Please rate before posting"]
                    },
                    comment: String,
                    date: { type: Date, default: Date.now },
                    email:{
                        type: String,
                        required:[true,"Required your email"],
                        unique:true
                    }
                },
            ],
        default:[]
    }
});
module.exports=mongoose.model('Reviews', hotelSchema);
