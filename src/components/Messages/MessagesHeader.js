import React, { Component } from 'react'
import { Header, Icon, Input, Segment } from 'semantic-ui-react'
import './messages.css'
/**
* @author
* @class MessagesHeader
**/

class MessagesHeader extends Component {
    state = {}
    render() {
        const {channelName,users,handleSearch,searchLoading,isPrivateChannel,handleStar,isChannelStarred}=this.props
        return (
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{marginBotton:0}}>
                    <span>
                        {channelName?channelName:''}
                        {!isPrivateChannel && 
                            (
                                <Icon onClick={handleStar} 
                                    name={isChannelStarred?"star":"star outline" }
                                    color={isChannelStarred?"pink":"black" }
                                />
                            )
                        }
                    </span>
                    <Header.Subheader>{users}</Header.Subheader>
                </Header>
                {/* Search Channel for Messages */}
                <Header floated="right">
                    <Input size="mini" loading={searchLoading} icon="search" name="searchTerm" placeholder="Search Messages" onChange={handleSearch}/>
                </Header>

            </Segment>
        )
    }
}


export default MessagesHeader