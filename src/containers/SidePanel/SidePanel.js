import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Channels from '../../components/SidePanels/Channels'
import UserPanel from '../../components/SidePanels/UserPanel'
import DirectMessages from '../../components/SidePanels/DirectMessages'
import Starred from '../../components/SidePanels/Starred'

/**
* @author
* @class SidePane
**/

class SidePane extends Component {
    state = {}
    render() {
        const primaryColor=this.props.primaryColor
        const user=this.props.currentUser
        return (
            <Menu size="large" inverted fixed="left" vertical style={{background:primaryColor,fontSize:'1.3rem'}}>
                <UserPanel user={user} primaryColor={primaryColor}/>
                <Starred currentUser={user}/>
                <Channels creator={user}/>
                <DirectMessages currentUser={user}/>
            </Menu>
        )
    }
}


export default SidePane