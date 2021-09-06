import React, { Component } from 'react'
import { Button, Input, Segment } from 'semantic-ui-react'
import firebase from '../../utilities/firebase'
import FileModal from './FileModal'
import ProgressBar from './ProgressBar'
import './messages.css'
/**
* @author
* @class MessagesForm
**/

class MessagesForm extends Component {
    state = {
        storageRef: firebase.storage().ref(),
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0
    }
    openModal = () => {
        this.setState({ modal: true })
    }
    closeModal = () => {
        this.setState({ modal: false })
    }
    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    createMessage = (url=null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL,
            }
        }
        if(url){
            message['image']=url

        }else{
            message['content']=this.state.message
        }
        return message
    }

    getPath=()=>{
        if(this.props.isPrivateChannel){
            return `chat/private-${this.state.channel.id}`
        }else{
            return `chat/public`
        }
    }
    sendMessage = () => {
        const { getMessagesRef } = this.props
        const { message, channel } = this.state
        if (message) {
            getMessagesRef().child(channel.id).push().set(this.createMessage()).then(() => {
                this.setState({
                    message: '',
                    loading: false,
                    errors: []
                })
            }).catch(error => {
                console.error(error)
                this.setState({
                    message: '',
                    loading: false,
                    errors: this.state.errors.concat(error)
                })
            })
        } else {
            this.setState({
                message: '',
                loading: false,
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }
    sendFileMessage=(url, ref, PathToUpload)=>{
        ref.child(PathToUpload).push().set(this.createMessage(url)).then(()=>{
            this.setState({uploadState:'done'})
        }).catch(error => {
            this.setState({
                errors:this.state.errors.concat(error)
            })
        })
    }
    uploadFile = (file, metadata) => {
        const PathToUpload = this.state.channel.id
        const ref = this.props.getMessagesRef()
        const filePath = `${this.getPath()}/${file.name+Math.random().toString()}.jpg`
        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUpload = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                this.props.isProgressBarVisible(percentUpload)
                this.setState({ percentUploaded: percentUpload })
            }, error => {
                console.log(error)
                this.setState({
                    errors: this.state.errors.concat(error),
                    uploadState: 'error',
                    uploadTask: null
                })
            }, () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(url => {
                    this.sendFileMessage(url, ref, PathToUpload)
                    this.props.isProgressBarVisible(0)
                }).catch(error => {
                    console.log(error)
                    this.setState({
                        errors: this.state.errors.concat(error),
                        uploadState: 'error',
                        uploadTask: null
                    })
                })
            })
        })
    }
    render() {
        return (

            <Segment className="message__form">
                <Segment.Group>
                    <Input
                        fluid
                        name="message"
                        onChange={(event) => this.handleInput(event)}
                        value={this.state.message}
                        className={
                            this.state.errors.some(error => error.message.includes('message')) ? 'error' : ''
                        }
                        placeholder={this.state.errors.some(error => error.message.includes('message')) ? 'Empty Message' : 'Type your message....'}
                        style={{ marginBotton: "0.7em" }}
                        label={<Button icon="add" />}
                        labelPosition="left" />
                </Segment.Group>
                <Button.Group icon widths="2">
                    <Button icon="edit" onClick={this.sendMessage} content="Add reply" labelPosition="left" color="orange" />
                    <Button icon="cloud upload" disabled={this.state.uploadState==='uploading'}content="Upload Media" onClick={this.openModal} labelPosition="right" color="grey" />
                </Button.Group>

                <FileModal
                    closeModal={this.closeModal}
                    modal={this.state.modal}
                    uploadFile={this.uploadFile}
                />
                <ProgressBar uploadState={this.state.uploadState} percentUploaded={this.state.percentUploaded}/>
            </Segment>


        )
    }
}


export default MessagesForm