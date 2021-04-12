import React, { Component } from 'react';
import * as classes from './piece.module.css';

import wp from './pngs/wp.png';
import wq from './pngs/wq.png';
import wk from './pngs/wk.png';
import wr from './pngs/wr.png';
import wn from './pngs/wn.png';
import wb from './pngs/wb.png';
import bp from './pngs/bp.png';
import bq from './pngs/bq.png';
import bk from './pngs/bk.png';
import br from './pngs/br.png';
import bn from './pngs/bn.png';
import bb from './pngs/bb.png';

const BOARD_WIDTH = 1000;
const PIECE_HEIGHT = 90;


class Piece extends Component {

    render() {
        let src;
        switch(this.props.kind){
            case 'wq': src = wq; break;
            case 'wk': src = wk; break;
            case 'wr1': src = wr; break;
            case 'wr2': src = wr; break;
            case 'wn1': src = wn; break;
            case 'wn2': src = wn; break;
            case 'wb1': src = wb; break;
            case 'wb2': src = wb; break;
            case 'wp1': src = wp; break;
            case 'wp2': src = wp; break;
            case 'wp3': src = wp; break;
            case 'wp4': src = wp; break;
            case 'wp5': src = wp; break;
            case 'wp6': src = wp; break;
            case 'wp7': src = wp; break;
            case 'wp8': src = wp; break;
            case 'bq': src = bq; break;
            case 'bk': src = bk; break;
            case 'br1': src = br; break;
            case 'br2': src = br; break;
            case 'bn1': src = bn; break;
            case 'bn2': src = bn; break;
            case 'bb1': src = bb; break;
            case 'bb2': src = bb; break;
            case 'bp1': src = bp; break;
            case 'bp2': src = bp; break;
            case 'bp3': src = bp; break;
            case 'bp4': src = bp; break;
            case 'bp5': src = bp; break;
            case 'bp6': src = bp; break;
            case 'bp7': src = bp; break;
            case 'bp8': src = bp; break;
            default: console.log('illegal peace!')
        }

        let styleClasses = [classes.piece];
        if(this.props.selected) styleClasses.push(classes.selected)

        const pos = Number(this.props.position.substring(1,this.props.position.length)); 
        const posLetter = this.props.position.substring(1,0);
        const ring = posLetter === 'A' ? 0 : posLetter === 'B' ? 1 : posLetter === 'C' ? 2 : 3;

        const radius = 0.5 * BOARD_WIDTH - ring * 75 - 0.5 * 75 
        const deg = (11.25 + 22.5*(pos)) - 90;
        const y = Math.cos(deg*Math.PI/180) * radius - 0.5 * PIECE_HEIGHT;
        const x = Math.sin(deg*Math.PI/180) * radius - 0.5 * PIECE_HEIGHT;
        const styles = {
            transform: `translate(${y}px, ${x}px)`
        }

        return(
            <div className={styleClasses.join(' ')} style={styles}>
                <img 
                    src={src} 
                    onClick={() => this.props.select(this.props.position)}
                    draggable="true"/>
            </div>
        )
    }
}

export default Piece;