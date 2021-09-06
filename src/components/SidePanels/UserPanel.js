import React, { Component } from 'react'
import { Dropdown, Grid, Header, Icon, Image, Modal, Input, Button } from 'semantic-ui-react'
import firebase, { FirebaseAuth } from '../../utilities/firebase'
import AvatarEditor from 'react-avatar-editor'
/**
* @author
* @class UserPanel
**/

class UserPanel extends Component {

    state = {
        user: null,
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        uploadedCroppedImage: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    }

    componentDidMount() {
        this.setState({ user: this.props.user })
    }
    dropDownOptions = () => {
        return [
            {
                key: 'user',
                text: <span>Signed in as <strong>{this.state.user && this.state.user.displayName}</strong></span>,
                disabled: true
            }, {
                key: 'avatar',
                text: <span onClick={this.openModal}>Change Avatar</span>
            }, {
                key: 'signout',
                text: <span onClick={this.handleSignOut}>Sign Out</span>
            }
        ]
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }

    handleSignOut = () => {
        FirebaseAuth.signOut().then(() => {
            console.log('signout')
        })
    }

    handleFileUpload = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()

        if (file) {
            reader.readAsDataURL(file)
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result }, () => {
                    this.changeAvatar()
                })
            })
        }
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(() => {
                console.log('PhotoURL Updated')
                this.closeModal()
            })
            .catch(error => {
                console.error(error)
            })
        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadedCroppedImage })
            .then(() => {
                console.log('User Avatar Updated.')
            })
            .catch(error => {
                console.error(error)
            })
    }
    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob)
                this.setState({
                    croppedImage: imageUrl
                })
            })
        }
    }

    uploadAvatar = () => {
        const { storageRef, userRef, blob, metadata } = this.state
        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadUrl => {
                    this.setState({ uploadedCroppedImage: downloadUrl })
                })
            })
    }

    render() {
        const { modal, previewImage, croppedImage } = this.state
        return (
            <Grid style={{ background: 'transparent' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
                        {/* Main Header */}
                        <Icon inverted size="large" name="comment alternate outline" />
                        <Header inverted floated="left" as="h2">
                            <Header.Content>Klack</Header.Content>
                        </Header>
                        {/* User Options */}
                        <Header style={{ padding: '0.25em' }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={this.state.user ? this.state.user.photoURL : ''} spaced="right" avatar />
                                    {this.state.user ? this.state.user.displayName : ''}
                                </span>
                            } options={this.dropDownOptions()} />
                        </Header>
                    </Grid.Row>


                    {/* Change User Avatar Modal */}

                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input onChange={this.handleFileUpload} fluid type='file' label="New Avatar" name='previewImage' />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className='ui centered aligned grid'>
                                        {/* Image Preview */}
                                        {previewImage && (
                                            <AvatarEditor
                                                ref={node => (this.avatarEditor = node)}
                                                image={previewImage}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.3}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column className='ui centered aligned grid'>
                                        {/* Cropped Image Preview */}
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: '3.5rem auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage && (
                                <Button onClick={this.uploadAvatar} color='green' inverted>
                                    <Icon name='save' />Change Avatar
                                </Button>
                            )}

                            <Button onClick={this.handleCropImage} color='green' inverted>
                                <Icon name='image' />Preview
                            </Button>

                            <Button color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' />Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        )
    }
}


export default UserPanel