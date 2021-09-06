import React, { Component } from 'react'
import { Button, Divider, Menu, Sidebar, Modal, Icon, Label, Segment } from 'semantic-ui-react'
import { SliderPicker } from 'react-color'
import firebase from '../../utilities/firebase'
import './colorpanel.css'
import { connect } from 'react-redux'
import { SetColors } from '../../reduxStore/actions'
/**
* @author
* @class ColorPanel
**/

class ColorPanel extends Component {
    state = {
        modal: false,
        userColors: [],
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListener(this.state.user.uid)
        }
    }
    addListener = userId => {
        let userColors = []
        this.state.usersRef
            .child(`${userId}/colors`)
            .on('child_added', snap => {
                userColors.unshift(snap.val())
                console.log('colors ::',userColors)
                this.setState({ userColors: userColors })
            })
    }
    openModal = () => this.setState({ modal: true })
    closeModal = () => this.setState({ modal: false })


    handleChangePrimary = (color) => this.setState({ primary: color.hex })
    handleChangeSecondary = (color) => this.setState({ secondary: color.hex })

    handleSave = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors(this.state.primary, this.state.secondary);
        }
    }

    saveColors = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primary, secondary
            })
            .then(() => {
                console.log('Colors Added')
                this.closeModal()
            })
            .catch(error => {
                console.error(error)
            })
    }

    displayUserColors=userColors=>{
        return userColors.length > 0 && userColors.map((color,i)=>{
            return (
                <React.Fragment key={i}>
                    <Divider/>
                    <div className="color__container" onClick={()=>this.props.setColors(color.primary,color.secondary)}>
                        <div className="color__square" style={{background:color.primary}}>
                            <div className="color__overlay" style={{background:color.secondary}}></div>
                        </div>
                    </div>
                </React.Fragment>
            )
        })
    }
    render() {
        const { modal, primary, secondary ,userColors} = this.state
        return (
            <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin" color="black" >
                <Divider />
                <Button icon="add" size="small" color="orange" onClick={this.openModal}></Button>

                {this.displayUserColors(userColors)}


                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <SliderPicker color={primary} onChange={this.handleChangePrimary} />
                        </Segment>
                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondary} />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSave}>
                            <Icon name='checkmark' /> Save
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name='remove' /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}

const mapDispatchToProps=dispatch=>{
    return {
        setColors:(primary,secondary)=>dispatch(SetColors(primary,secondary))
    }
}
export default  connect(null,mapDispatchToProps)(ColorPanel)