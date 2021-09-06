import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseAuth } from '../../utilities/firebase'
import { Grid, Form, Segment, Button, Icon, Header, Message } from 'semantic-ui-react'
import { Helmet } from 'react-helmet'
/**
* @author
* @class Login
**/

class Login extends Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    isFormValid = ({ email, password }) => {
        return email && password
    }
    handleSubmit = (event) => {

        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            FirebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password).then(user => {
                console.log(user)
                this.setState({ loading: false })
            }).catch(error => {
                console.log(error)
                this.setState({ errors: this.state.errors.concat(error), loading: false })
            })
        }
    }

    render() {
        const errors = this.state.errors.map((error, i) => <p key={i}>{error.message}</p>)
        return (
            <React.Fragment>
                <Helmet>
                    <title>
                        Klack - Log In
                    </title>
                </Helmet>
                <Grid textAlign="center" verticalAlign="middle" style={{ background: 'transparent' }}>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" icon color="violet" textAlign="center" >
                            {/*comment alternate outline - object ungroup  -  handshake outline   */}
                            <Icon name="comment alternate outline" color="violet" />
                            Klack
                        </Header>
                        <Form size="large" onSubmit={event => this.handleSubmit(event)}>
                            <Segment stacked>
                                <Form.Input value={this.state.email} fluid name="email" icon="mail" iconPosition="left" placeholder="Email" type="email" onChange={(event) => { this.handleChange(event) }} />
                                <Form.Input value={this.state.password} fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={(event) => { this.handleChange(event) }} />
                                <Button disabled={this.state.loading} className={this.state.loading ? 'loading' : ''} color="violet" size="large" fluid>Login</Button>
                            </Segment>

                        </Form>
                        {this.state.errors.length > 0 ? <Message error>{errors}</Message> : null}
                        <Message style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: "center" }}>
                            <Link to="/register">New User? Register Here</Link>
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


Login.propTypes = {}
export default Login