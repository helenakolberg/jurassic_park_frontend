import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { withCookies } from 'react-cookie';
import './Home.css';
import logo from './tyrannogochi_logo2.png';

class Home extends Component {

    state = {
        isLoading: true,
        isAuthenticated: false,
        user: undefined
      };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        if (body === '') {
          this.setState(({isAuthenticated: false}))
        } else {
          this.setState({isAuthenticated: true, user: JSON.parse(body)})
        }
      }

    login() {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8080';
        }
        window.location.href = '//' + window.location.hostname + port + '/private';
    }

    logout() {
        fetch('/api/logout', {method: 'POST', credentials: 'include',
        headers: {'X-XSRF-TOKEN': this.state.csrfToken}}).then(res => res.json())
            .then(response => {
        window.location.href = response.logoutUrl + "?id_token_hint=" +
            response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
        });
    }

    
    render() {
        const message = this.state.user ?
            <p className="welcome-headline">welcome, {this.state.user.name}</p> :
            <p className="welcome-headline">please log in to tyrannogotchi</p>;
        const button = this.state.isAuthenticated ?
            <div className="button-wrapper">
            <Button className="game-button"><Link className="route" to="/park">your park</Link></Button>
            <br/>
            <Button className="game-button" onClick={this.logout}>logout</Button>
            </div> :
            <Button className="game-button" onClick={this.login}>login</Button>;
        return (
            <Container id="home-container">
                {message}
                <img id="tyranno-logo" src={logo} />
                {button}
            </Container>
        );
    }
}

 export default withCookies(Home);