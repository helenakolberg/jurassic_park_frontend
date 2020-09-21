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

      async createNewDinosaur() {
        const newDinosaur = JSON.stringify({
          name: 'Tyrannosaurus Rex',
          photo: 'https://www.pinclipart.com/picdir/big/409-4092141_jurassic-world-high-quality-transparent-background-dinosaur-png.png',
          happiness: true,
          fullness: true,
          health: true
        })

        await fetch('api/dinosaur', {
          method: 'POST',
                body: newDinosaur,
                headers: {
                  'X-XSRF-TOKEN': this.state.csrfToken,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include'
        })
        .then(response => response.json())
        .then(dinosaur => this.setState({dinosaurs: [dinosaur], isLoading: false}))
      }

      async componentDidMount() {
        console.log('test', this.props.match.params.id);
        this.setState({isLoading: true});

        await fetch('api/dinosaur', {credentials: 'include'})
          .then((response) => {
           return response.json()
          })

          .then((dinosaurs) => {
            console.log('dinosaurs', dinosaurs)

            if (dinosaurs.length === 0) {
              this.createNewDinosaur();
            }

            // if (dinosaurs === []) {
              // return fetch('api/dinosaur', {
              //   method: 'POST',
              //   body: {
              //     name: 'Tyrannosaurus Rex',
              //     photo: 'https://www.pinclipart.com/picdir/big/409-4092141_jurassic-world-high-quality-transparent-background-dinosaur-png.png',
              //     happiness: true,
              //     fullness: true,
              //     health: true
              //   },
              //   headers: {
              //     'X-XSRF-TOKEN': this.csrfToken,
              //     'Accept': 'application/json',
              //     'Content-Type': 'application/json'
              //   },
              //   credentials: 'include'
              // })
            //   .then(res => {
            //     console.log('new fetch response', res)
            //     res.json()
            //   })
            //   .then(fetch('api/dinosaur', {
            //     credentials: 'include'
            //   }))
            //   .then(response => response.json())
            //   .then(dinosaurs => this.setState({dinosaurs, isLoading: false}))
            //   .catch(err => console.log(err));
            // }            
            return this.setState({dinosaurs, isLoading: false})
          })
          .catch(err => console.log(err));
      }

      render() {
        console.log('render dinosaur', this.state.dinosaurs);
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
