import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';


class Dinosaur extends Component {
    constructor () {
        super();
    }

    render() {
        const dinosaur = this.props.dinosaurs.map((dinosaur, index) => {
             return <img className="dinosaur-image" key={index} src={dinosaur.photo} />
        })

        return (
            <>
             {dinosaur}
            </>
        )
    }

}

export default Dinosaur;