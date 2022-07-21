const asyncHandler=require('express-async-handler')
const Goal=require('../models/goalModel')
const User =require('../models/userModel')

//@desc Get Goals
//route GET /api/goals
//@access Private
const getGoals=asyncHandler( async(req,resp)=>{
    const goals=await Goal.find({user:req.user.id}) 
    resp.status(200).json(goals)//here what we wanna return
})

//@desc Set Goals
//route Post /api/goals
//@access Private
const setGoals=asyncHandler( async(req,resp)=>{
    if(!req.body.text){
        resp.status(400)
        throw new Error('Please add a text field') //this is a middleware handlingError
    }
    const goal=await Goal.create({
        text:req.body.text, //we implement this in postmen 
        user:req.user.id,
    })

    resp.status(200).json(goal)
})

//@desc Update Goal
//route Put /api/goal/:id
//@access Private
const updateGoal=asyncHandler( async(req,resp)=>{
    const goal=await Goal.findById(req.params.id)
    if(!goal) {
        resp.status(400)
        throw new Error('Goal not Found')
    }

  

    //check for user
    if(!req.user){
        resp.status(401)
        throw new Error('User not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id){
        resp.status(401)
        throw new Error('User not found')
    }
    
    const updatedGoal=await Goal.findByIdAndUpdate(req.params.id,req.body,{new:true,})//the second argument is the data 
                                                                //and the 3 argument it will createed if not exist
    resp.status(200).json(updatedGoal)
})

//@desc Delete Goals
//route Delete /api/goals/:id
//@access Private
const deleteGoal=asyncHandler( async(req,resp)=>{
    const goal=await Goal.findById(req.params.id)
    if(!goal) {
        resp.status(400)
        throw new Error('Goal not Found')
    }

    //check for user
    if(!req.user){
        resp.status(401)
        throw new Error('User not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id){
        resp.status(401)
        throw new Error('User not found')
    }
    
   await goal.remove()
         
    resp.status(200).json({id:req.params.id})
})



module.exports={
    getGoals,
    setGoals,
    updateGoal,
    deleteGoal
}