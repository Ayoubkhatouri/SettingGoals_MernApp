const jwt =require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')



//@desc Register a new user
//route POST /api/users
//@access Public
const registerUser=asyncHandler( async(req,resp)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        resp.status(400)
        throw new Error('Please add all fields')
    }

    //check if user exists
    const userExists=await User.findOne({email})
    if(userExists){
        resp.status(400)
        throw new Error('user already exists')
    }

    // Hash password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    //creat user
    const user =await User.create({
        name,
        email,
        password:hashedPassword
    })

    if(user){
        resp.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id)
        })
    }
    else{
        resp.status(400)
        throw new Error('Invalid user data')
    }

})

//@desc Authenticate a user
//route POST /api/users/login
//@access Public
const loginUser=asyncHandler( async(req,resp)=>{
    const {email,password}=req.body
    //check for user email
    const user=await User.findOne({email})

    //check the password
    if(user && (await bcrypt.compare(password,user.password))){
        resp.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id)
        })
    }
    else{
        resp.status(400)
        throw new Error('Invalid credentials')
    }

    resp.json({message:'Login User'})
})

//@desc Get user data
//route GET /api/users/me
//@access Private
const getMe=asyncHandler( async(req,resp)=>{
    resp.status(200).json(req.user) //because we set that in the middlewareAuth
    

})

//Generate JWT(json web token)
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET , {expiresIn:'30d'}) //expire in 30 days
}

module.exports ={
    registerUser,
    loginUser,
    getMe
}