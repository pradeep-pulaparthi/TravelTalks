const express=require('express')
const router=express.Router();
const {getAllHotels,getHotelReviews,postHotelReview,deleteHotel,createHotel, updateHotel}=require('../controllers/reviews')

router.get('/getAll', getAllHotels);
router.get('/:hotelId/reviews', getHotelReviews);
router.post('/:hotelId/reviews', postHotelReview);
router.delete('/:hotelId',deleteHotel);
router.post('/',createHotel)
router.patch('/:hotelId',updateHotel)
module.exports=router;