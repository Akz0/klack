import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import App from './containers/App/App'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import { FirebaseAuth } from './utilities/firebase'
import { connect } from 'react-redux'
import { clearUser, LoadingUser, setUser } from './reduxStore/actions/user'
import Spinner from './components/Spinner'
/**
* @author
* @function Root
**/

class Root extends React.Component {
    componentDidMount() {
        FirebaseAuth.onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user)
                this.props.history.push('/')
            }else{
                this.props.history.push('/login')
                this.props.clearUser()
            }
        })
    }

    render() {

        return (
            this.props.loading
                ?<Spinner/>
                : 
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                </Switch>
        )


    }
}

const mapDisptachToProps = dispatch => {
    return {
        loadingUser:()=>dispatch(LoadingUser()),
        setUser: (user) => dispatch(setUser(user)),
        clearUser:()=>dispatch(clearUser())
    }
}
const mapStateToProps = state => {
    return {
        loading: state.user.isLoading
    }
}
const RootWithRouter = withRouter(connect(mapStateToProps, mapDisptachToProps)(Root))
export default RootWithRouter