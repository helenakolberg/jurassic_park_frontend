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
                isLoading: true,
                murderTimerId: null,
                isAlive: true
            };
        this.handleFeed = this.handleFeed.bind(this);
        this.changeToHungry = this.changeToHungry.bind(this);
        this.changeToSick = this.changeToSick.bind(this);
        this.timeOutFunction = this.timeOutFunction.bind(this);
        this.handleCure = this.handleCure.bind(this);
      }

      murderDinosaur() {
        const murderedDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
          ...dinosaur, 
          fullness: false,
          happiness: false,
          health: false,
          photo: 'https://i.ibb.co/Q9PgHRQ/dino-dead.png'
      }))
      this.setState({dinosaurs: murderedDinosaurArray});
      this.setState({isAlive: false});
      }

      timeOutFunction() {
        const randomState = Math.floor(Math.random() * 2) + 1;
        const timer = setTimeout(() => {
          if (randomState === 1) {
            this.changeToHungry();
          } 
          if (randomState === 2) {
            this.changeToSick();
          }

          const murderTimer = setTimeout(() => {
            console.log("dead dinosaur")
            this.murderDinosaur();
          }, 3000); 
          this.setState({murderTimerId: murderTimer});
        }, 3000);
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

          
          this.timeOutFunction();
      }

      changeToSick() {
        console.log("call of change to sick");
          const sickDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
              ...dinosaur, 
              health: false,
              happiness: false,
              photo: 'https://i.ibb.co/bHkhGPV/dino-sick.png'
          }))
          this.setState({dinosaurs: sickDinosaurArray});
          // const interval = setInterval(() => {
          //     this.setState({dinosaurs: hungryDinosaurArray})
          // }, 10000)
          console.log(this.state.dinosaurs);
        }

      changeToHungry() {
        const hungryDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: false,
            happiness: false,
            photo: 'https://i.ibb.co/LQzkDNZ/dino-hungry.png'
        }))
        this.setState({dinosaurs: hungryDinosaurArray});
        
        // const interval = setInterval(() => {
        //     this.setState({dinosaurs: hungryDinosaurArray})
        // }, 5000)
        // console.log("change to hungry:", this.state.dinosaurs)
      }

      handleFeed() {
        if (!this.state.dinosaurs[0].fullness) {
          const fullDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: true,
            happiness: true,
            photo: 'https://i.ibb.co/89mddTZ/dino.png'
          }));
          this.setState({dinosaurs: fullDinosaurArray});
        }
        this.timeOutFunction();
        clearTimeout(this.state.murderTimerId);
      }
      
      handleCure() {
        if (!this.state.dinosaurs[0].health) {
          const healthyDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            health: true,
            happiness: true,
            photo: 'https://i.ibb.co/89mddTZ/dino.png'
          }));
          this.setState({dinosaurs: healthyDinosaurArray});
        }
        this.timeOutFunction();
        clearTimeout(this.state.murderTimerId);
      }
      

      render() {
        // const dinosaur = this.state.dinosaurs.map((dinosaur) => {
        //     return <img src={dinosaur.photo} />
        // })
        const dinosaurs = this.state.dinosaurs;

        

          return (
            <>
                <Dinosaur dinosaurs={dinosaurs}/>
                <Button disabled={!this.state.isAlive} onClick={this.handleFeed}>Feed me!</Button>
                <Button disabled={!this.state.isAlive} onClick={this.handleCure}>Cure me!</Button>
                <Button disabled={!this.state.isAlive}>Save and end the game</Button>
                <Button>Start new game</Button>
            </>
          )
      }

}

export default withCookies(withRouter(Park));
