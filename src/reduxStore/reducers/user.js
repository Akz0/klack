
import { UserConstants } from "../actions/types"
const initialUserState={
    currentUser:null,
    isLoading:true
}
const UserReducer=(state=initialUserState,action)=>{
    switch(action.type){
        case UserConstants.SET_USER:
            state={
                currentUser:action.payload.currentUser,
                isLoading:false
            }
            break;
        case UserConstants.CLEAR_USER:
            state={
                currentUser:null,
                isLoading:false,
            }
            break;
        case UserConstants.LOADING_USER:
            state={
                ...state,
                isLoading:true
            }
            break;
        default:return state
    }
    return state
}

export default UserReducer