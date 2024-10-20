const hotel = require('../model/hotel');
const Hotel=require('../model/hotel')

const getAllHotels=async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
}
const getHotelReviews=async (req, res) => {
    const { hotelId } = req.params;
    const { sort } = req.query;

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        let sortedReviews = hotel.reviews;

        // Sorting logic
        if (sort === 'name') {
            sortedReviews = sortedReviews.sort((a, b) => a.user.localeCompare(b.user));
        } else if (sort === 'rating') {
            sortedReviews = sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'date') {
            sortedReviews = sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        res.json({ hotelName: hotel.name, reviews: sortedReviews });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
}
const postHotelReview=async (req, res) => {
    const { hotelId } = req.params;
    const { user, rating, comment } = req.body;
    try {
        const hotel = await Hotel.findById(hotelId);
        const email=req.session.user.email;
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        const existingReviewIndex = hotel.reviews.findIndex(review => review.email === email);
        if (existingReviewIndex > -1) {
            // Update existing review
            hotel.reviews[existingReviewIndex].name=user;
            hotel.reviews[existingReviewIndex].rating = rating;
            hotel.reviews[existingReviewIndex].comment = comment;
            await hotel.save();
        }
        else
        {
            hotel.reviews.push({ user, rating, comment,email });
            await hotel.save();
        }
        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
}
const deleteHotel=async(req,res)=>{
    const {hotelId}=req.params;
    try {
        if(!hotelId)
        {
            console.log("Invalid Id");
            return res.status(400).json({message:"Invalid hotel Not provided"});
        }
        if(await hotel.findOne({_id:hotelId})){
            await hotel.deleteOne({_id:hotelId});
            console.log(`Hotel with ${hotelId} is deleted`);
            return res.status(200).json({message:"deleted successfully",success:true});
        }
        return res.status(400).json({success:false,message:"Invalid Id"});
    } 
    catch (error) {
        return res.status(400).json({message:"Something went wrong"});
    }
}
const createHotel=async (req,res)=>{
    try {
        const {name}=req.body;
        if(!name)
            return res.status(400).json({message:"Name is Empty",success:false})
        await hotel.create({name:name});
        console.log(`Hotel ${name} is created `)
        res.status(200).json({message:"Hotel added successfully",success:true})
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Name is Empty",success:false})
    }
}
const updateHotel=async(req,res)=>{
    const {name}=req.body;
    const {hotelId}=req.params;
    console.log(name,hotelId)
    try{
        if(!name)
            return res.status(400).json({message:"Name should not be null"});
        if(await hotel.findOne({_id:hotelId}))
        {
            await hotel.updateOne({_id:hotelId},{$set:{name:name}},{
                runValidators:true
            });
            res.status(200).json({success:true});
        }
        else{
            res.status(400).json({success:false,message:"No such Hotel Exists"});
        }
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"Something went wrong"});
    }
}
module.exports={getAllHotels,getHotelReviews,postHotelReview,deleteHotel,createHotel,updateHotel};