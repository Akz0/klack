import { combineReducers } from "redux"
import { SET_COLORS } from "../actions/types"
import ChannelReducer from "./channel"
import UserReducer from "./user"


const initColorState={
    primaryColor:'#800080',
    secondaryColor:'#eee'
}

const colorsReducer=(state=initColorState,action)=>{
    switch(action.type){
        case SET_COLORS:
        return {
            primaryColor:action.payload.primary,
            secondaryColor:action.payload.secondary
        }
        default:return state;
    }
}
const RootReducer=combineReducers({
    user:UserReducer,
    channel:ChannelReducer,
    colors:colorsReducer,
})
export default RootReducer
