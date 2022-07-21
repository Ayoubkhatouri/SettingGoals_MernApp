const express =require('express')
const router =express.Router()
const {getGoals,setGoals,updateGoal,deleteGoal}=require('../controllers/goalController')
const {protect} =require('../middleware/authMiddleware')

router.get('/',protect,getGoals)//we protect that route we can accsses only if we send the right token

router.post('/',protect,setGoals)

router.put('/:id',protect,updateGoal)

router.delete('/:id',protect,deleteGoal)

module.exports=router