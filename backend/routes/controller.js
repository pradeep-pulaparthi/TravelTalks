const express=require('express')
const path=require('path')
require('dotenv').config()
const router=express.Router();
const {CreateUser,ValidateUser,SendOTP,VerifyOtp}=require('../controllers/hotel')
router.post('/',ValidateUser).post('/signup/otp',SendOTP).post('/signup/verify',VerifyOtp);
router.post('/signup',CreateUser);
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // If the user is authenticated, proceed to the next middleware
    } else {
        res.redirect('/'); // If not authenticated, redirect to login page
    }
}
router.get('/review',ensureAuthenticated,(req,res)=>{
    if(req.session.user.email==='pradeeppulaparthi99@gmail.com')
    {
        //console.log('Hello');
        return res.sendFile(path.join(__dirname,'../private/admin_review.html'));
    }
    res.sendFile(path.join(__dirname,'../private/review.html'));
})

module.exports=router;