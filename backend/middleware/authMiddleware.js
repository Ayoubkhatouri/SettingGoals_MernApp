const jwt =require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User =require('../models/userModel')

const protect=asyncHandler(async(req,resp,next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){//cause when the token is send  
                                                                    //in Auth header is start with Bearer + the token
        try {
            //get token from header
            token=req.headers.authorization.split(' ')[1] 
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET) //we give it the token and the code used 
                                                                //it return an object with the  id of user 
                                                                //cause we code the id
            //get user from the token
            req.user = await User.findById(decoded.id).select('-password')//we dont want the password
            next()
        } catch (error) {
            console.log(error)
            resp.status(401)
            throw new Error("Not authorized")
        }
    }
    if(!token){
        resp.status(401)
        throw new  Error("Not authorized, no token")
    }
         })

module.exports={protect}