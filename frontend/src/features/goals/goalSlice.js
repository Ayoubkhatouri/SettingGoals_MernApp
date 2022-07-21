
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import goalService from './goalService'




const initialState={
    goals:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:''
}

// create new goal
export const  createGoal=createAsyncThunk('goals/create',async(goalData,thunkAPI)=>{ //with thunkAPI we can get anathing from the state
    try {
        const token=thunkAPI.getState().auth.user.token
        return await goalService.createGoal(goalData,token)
    } catch (error) {
        const message=(error.response &&  error.response.data && error.response.data.message) 
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Get User goals
export const getGoals=createAsyncThunk('goals/getAll',async( _ ,thunkAPI)=>{ // the _ means that we dont pass eny data
    try {
        const token=thunkAPI.getState().auth.user.token
        return await goalService.getGoals(token) 
    } catch (error) {
        const message=(error.response &&  error.response.data && error.response.data.message) 
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Dlete user goal
export const  deleteGoal=createAsyncThunk('goals/delete',async(id,thunkAPI)=>{ //with thunkAPI we can get anathing from the state
    try {
        const token=thunkAPI.getState().auth.user.token
        return await goalService.deleteGoal(id,token)
    } catch (error) {
        const message=(error.response &&  error.response.data && error.response.data.message) 
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const goalSlice=createSlice({
    name:'goal',
    initialState,
    reducers:{
        reset:(state)=> initialState //we reset everything like we did state.goal=[] and isError=false ...
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createGoal.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(createGoal.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.goals.push(action.payload)

        })
        .addCase(createGoal.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload 

        })

        .addCase(getGoals.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(getGoals.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.goals=action.payload

        })
        .addCase(getGoals.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload 

        })

        .addCase(deleteGoal.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(deleteGoal.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.goals=state.goals.filter((goal)=>goal._id !== action.payload.id) //so it delete from the UI 
                                                                        //in the same momoent without do a refresh
                                    //and we return from the server the id of deleted goal 
                                    // that's why we did action.payload.id
        })
        .addCase(deleteGoal.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload 

        })
    }
  

})

export const {reset}=goalSlice.actions
export default goalSlice.reducer