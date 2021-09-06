import React, { Component } from 'react'
import { Button, Icon, Input, Modal } from 'semantic-ui-react'
import mime from 'mime-types'
/**
* @author
* @class FileModal
**/

class FileModal extends Component {
    state = {
        file:null,
        authed:['image/jpeg','image/png'],
        errors:[]
    }
    addMedia=(event)=>{
        const file = event.target.files[0]
        if(file){
            this.setState({file:file})
        }
    }
    authorized=(file)=>{
        return this.state.authed.includes(mime.lookup(file))
    }
    sendFile=()=>{
        const {file} =this.state
        if(file!==null){
            if(this.authorized(file.name)){
                const metadata={
                    contentType:mime.lookup(file.name)
                }
                this.props.uploadFile(file,metadata);
                this.props.closeModal()
                this.setState({
                    file:null,
                    errors:[]
                })
                
            }else{
                this.setState({
                    errors:this.state.errors.concat({message:'Wrong File Type'})
                })
            }
        }
    }
    render() {
        return (
            <Modal basic open={this.props.modal} onClose={this.props.closeModal}>
                <Modal.Header>Select A Image File</Modal.Header>
                <Modal.Content>
                <Input fluid label="File Types : jpg , png ,gif" name="file" onChange={(event)=>{this.addMedia(event)}}type="file"/>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green"  onClick={this.sendFile}><Icon name="checkmark"/>Send</Button>
                    <Button color="grey" inverted onClick={this.props.closeModal}><Icon name="remove"/>Cancel</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


export default FileModal