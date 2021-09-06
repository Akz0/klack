import React, { Component } from 'react'
import { Comment, Segment } from 'semantic-ui-react'
import MessagesItem from '../../components/Messages/MessageItem'
import MessagesHeader from '../../components/Messages/MessagesHeader'
import MessagesForm from '../../components/Messages/MessagesForm'
import firebase from '../../utilities/firebase'
import { SetUserPosts } from '../../reduxStore/actions/channels'
import { connect } from 'react-redux'

/**
* @author
* @class Messages
**/

class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref('messages'),
        privateMessagesRef: firebase.database().ref('privateMessages'),
        usersRef: firebase.database().ref('users'),
        currentChannel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        progressBar: false,
        uniqueUsers: '',
        searchTerm: '',
        searchResults: [],
        searchLoading: false,
        isChannelStarred: false,
    }
    componentDidMount() {
        const { currentChannel, user } = this.state
        if (currentChannel && user) {
            this.addListeners(currentChannel.id)
            this.addUserStarsListeners(currentChannel.id, user.uid)
        }
    }
    getMessageRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state
        return privateChannel ? privateMessagesRef : messagesRef
    }
    handleSearchTerm = (event) => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => {
            this.handleSearchChange()
        })
    }
    handleSearchChange = () => {
        const channelMessages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({ searchResults: searchResults })
        setTimeout(() => {
            this.setState({ searchLoading: false })
        }, 1000);
    }
    addListeners = (channelID) => {
        this.addMessageListener(channelID)
    }
    // checks for starred channels on start or on load
    addUserStarsListeners = (channelID, userID) => {
        this.state.usersRef
            .child(userID)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIDs = Object.keys(data.val())
                    const prevStarred = channelIDs.includes(channelID)
                    this.setState({ isChannelStarred: prevStarred })
                }
            })
    }

    // Updates Messages data  as new Messages are added to the database
    addMessageListener = channelID => {
        let loadedMessages = []
        const ref = this.getMessageRef()
        ref.child(channelID).on('child_added', snap => {
            loadedMessages.push(snap.val())
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
        this.countUniqueUsers(loadedMessages)
        this.countUserPosts(loadedMessages)
    }

    countUniqueUsers = loadedMessages => {
        const uniqueUsers = loadedMessages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc
        }, [])
        const plural = uniqueUsers.length === 1 ? 'User' : 'Users'
        const number = `${uniqueUsers.length} ${plural}`
        this.setState({ uniqueUsers: number })
    }
    countUserPosts=loadedMessages=>{
        let userPosts=loadedMessages.reduce((acc,message)=>{
            if(message.user.name in acc){
                acc[message.user.name].count+=1
            }else{
                acc[message.user.name]={
                    avatar:message.user.avatar,
                    count:1,
                }
            }
            return acc
        },{})
        this.props.setUserPosts(userPosts)
    }

    isProgressBarVisible = percent => {
        if (percent > 0) {
            this.setState({ progressBar: true })
        }
        else {
            this.setState({ progressBar: false })

        }
    }
    //Handle Starred channels
    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => {
            this.starChannel()
        })
    }
    // check if the channel is starred or not, and add to list or remove from the list accordingly
    starChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef.child(`${this.state.user.uid}/starred`)
            .update({
                [this.state.currentChannel.id]: {
                    name: this.state.currentChannel.name,
                    details: this.state.currentChannel.details,
                    createdBy: {
                        name: this.state.currentChannel.createdBy.name,
                        avatar: this.state.currentChannel.createdBy.avatar,
                    }
                }
            })
        }
        else {
            this.state.usersRef.child(`${this.state.user.uid}/starred`).child(this.state.currentChannel.id).remove(error => {
                if (error !== null) {
                    console.error(error)
                }
            })
        }
    }
    displayMessages = (messages) => {
        return messages.length > 0 && messages.map(message => {
            return <MessagesItem key={message.timestamp} message={message} user={this.state.user}></MessagesItem>
        })
    }

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : ''
    }


    render() {
        const { messagesRef, currentChannel, user, progressBar, searchLoading, uniqueUsers, searchTerm, isPrivateChannel, isChannelStarred } = this.state
        return (
            <React.Fragment>
                <MessagesHeader
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                    isPrivateChannel={isPrivateChannel}
                    searchLoading={searchLoading}
                    handleSearch={this.handleSearchTerm}
                    users={uniqueUsers}
                    channelName={this.displayChannelName(currentChannel)} />

                <Segment>
                    <Comment.Group className={progressBar ? "messages__progress" : "messages"}>
                        {searchTerm ? this.displayMessages(this.state.searchResults) : this.displayMessages(this.state.messages)}
                    </Comment.Group>
                </Segment>

                <MessagesForm getMessagesRef={this.getMessageRef} isPrivateChannel={isPrivateChannel} isProgressBarVisible={this.isProgressBarVisible} messagesRef={messagesRef} currentChannel={currentChannel} currentUser={user} />

            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch=>{
    return {
        setUserPosts:(userPosts)=>dispatch(SetUserPosts(userPosts))
    }
}
export default connect(null,mapDispatchToProps)(Messages)