import React, { Component } from 'react';
import classes from './moveOption.module.css';

const BOARD_WIDTH = 700;

class MoveOption extends Component {


    render() {
        const pos = Number(this.props.position.substring(1,this.props.position.length)); 
        const posLetter = this.props.position.substring(1,0);
        const ring = posLetter === 'A' ? 0 : posLetter === 'B' ? 1 : posLetter === 'C' ? 2 : 3;
        const radius = 0.5 * BOARD_WIDTH - (ring-2) * 75 - 0.5 * 75 
        const deg = (11.25 + 22.5*(pos)) - 90;
        const y = Math.cos(deg*Math.PI/180) * radius - 0.5 * 30;
        const x = Math.sin(deg*Math.PI/180) * radius - 0.5 * 30;
        const styles = {
            transform: `translate(${y}px, ${x}px)`
        }
        return <div className={classes.moveOption} style={styles} key={this.props.position}></div>
    }
}

export default MoveOption;