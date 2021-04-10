import React, { Component } from 'react';

import './App.css';

import background from './background.mp4'

import Tile from './components/tile/tile'; 
import Piece from './components/peace/peace'; 


const BOARD_WIDTH = 700;

const ORIGINAL_BOARD = [
  'bq:D1', 'bk:D16', 'bb1:C1','bb2:C16', 'bn1:B1', 'bn2:B16', 'br1:A1', 'br2:A16',
  'bp1:A2', 'bp2:B2', 'bp3:C2', 'bp4:D2', 'bp5:A15', 'bp6:B15', 'bp7:C15', 'bp8:D15', 

  'wq:D8', 'wk:D9', 'wb1:C8', 'wb2:C9', 'wn1:B8', 'wn2:B9', 'wr1:A8', 'wr2:A9',
  'wp1:A7', 'wp2:B7', 'wp3:C7', 'wp4:D7', 'wp5:A10', 'wp6:B10', 'wp7:C10', 'wp8:D10',
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      moves: [], 
      possibleMoves: [],
      next: 'w',
      last: 's',
      boardState: ORIGINAL_BOARD, 
      player: 'w'
    }
  }

  getLegalMoves = (pos) => {
    let possibleMoves = []; 
    const piece = this.state.boardState.find(p => p.split(':')[1] === pos);
    if(!piece) return possibleMoves; 
    const color = piece.charAt(0);
    switch(piece.charAt(1)){
      case 'p': 
        const pawnNr = Number(piece.charAt(2));
        const row = Number(pos.substring(1, pos.length));
        let dir = (color === 'w' && pawnNr > 4) || (color === 'b' && pawnNr < 5) ? 1 : -1;
        let target = `${pos.charAt(0)}${row+dir}`
        //doubleMove
        let target2 = `${pos.charAt(0)}${row+dir*2}`
        if((color === 'w' && (row === 7 || row === 10)) || (color === 'b' && (row === 2 || row === 15))){
          if(!this.state.boardState.some(p => p.split(':')[1] === target2)){
            possibleMoves.push(target2);
          }
        }
        //blocked
        if(!this.state.boardState.some(p => p.split(':')[1] === target)){
          possibleMoves.push(target);
        } 
        //attack
        const rightRow = this.numberToLetter(this.letterToNumber(pos.charAt(0))+1);
        const leftRow = this.numberToLetter(this.letterToNumber(pos.charAt(0))-1);
        const rightAttackPos = `${rightRow}${row+dir}`
        const leftAttackPos = `${leftRow}${row+dir}`
        if(rightRow && this.state.boardState.some(p => p.split(':')[1] === rightAttackPos && p.charAt(0) === this.state.last)){
          possibleMoves.push(rightAttackPos);
        }
        if(leftRow && this.state.boardState.some(p => p.split(':')[1] === leftAttackPos && p.charAt(0) === this.state.last)){
          possibleMoves.push(leftAttackPos);
        }
        break;
      case 'q': console.log('queen'); break;
      case 'k': console.log('king'); break;
      case 'b': console.log('bishop'); break;
      case 'r': console.log('rook'); break;
      case 'n': console.log('knight'); break;
    }
    return possibleMoves;
  }

  letterToNumber = (letter) => {
    if(letter === 'A') return 1;
    if(letter === 'B') return 2;
    if(letter === 'C') return 3;
    if(letter === 'D') return 4;
    else return 999
  }

  numberToLetter = (number) => {
    if(number === 1) return 'A';
    if(number === 2) return 'B';
    if(number === 3) return 'C';
    if(number === 4) return 'D';
    return null;
  }

  clickTile = () => {
    console.log('Tile clicked');
  }

  selectPiece = (pos) => {
    this.setState({
      selected: pos,
      possibleMoves: this.getLegalMoves(pos),
    })
  }

  move = (pos) => {
    console.log('move to ', pos)
    const currentPiece = this.state.boardState.find(p => p.split(':')[1] === this.state.selected);
      if(currentPiece.charAt(0) === this.state.next){
        const attackedPiece = this.state.boardState.find(p => p.split(':')[1] === pos);
        const boardStateNew = [
          ...this.state.boardState.filter(p => p !== currentPiece && p !== attackedPiece),
          `${currentPiece.split(':')[0]}:${pos}`
        ]
        const nextNew = this.state.next === 'w' ? 'b' : 'w'; 
        const lastNew = this.state.next
        const movesNew = [...this.state.moves, `${pos}`]
        this.setState({
          boardState: boardStateNew,
          selected: null,
          possibleMoves: [], 
          next: nextNew,
          last: lastNew,
        })
      }else{
        // PREMOVE
        console.log('Wait your turn');
      }

  }

  getPieces = () => {
    return this.state.boardState.map(p => {
      const kind = p.split(':')[0]
      const pos = p.split(':')[1]
      return (
      <Piece 
        position={pos} 
        kind={kind} 
        key={pos}
        selected={this.state.selected===pos}
        select={this.selectPiece}
        canMoveHere={this.state.possibleMoves.some(t => t === pos)}
        />
      )
    })
  }

  

  getTiles = () => {
    return ["A","B","C","D"].map(c => {
      let circle = [];
      for(let i=1;i<17;i++){
        circle.push(
          <Tile
            move={this.move}
            position={c+i} 
            clicked={this.clickTitle} 
            key={c+i}
            selected={this.state.selected === c+i}
            couldMoveThere={this.state.possibleMoves.some(m => m === c+i)}
            />
        )
      }
      return circle;
    }).flat()
  }

  getPossibleMovesDots = () => {
    return this.state.possibleMoves.map(p => {
      const pos = Number(p.substring(1,p.length)); 
      const posLetter = p.substring(1,0);
      const ring = posLetter === 'A' ? 0 : posLetter === 'B' ? 1 : posLetter === 'C' ? 2 : 3;
      const radius = 0.5 * BOARD_WIDTH - (ring-2) * 75 - 0.5 * 75 
      const deg = (11.25 + 22.5*(pos-1)) - 90;
      const y = Math.cos(deg*Math.PI/180) * radius - 0.5 * 30;
      const x = Math.sin(deg*Math.PI/180) * radius - 0.5 * 30;
      const styles = {
          transform: `translate(${y}px, ${x}px)`
      }
      return <div className='couldMouveThere' style={styles} key={p}></div>
    });
  }


  render() {
    return (
      <div className="App">
        <video autoPlay muted loop id="myVideo">
          <source src={background} className='background' type="video/mp4"/>
        </video>
        <div className="board">
          <div className="pieces">
            { this.getPieces() }
          </div>
          <div className="tiles">
            { this.getTiles() }
            { this.getPossibleMovesDots() }
          </div>
        </div>
      </div>
    );
  }

}

export default App;
