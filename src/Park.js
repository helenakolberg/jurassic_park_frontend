import React, {Component, useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import './Park.css';
import Dinosaur from './Dinosaur';

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
        this.handleFeed = this.handleFeed.bind(this);
      }

      async createNewDinosaur() {
        const newDinosaur = JSON.stringify({
          name: 'Tyrannosaurus Rex',
          photo: 'https://i.ibb.co/89mddTZ/dino.png',
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
         
            return this.setState({dinosaurs, isLoading: false})
          })
          .catch(err => console.log(err));

          this.changeToHungry();
        
      }


      changeToHungry() {
        if (this.state.dinosaurs[0].happiness === true) {
          const hungryDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
              ...dinosaur, 
              fullness: false,
              happiness: false,
              photo: 'https://i.ibb.co/LQzkDNZ/dino-hungry.png'
          }))
          const interval = setInterval(() => {
              this.setState({dinosaurs: hungryDinosaurArray})
          }, 5000)
        }
      }

      handleFeed() {
        const fullDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
          ...dinosaur, 
          fullness: true,
          happiness: true,
          photo: 'https://i.ibb.co/89mddTZ/dino.png'
        }));
        this.setState({dinosaurs: fullDinosaurArray});
      }
      
      

      render() {
        // const dinosaur = this.state.dinosaurs.map((dinosaur) => {
        //     return <img src={dinosaur.photo} />
        // })
        const dinosaurs = this.state.dinosaurs;


          return (
            <>
                <Dinosaur dinosaurs={dinosaurs}/>
                <Button onClick={this.handleFeed}>Feed me!</Button>
            </>
          )
      }

}

export default withCookies(withRouter(Park));
