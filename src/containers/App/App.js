import './App.css';
import { Grid } from 'semantic-ui-react';

import ColorPanel from '../Color/ColorPanel';
import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';
import MetaPanel from '../MetaPanel/MetaPanel';
import { connect } from 'react-redux';

import React, { Component } from 'react'
import { Helmet } from 'react-helmet';

/**
* @author
* @class App
**/

class App extends Component {
    state = {}
    render() {
        const {user,currentChannel,isPrivateChannel,userPosts,primaryColor,secondaryColor}=this.props
        return (
            <React.Fragment>
                <Helmet><title>Klack Chat</title></Helmet>
                <Grid className="app" columns="equal" style={{background:secondaryColor}}>
                <ColorPanel key={user && user.name} currentUser={user}/>
                <SidePanel currentUser={user} key={user && user.uid} primaryColor={primaryColor}/>
    
                <Grid.Column style={{ marginLeft: 320 }}>
                    <Messages isPrivateChannel={isPrivateChannel} currentChannel={currentChannel} currentUser={user} key={currentChannel && currentChannel.id}/>
                </Grid.Column>
    
                <Grid.Column width={4}>
                    <MetaPanel 
                        isPrivateChannel={isPrivateChannel}
                        userPosts={userPosts}
                        key={currentChannel && currentChannel.name}
                        currentChannel={currentChannel}
                    />
                </Grid.Column>
    
            </Grid>
            </React.Fragment>
        );
    }
}



const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        currentChannel:state.channel.currentChannel,
        isPrivateChannel:state.channel.isPrivateChannel,
        userPosts:state.channel.userPosts,
        primaryColor:state.colors.primaryColor,
        secondaryColor:state.colors.secondaryColor
    }
}

export default connect(mapStateToProps, null)(App);
