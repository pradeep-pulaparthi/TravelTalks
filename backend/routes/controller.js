const express=require('express')
const router=express.Router();
const {CreateUser,ValidateUser,SendOTP,VerifyOtp,getAllHotels,getHotelReviews,postHotelReview}=require('../controllers/hotel')
router.post('/',ValidateUser).post('/signup/otp',SendOTP).post('/signup/verify',VerifyOtp);
router.post('/signup',CreateUser);
module.exports=router;