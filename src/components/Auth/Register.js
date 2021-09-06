import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase, { FirebaseAuth } from '../../utilities/firebase'
import md5 from 'md5'
import { Grid, Form, Segment, Button, Icon, Header, Message } from 'semantic-ui-react'
import { Helmet } from 'react-helmet'
/**
* @author
* @class Register
**/

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }


    handleInputError = (inputName) => {
        return this.state.errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ""
    }
    isFormEmpty = ({ username, password, passwordConfirm, email }) => {
        return !username.length || !password.length || !passwordConfirm.length || !email.length
    }
    isPasswordValid = ({ password, passwordConfirm }) => {
        if (password.length < 6 || passwordConfirm.length < 6) {
            return false
        }
        if (password !== passwordConfirm) {
            return false
        }
        return true
    }
    isFormValid = () => {
        let errors = [];
        let error
        if (this.isFormEmpty(this.state)) {
            error = { message: 'Please fill the form' }
            this.setState({ errors: errors.concat(error) })
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Invalid Password' }
            this.setState({ errors: errors.concat(error) })
        } else {
            this.setState({ errors: [] })
            return true
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    saveUser = (user) => {
        return this.state.userRef.child(user.user.uid).set({
            name: user.user.displayName,
            avatar: user.user.photoURL
        })
    }
    handleSubmit = (event) => {

        event.preventDefault()
        if (this.isFormValid()) {
            this.setState({ loading: true })
            FirebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(user => {

                console.log(user)
                user.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(user.user.email)}?d=identicon`
                }).then(() => {
                    this.saveUser(user).then(() => {
                        this.setState({ loading: false })
                        console.log('User Saved.')
                        this.setState({
                            username: "",
                            email: "",
                            password: "",
                            passwordConfirm: "",
                            errors: []
                        })
                    })
                }).catch(error => {
                    console.error(error)
                    this.setState({ loading: false, errors: this.state.errors.concat(error) })
                })
            }).catch(error => {
                console.error(error)
                this.setState({ loading: false, errors: this.state.errors.concat(error) })
            })
        }
    }

    render() {
        const errors = this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)
        return (
            <React.Fragment>
                <Helmet>
                    <title>
                        Klack - Register
                    </title>
                </Helmet>
                <Grid textAlign="center" verticalAlign="middle" style={{ background: 'transparent' }}>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h1" icon color="violet" textAlign="center" >
                            {/*comment alternate outline - object ungroup  -  handshake outline   */}
                            <Icon name="comment alternate outline" color="violet" />
                            Klack
                        </Header>
                        <Form size="large" onSubmit={event => this.handleSubmit(event)}>
                            <Segment stacked>
                                <Form.Input className={this.handleInputError("username")} value={this.state.username} fluid name="username" icon="user" iconPosition="left" placeholder="Username" type="text" onChange={(event) => { this.handleChange(event) }} />
                                <Form.Input className={this.handleInputError("email")} value={this.state.email} fluid name="email" icon="mail" iconPosition="left" placeholder="Email" type="email" onChange={(event) => { this.handleChange(event) }} />
                                <Form.Input className={this.handleInputError("password")} value={this.state.password} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={(event) => { this.handleChange(event) }} />
                                <Form.Input className={this.handleInputError("password")} value={this.state.passwordConfirm} fluid name="passwordConfirm" icon="repeat" iconPosition="left" placeholder="Confirm Password" type="password" onChange={(event) => { this.handleChange(event) }} />
                                <Button disabled={this.state.loading} className={this.state.loading ? 'loading' : ''} color="violet" size="large" fluid>Register</Button>
                            </Segment>

                        </Form>
                        {this.state.errors.length > 0 ? <Message error>{errors}</Message> : null}
                        <Message style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center" }}>
                            <Link to="/login">Already a user? Log In</Link>
                        </Message>



                        <Button disabled={this.state.loading} className={this.state.loading ? 'loading' : ''} onClick={() => {
                            console.log('Demo')
                        }} color="pink">Demo</Button>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}


Register.propTypes = {}
export default Register