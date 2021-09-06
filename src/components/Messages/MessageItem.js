import moment from 'moment'
import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import './messages.css'
/**
* @author
* @function MessagesItem
**/

const isImage = (message) => {
    return message.hasOwnProperty('image')
}

const MessagesItem = (props) => {
    const { message, user } = props

    const isOwnMessage = () => {
        return message.user.id === user.uid ? 'message__self' : ''
    }
    const timeFromNow = () => {
        return moment(message.timestamp).fromNow()
    }
    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage()}>
                <Comment.Author as='a'>{message.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow()}</Comment.Metadata>
                {isImage(message)
                    ? <Image src={message.image} className="message__image" size="medium"/>
                    : <Comment.Text>{message.content}</Comment.Text>
                }
            </Comment.Content>
        </Comment>
    )

}

export default MessagesItem