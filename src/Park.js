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
                isAlive: true,
                timer: null
        };
        this.handleFeed = this.handleFeed.bind(this);
        this.changeToHungry = this.changeToHungry.bind(this);
        this.changeToSick = this.changeToSick.bind(this);
        this.timeOutFunction = this.timeOutFunction.bind(this);
        this.handleCure = this.handleCure.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.saveGame = this.saveGame.bind(this);
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
            this.murderDinosaur();
          }, 3000); 
          this.setState({murderTimerId: murderTimer});
        }, 3000);
        this.setState({timer: timer});
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

      async fetchData() {
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

      async componentDidMount() {
        this.fetchData();
        
      }

      componentWillUnmount() {
        if (this.state.timer) {
          clearTimeout(this.state.timer);
          this.setState({timer: null});
        } if (this.state.murderTimerId) {
          clearTimeout(this.state.murderTimerId)
          this.setState({murderTimerId: null})
        }
      }

      changeToSick() {
          const sickDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
              ...dinosaur, 
              health: false,
              happiness: false,
              photo: 'https://i.ibb.co/bHkhGPV/dino-sick.png'
          }))
          this.setState(prevState => {
            return {dinosaurs: sickDinosaurArray}
          });
        }

      changeToHungry() {
        const hungryDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: false,
            happiness: false,
            photo: 'https://i.ibb.co/LQzkDNZ/dino-hungry.png'
        }))
        this.setState(prevState => {
          return {dinosaurs: hungryDinosaurArray}
        });
      }

      handleFeed() {
        if (!this.state.dinosaurs[0].fullness) {
          const fullDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            fullness: true,
            happiness: true,
            photo: 'https://i.ibb.co/89mddTZ/dino.png'
          }));
          this.setState({dinosaurs: fullDinosaurArray}, this.timeOutFunction);
          clearTimeout(this.state.murderTimerId);
        }
      }
      
      handleCure() {
        if (!this.state.dinosaurs[0].health) {
          const healthyDinosaurArray = this.state.dinosaurs.map(dinosaur => ({
            ...dinosaur, 
            health: true,
            happiness: true,
            photo: 'https://i.ibb.co/89mddTZ/dino.png'
        }));
          this.setState({dinosaurs: healthyDinosaurArray}, this.timeOutFunction);
          clearTimeout(this.state.murderTimerId);
        }
      }
      
      startNewGame() {
        fetch('/api/dinosaur', {
          method: 'DELETE',
          headers: {
            'X-XSRF-TOKEN': this.state.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        .then(() => {
          this.setState({dinosaurs: [], isAlive: true}, this.fetchData);
        })
        clearTimeout(this.state.murderTimerId);
        clearTimeout(this.state.timer);
      }
      
      saveGame() {
        const updatedDinosaur = this.state.dinosaurs[0];
        fetch('/api/dinosaur/' + (updatedDinosaur.id), {
          method: 'PUT',
          headers: {
            'X-XSRF-TOKEN': this.state.csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDinosaur),
          credentials: 'include'
        });
        this.props.history.push('/');
      }

      render() {
        const dinosaurs = this.state.dinosaurs;

        const unhappyWarning = this.state.dinosaurs.map((dinosaur) => {
          if (!dinosaur.happiness && this.state.isAlive) {
            return <h4>Oh no, your dinosaur is unhappy! You should try to help him...</h4>
          }
        })

          return (
            <>
                {unhappyWarning}
                { !this.state.isAlive ? (
                  <h4>Your dinosaur is dead. RIP.</h4> ) : ( null
                )}
                <Dinosaur dinosaurs={dinosaurs}/>
                <Button disabled={!this.state.isAlive} onClick={this.handleFeed}>Feed me!</Button>
                <Button disabled={!this.state.isAlive} onClick={this.handleCure}>Cure me!</Button>
                <Button disabled={!this.state.isAlive} onClick={this.saveGame}>Save and end the game</Button>
                <Button onClick={this.startNewGame}>Start new game</Button>
            </>
          )
      }

}

export default withCookies(withRouter(Park));
