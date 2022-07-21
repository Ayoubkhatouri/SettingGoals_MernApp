import axios from 'axios'


const API_URl='http://localhost:5000/api/users/' //it gonna look at localhost:5000 not 3000 cause we set the proxy in package.json

//Register user
const register=async(userData)=>{
    const response=await axios.post(API_URl,userData)

    if(response.data){
        localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data
}

//Login user
const login=async(userData)=>{
    const response=await axios.post(API_URl + 'login',userData)

    if(response.data){
        localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data
}

//Logout user
const logout=()=>{
    localStorage.removeItem ('user')
}




const authService={
    register,
    logout,
    login
}
export default authService