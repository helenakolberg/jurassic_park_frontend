import React, { Component } from 'react';
import './App.css';
import Home from './Home.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Park from './Park.js';

class App extends Component {

  state = {
    isLoading: true,
    dinosaurs: []
  }

  async componentDidMount() {
    const response = await fetch('/api/dinosaur');
    const body = await response.json();
    this.setState({ groups: body, isLoading: false });
  }

  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/park' exact={true} component={Park}/>
          </Switch>
        </Router>
      </CookiesProvider>
    )
  }

}

export default App;
