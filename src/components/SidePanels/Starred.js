import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Label, Menu } from 'semantic-ui-react'
import { SetCurrentChannel, SetPrivateChannel } from '../../reduxStore/actions/channels'
import firebase from '../../utilities/firebase'

/**
* @author
* @class Starred
**/

class Starred extends Component {
    state = {
        starredChannels:[],
        activeChannel:'',
        user:this.props.currentUser,
        usersRef:firebase.database().ref('users')
    }


    componentDidMount(){
        if(this.state.user){
            this.addListeners(this.state.user.uid)
        }
    }

    // Listens to the Users Ref in the starred channels for any new changes
    addListeners=(userUID)=>{

        // Adds the marked channels to the list when it is starred
        this.state.usersRef.child(userUID).child('starred').on('child_added',snap=>{
            const starredChannel={id:snap.key,...snap.val()}
            this.setState({
                starredChannels:[...this.state.starredChannels,starredChannel]
            })
        })
        // Removes the unmarked channels from the list when it is starred
        this.state.usersRef.child(userUID).child('starred').on('child_removed',snap=>{
            const channelToRemove ={id:snap.key,...snap.val()}
            const filteredChannels=this.state.starredChannels.filter(channel=>{
                return channel.id!==channelToRemove.id
            })
            this.setState({starredChannels:filteredChannels})
        })
    }

    setActiveChannel=(id)=>{
        this.setState({activeChannel:id})
    }

    changeChannel=channel=>{
        this.setActiveChannel(channel.id)
        // this.clearNotifications();
        this.props.setCurrentChannel(channel)
        this.props.setPrivateChannel()
        // this.setState({channel:channel})
    }

    displayChannels=(starredChannels)=>{
        return starredChannels.length>0 && starredChannels.map(channel=>{
            return <Menu.Item key={channel.id} onClick={()=>this.changeChannel(channel)} active={channel.id===this.state.activeChannel} style={{opacity:0.7}}>
                {/* {this.getNotificationsCount(channel) && <Label color="red">{this.getNotificationsCount(channel)}</Label>} */}
                # {channel.name}
            </Menu.Item>
        })
    }

    render() {
        const {starredChannels}=this.state
        return (
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span >
                            <Icon name="star" style={{marginBottom:'20px'}}/> Marked
                        </span>{"  "}
                    </Menu.Item>
                        {this.displayChannels(starredChannels)}
                </Menu.Menu>
        )
    }
}

const mapDisptachToProps=dispatch=>{
    return {
        setCurrentChannel:(channel)=>dispatch(SetCurrentChannel(channel)),
        setPrivateChannel:()=>dispatch(SetPrivateChannel(false))
    }
}

export default connect(null,mapDisptachToProps)(Starred)