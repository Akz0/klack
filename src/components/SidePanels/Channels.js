import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Icon, Input, Label, Menu, Modal } from 'semantic-ui-react'
import { SetCurrentChannel, SetPrivateChannel } from '../../reduxStore/actions/channels'
import firebase from '../../utilities/firebase'

/**
* @author
* @class Channels
**/

class Channels extends Component {
    state = {
        channels: [],
        channel:null,
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef:firebase.database().ref('messages'),
        notifications:[],
        firstLoad:true,
        activeChannel:''
    }

    componentDidMount(){
        this.addListeners()
    }
    componentWillUnmount(){
        this.removeListeners()
    }

    // Modal Actions
    closeModal = () => {
        this.setState({ modal: false })
    }
    openModal = () => {
        this.setState({ modal: true })
    }

    //Creation of Channels
    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    isFormValid = ({ channelDetails, channelName }) => {
        return channelDetails && channelName
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.addChannel()
        }
    }
    addChannel = () => {
        const { channelsRef, channelDetails, channelName } = this.state
        const key = channelsRef.push().key
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: this.props.creator.displayName,
                avatar: this.props.creator.photoURL,
            }
        }
        channelsRef.child(key).update(newChannel).then(() => {
            this.setState({
                modal: false,
                channelName: '',
                channelDetails: '',
            })
        })
    }

    //Other Loaders
    addListeners=()=>{
        let loadedChannels=[];
        this.state.channelsRef.on('child_added',snap=>{
            loadedChannels.push(snap.val())
            this.setState({channels:loadedChannels},()=>{
                this.setFirstChannel()
            })
            this.addNotificationsListener(snap.key)
        })
    }
    addNotificationsListener=channelID=>{
        this.state.messagesRef.child(channelID).on('value',snap=>{
            if(this.state.channel){
                this.handleNotifications(channelID,this.state.channel.id,this.state.notifications,snap)
            }
        })
    }
    handleNotifications=(channelID,curerntChannelID,notifications,snap)=>{
        let lastTotal=0;
        let index=notifications.findIndex(notification=>notification.id===channelID)
        if(index!==-1){
            if(channelID!==curerntChannelID){
                lastTotal=notifications[index].total;
                if(snap.numChildren()-lastTotal>0){
                    notifications[index].count=snap.numChildren()-lastTotal;
                }
            }
            notifications[index].lastKnownTotal=snap.numChildren()
        }else{
            notifications.push({
                id:channelID,
                total:snap.numChildren(),
                lastKnownTotal:snap.numChildren(),
                count:0,
            })
        }
        this.setState({notifications:notifications})
    }
    removeListeners=()=>{
        this.state.channelsRef.off()
        console.log('ListenerRemoved')
    }
    setFirstChannel=()=>{
        const firstChannel=this.state.channels[0]
        if(this.state.firstLoad && this.state.channels.length>0){
            this.props.setCurrentChannel(firstChannel)
            this.setState({channel:firstChannel})
            this.setState({activeChannel:firstChannel.id})
        }
        this.setState({firstLoad:false})
    }
   
    setActiveChannel=(id)=>{
        this.setState({activeChannel:id})
    }

    changeChannel=channel=>{
        this.setActiveChannel(channel.id)
        this.clearNotifications();
        this.props.setCurrentChannel(channel)
        this.props.setPrivateChannel()
        this.setState({channel:channel})
    }

    clearNotifications=()=>{
        let index=this.state.notifications.findIndex(notification=>notification.id===this.state.channel.id)
        if(index!==-1){
            let updatedNotifications=[...this.state.notifications]
            updatedNotifications[index].total=this.state.notifications[index].lastKnownTotal
            updatedNotifications[index].count=0;
            this.setState({notifications:updatedNotifications})
        }
    }


    getNotificationsCount=channel=>{
        let count=0;
        this.state.notifications.forEach(notification=>{
            if(notification.id===channel.id){
                count=notification.count
            }
        })
        if(count > 0) return count
    }
    displayChannels=(channels)=>{
        return channels.length>0 && channels.map(channel=>{
            return <Menu.Item key={channel.id} onClick={()=>this.changeChannel(channel)} active={channel.id===this.state.activeChannel} style={{opacity:0.7}}>
                {this.getNotificationsCount(channel) && <Label color="red">{this.getNotificationsCount(channel)}</Label>}
                # {channel.name}
            </Menu.Item>
        })
    }



    render() {

        const { channels } = this.state
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span >
                            <Icon name="bullhorn" style={{marginBottom:'20px'}}/> Channels
                        </span>{"  "}
                        ({channels.length})<Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                        {this.displayChannels(channels)}

                </Menu.Menu>

                <Modal basic open={this.state.modal} onClose={this.closeModal}>
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

                </Modal>
            </React.Fragment>
        )
    }
}

const mapDisptachToProps=dispatch=>{
    return {
        setCurrentChannel:(channel)=>dispatch(SetCurrentChannel(channel)),
        setPrivateChannel:()=>dispatch(SetPrivateChannel(false))
    }
}

export default connect(null,mapDisptachToProps)(Channels)