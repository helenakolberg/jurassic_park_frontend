import React, {Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import './Park.css';

class Park extends Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

      constructor(props) {
        super(props);
        const {cookies} = props;

        this.state = {
                dinosaurs: [], 
                csrfToken: cookies.get('XSRF-TOKEN'), 
                isLoading: true
            };
      }

      componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/dinosaur', {credentials: 'include'})
          .then(response => response.json())
          .then(dinosaurs => this.setState({dinosaurs, isLoading: false}))
          .catch(err => console.log(err));
        //   .catch(() => this.props.history.push('/'));
      }

      render() {
        const dinosaur = this.state.dinosaurs.map((dinosaur) => {
            return <img src={dinosaur.photo} />
        })

          return (
            <>
                <p>{dinosaur}</p>
            </>
          )
      }

}

export default withCookies(withRouter(Park));
