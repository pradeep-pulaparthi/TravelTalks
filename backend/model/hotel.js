const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
    name: String,
    reviews: [
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
        },
    ],
});
module.exports=mongoose.model('Reviews', hotelSchema);
