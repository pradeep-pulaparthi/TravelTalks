const express=require('express')
const router=express.Router();
const {getAllHotels,getHotelReviews,postHotelReview}=require('../controllers/reviews')
router.get('/', getAllHotels);
router.get('/:hotelId/reviews', getHotelReviews);
router.post('/:hotelId/reviews', postHotelReview);
module.exports=router;