const path = require('path');

const model=require('../model/model')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const session=require('express-session')
require('dotenv').config()

const {userValidationSchema}=require('../ValidationSchema/uservalidation')

const otpStore={}
const ValidateUser=async (req,res)=>{
    try {
        const {password}=req.body;
        const email=req.body.email.toLowerCase();
        //console.log(email,password);
        const user=await model.findOne({email});
        if(!user)
        {
            return res.status(401).json({message:"Invalid Credentials!!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        req.session.user = { id: user._id, email: user.email };
        res.redirect('/api/v1/hotels/review'); 
        console.log(`User: ${email} Logged in`);
    } catch (error) {
        res.status(400).json({message:"Something went wrong"});
        console.log(error.message);
    }
}
const CreateUser= async (req,res)=>{
    try{
        const {password,retype}=req.body;
        const email=req.body.email.toLowerCase();
        if(password!==retype)
            return res.status(400).json({message:"Retype Password Doesn't match"});
        const {error}=userValidationSchema.validate({email,password});
        if(error)
        {
            return res.status(400).json({message:error.details[0].message});
        }
        const existingUser=await model.findOne({email});
        if(!existingUser)
        {
            const user= new model({
                email: email,
                password:password
            })
            user.save();
            req.session.user = { id: user._id, username: user.email };
            return res.status(201).json({message:"User Created Successfully",success:true});
        }
        res.status(400).json({message: "Email already Exists!!"});
    }
    catch(error){
        res.status(400).json({message:"Can't able create User"});
    }
}
const SendOTP=async (req,res)=>{
    const email=req.body.to;
    const user=await model.findOne({email});
    console.log(email);
    console.log(user);
    
    if(!user===false){
        return res.status(400).json({success:false,message:"Email already Exists!"});
    }
    const transporter= nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILID,
            pass: process.env.PASSWORD  
        }
    })
    const otp=Math.floor(10000*Math.random()+1000*Math.random()+100*Math.random()+10*Math.random())%100000;
    try{
        console.log("Email sending...")
        const mailOptions={
            from: process.env.MAILID,
            to: email,
            sub: "Otp for Registration",
            text: `Your otp is ${otp}\n Don't share it with anyone`,
        }
        await transporter.sendMail(mailOptions);
        res.status(200).json({success:true});
        console.log("Mail Sent successfully");
        otpStore[req.body.to]={otp,expiresAt:Date.now()+60*1000};
        setTimeout(()=>{
            delete otpStore[req.body.to]
        },2*60*1000+3);
    }
    catch(error){
        res.status(500).json({success:false});
        console.log("Mail not sent\n",error);
    }
}
const VerifyOtp= async(req,res)=>{
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email].expiresAt > Date.now()) {
        if (otpStore[email].otp === parseInt(otp)) {
            delete otpStore[email]; 
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } else {
        return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }
}
module.exports={CreateUser,ValidateUser,SendOTP,VerifyOtp};