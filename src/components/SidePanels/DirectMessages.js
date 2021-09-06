import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Menu } from 'semantic-ui-react'
import { SetCurrentChannel, SetPrivateChannel } from '../../reduxStore/actions/channels'
import firebase from '../../utilities/firebase'

/**
* @author
* @class DirectMessages
**/

class DirectMessages extends Component {
    state = {
        users: [],
        currentUser: this.props.currentUser,
        activeDirects:'',
        modal: false,
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence'),
    }
    openModal = () => {
        this.setState({ modal: true })
    }
    closeModal = () => {
        this.setState({ modal: false })
    }
    componentDidMount = () => {
        if (this.state.currentUser) {
            this.addListeners(this.state.currentUser.uid)
        }
    }

    addListeners = (currentUser) => {
        let loadedusers = []
        this.state.usersRef.on('child_added', snap => {
            if (currentUser !== snap.key) {
                let user = snap.val()
                user['uid'] = snap.key;
                user['status'] = 'offline'
                loadedusers.push(user)
                this.setState({ users: loadedusers })
            }
        })
        this.state.connectedRef.on('value', snap => {
            if (snap.value === true) {
                const ref = this.state.presenceRef.child(currentUser)
                ref.set(true)
                ref.onDisconnect().remove(error => {
                    if (error !== null) {
                        console.log(error)
                    }
                })
            }
        })
        this.state.presenceRef.on('child_added', snap => {
            if (currentUser !== snap.key) {
                this.addStatusToUser(snap.key)
            }
        })
        this.state.presenceRef.on('child_removed', snap => {
            if (currentUser !== snap.key) {
                this.addStatusToUser(snap.key, false)
            }
        })

    }

    addStatusToUser = (userID, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userID) {
                user['status'] = `${connected ? "online" : "offline"}`
            }
            return acc.concat(user)
        }, [])
        this.setState({users:updatedUsers})
    }

    isUserOnline = (user) => {
        return user.status === 'online'
    }

    changeChannel=(user)=>{
        const channelID=this.getChannelID(user.uid);
        const channelData={
            id:channelID,
            name:user.name
        }
        this.props.setCurrentChannel(channelData)
        this.props.setPrivateChannel(true)
        this.setActiveChannel(user.uid)
    }
    setActiveChannel=(userUid)=>{
        this.setState({activeDirects:userUid})
    }
    getChannelID=userID=>{
        const currentUserID=this.state.currentUser.uid;
        return userID < currentUserID ? `${userID}/${currentUserID}` :`${currentUserID}/${userID}` 
    }
    render() {
        const { users ,activeDirects} = this.state
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span >
                            <Icon name="users" style={{ marginBottom: '20px' }} /> Directs
                        </span>{"  "}
                        ({users.length})<Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {users.map(user => {
                        return <Menu.Item
                            active={user.uid===activeDirects}
                            key={user.uid}
                            onClick={() => this.changeChannel(user)}
                            style={{ opacity: 0.7, fontStyle: 'italic' }}
                        >
                            <Icon name="circle" color={this.isUserOnline(user) ? 'green' : 'red'} />
                            @{user.name}
                        </Menu.Item>
                    })}
                </Menu.Menu>

                {/* <Modal basic open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header>Add New Channel</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <Input fluid label="Name of Channel" name="channelName" value={this.state.channelName} onChange={(event) => this.handleInput(event)} />
                            </Form.Field>
                            <Form.Field>
                                <Input fluid label="About Channel" name="channelDetails" value={this.state.channelDetails} onChange={(event) => this.handleInput(event)} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button type='submit' onClick={this.handleSubmit} color="green">
                            <Icon name="checkmark" /> Add
                        </Button>

                        <Button type='button' onClick={this.closeModal} inverted color="grey">
                            <Icon name="remove" /> Cancel
                        </Button>

                    </Modal.Actions>

                </Modal> */}
            </React.Fragment>
        )
    }
}

const mapDisptachToProps=(dispatch)=>{
    return {
        setCurrentChannel:(channelData)=>dispatch(SetCurrentChannel(channelData)),
        setPrivateChannel:()=>dispatch(SetPrivateChannel(true))
    }
}
export default connect(null,mapDisptachToProps)(DirectMessages)