
import React from 'react'
import {useState,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {FaUser} from 'react-icons/fa'
import {register,reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

 
function Register() {

    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        password2:''
    })

    const {name,email,password,password2}=formData

    const navigate=useNavigate()
    const dispatch=useDispatch()

    const {user,isLoading, isError,isSuccess,message}=useSelector((state)=>state.auth) //this is from our localStorage

    useEffect(()=>{
        if(isError){
            toast.error(message)
        }
        if(isSuccess || user){ // means is logged in 
            navigate('/')
        }

        dispatch(reset()) //we reset everything

    },[user,isError,isSuccess,message,navigate,dispatch])

    const onchange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onSubmit=(e)=>{
        e.preventDefault()

        if(password !== password2){
            toast.error('Passwords do not match')
        }
        else {
            const userData={name,email,password}

            dispatch(register(userData))
        }
    }

    if(isLoading) 
    return <Spinner/>

  return (
    <>
    <section className='heading'>
        <h1>
        <FaUser/> Register
        </h1>
        <p>Please Create an account</p>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <input type="text" className="form-control" id='name' name='name' 
                value={name} placeholder='Enter your name' onChange={onchange}/>
            </div>
            <div className="form-group">
            <input type="email" className="form-control" id='email' name='email' 
                value={email} placeholder='Enter your email' onChange={onchange}/>
            </div>
            <div className="form-group">
            <input type="password" className="form-control" id='password' name='password' 
                value={password} placeholder='Enter your password' onChange={onchange}/>
            </div>
            <div className="form-group">
            <input type="password" className="form-control" id='password2' name='password2' 
                value={password2} placeholder='confirm ypur password' onChange={onchange}/>
            </div>
            
            <div className="form-group">
                <button type="submit" className='btn btn-block'>Submit</button>
            </div>
        </form>
    </section>
    </>
  )
}

export default Register