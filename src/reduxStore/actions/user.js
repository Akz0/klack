import { SET_COLORS, UserConstants } from "./types"

export const setUser=user=>{
    return {
        type:UserConstants.SET_USER,
        payload:{
            currentUser:user
        }
    }
}

export const clearUser=()=>{
    return {
        type:UserConstants.CLEAR_USER
    }
}

export const LoadingUser=()=>{
    return {
        type:UserConstants.LOADING_USER
    }
}

export const SetColors=(primary,secondary)=>{
    return {
        type:SET_COLORS,
        payload:{
            primary,secondary
        }
        
    }
}