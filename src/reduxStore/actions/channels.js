import {ChannelConstants} from './types'

export const SetCurrentChannel=(channel)=>{
    return {
        type:ChannelConstants.SET_CURRENT_CHANNEL,
        payload:{
            channel
        }
    }
}

export const SetPrivateChannel=(isPrivateChannel)=>{
    return {
        type:ChannelConstants.SET_PRIVATE_CHANNEL,
        payload:{
            isPrivateChannel
        }
    }
}
export const SetUserPosts=(userPosts)=>{
    return {
        type:ChannelConstants.SET_USER_POSTS,
        payload:{
            userPosts
        }
    }
}