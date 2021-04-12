import React, { Component } from 'react';
import * as classes from './tile.module.css';


const BOARD_WIDTH = 1000;
const PIECE_HEIGHT = 90;


class Tile extends Component {


    getStyles = (pos) => {
        let styles = {}
        styles.transform = `rotate(${(pos+4)*22.5}deg)`;
        return styles;
    }

    transform = (input) => {
        return `${input * BOARD_WIDTH / 1000}`
    }

    
    

    render() {
        const pos = Number(this.props.position.substring(1,this.props.position.length)); 
        console.log(pos)
        const posLetter = this.props.position.substring(1,0);
        const ring = posLetter === 'A' ? 0 : posLetter === 'B' ? 1 : posLetter === 'C' ? 2 : 3;
        let color = (pos+ring) % 2 === 0 ? "#eeeeee" : '#111111';
        if(this.props.selected) color = '#ff0000'; 
        let width = posLetter === 'A' ? 500 : posLetter === 'B' ? 425 : posLetter === 'C' ? 350 : 275;
        let height = posLetter === 'A' ? 192 : posLetter === 'B' ? 164 : posLetter === 'C' ? 135 : 106;
        let d = posLetter === 'A' 
            ? "M0.000736121 192C-0.109493 127.967 12.1578 62.8497 38.191 0L107.482 28.7012C85.3405 82.1558 74.9139 137.54 75.0204 192H0.000736121Z"
            : posLetter === 'B' 
            ? "M75.0749 163.038C75.1019 116.581 84.4376 70.9316 102 28.7013L32.7092 1.52588e-05C11.408 51.2562 0.0862503 106.657 0.0552673 163.038H75.0749Z"
            : posLetter === 'C' 
            ? "M26.6298 0.338867C8.87659 43.181 0 88.8342 0 134.487H75C75 98.6038 81.9796 62.7201 95.9388 29.0476L26.6298 0.338867Z"
            : "M21.0662 0.254639C7.49438 32.8079 0 68.5288 0 106H75C75 78.698 80.4707 52.6737 90.3755 28.9635L21.0662 0.254639Z";
        return(
            <div 
                style={this.getStyles(pos)} 
                className={classes.tile} 
                onClick={
                    this.props.couldMoveThere 
                    ? () => this.props.move(this.props.position) 
                    : () => console.log('Illegal move')}>
                <svg 
                    width={this.transform(width)}  
                    height={this.transform(height)} 
                    viewBox={`0 0 ${this.transform(width)} ${this.transform(height)}`} 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path 
                        className={classes.path}
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d={d}
                        fill= {color} 
                        onClick={this.props.clicked}/>
                </svg>
            </div>
        )
    }
}

export default Tile;