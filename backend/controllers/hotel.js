const model=require('../model/model')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
require('dotenv').config()

const {userValidationSchema}=require('../ValidationSchema/uservalidation')

const otpStore={}
const ValidateUser=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await model.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"Invalid Credentials!!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({message:"Login Successful"}); 
        console.log(`User: ${email} Logged in`);
    } catch (error) {
        res.status(400).json({message:"Something went wrong"});
        console.log(error.message);
    }
}
const CreateUser= async (req,res)=>{
    try{
        const {email,password,retype}=req.body;
        console.log(email+"\n"+password+"\n"+retype);
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
            return res.status(201).json({message:"User Created Successfully"});
        }
        res.status(400).json({message: "Email already Exists!!"});
    }
    catch(error){
        res.status(400).json({message:"Can't able create User"});
    }
}
const SendOTP=async (req,res)=>{
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
            to: req.body.to,
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
    console.log("Hello from verify otp");
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email].expiresAt > Date.now()) {
        if (otpStore[email].otp === parseInt(otp)) {
            delete otpStore[email]; 
            console.log("success");
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } else {
        return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }
}
module.exports={CreateUser,ValidateUser,SendOTP,VerifyOtp};