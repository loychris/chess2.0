import React, { Component } from 'react';
import * as classes from './tile.module.css';


class Tile extends Component {

    render() {
        return(
            <div className={classes.tile} onClick={this.props.clicked}>
                
            </div>
        )
    }
}

export default Tile;