
import { ChannelConstants } from "../actions/types"
const initialState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null,
    isLoading: false
}

const ChannelReducer = (state = initialState, action) => {
    switch (action.type) {
        case ChannelConstants.SET_CURRENT_CHANNEL:
            state = {
                ...state,
                currentChannel: action.payload.channel
            }
            break;
        case ChannelConstants.SET_PRIVATE_CHANNEL:
            state = {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
            break;
        case ChannelConstants.SET_USER_POSTS:
            state = {
                ...state,
                userPosts: action.payload.userPosts
            }
            break;
        default: return state
    }
    return state
}

export default ChannelReducer