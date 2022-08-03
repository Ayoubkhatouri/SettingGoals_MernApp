const path=require('path')
const express=require('express')
const { errrHandler } = require('./middleware/errorMidlleware')
const colors=require('colors')
const connectDB =require('./config/db')
const dotenv=require('dotenv').config()
const cors =require('cors')

const port =process.env.PORT || 5000

connectDB()
const app=express()

//to use middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//this is for cors setup headers 
app.use(cors({
    origin:'http://localhost:3000' //this is from frontend
}))

app.use('/api/goals',require('./routes/goalRoutes'))
app.use('/api/users',require('./routes/userRoutes'))

//Serve frontend
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/build'))) //that gonna be our static folder

    app.get('*',(req,resp)=>resp.sendFile(path.resolve(__dirname,'../','frontend','build','index.html')))
}
else{
    app.get('/',(req,resp)=>resp.send('Please set to production'))
}

app.use(errrHandler)

app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})