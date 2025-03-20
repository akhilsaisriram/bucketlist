const express = require('express');
const router=express.Router();
const jwt = require('jsonwebtoken');

const User=require('../models/users');
const users = require('../models/users');
const jwtAuth =require('../middleware/jwt');
router.post('/register',async (req, res) =>{
  console.log("reg")
    try{
        
        const {username,email,password, phone} = req.body;
       
        let exist = await User.findOne({email})
   

        if(exist){
            return res.status(400).send('User Already Exist')
        }
       
        let newUser = new User({
            username,email,password, phone
        })

        await newUser.save();
        console.log("sign up updated");
        
        res.status(200).send('Registered Successfully')
       
    }
    catch(err){
        console.log(err)
        return res.status(500).send('Internel Server Error')
    }
})
router.post('/login',async (req, res) => {
    try{   console.log("ok in")
        const {email,password} = req.body;
        let exist = await users.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist._id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              console.log("ok");
              
              return res.status(200).json({token})
          }  
            )
         
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})


router.get('/profile', jwtAuth,async (req, res, next) => {
    try {
        let user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});
module.exports=router