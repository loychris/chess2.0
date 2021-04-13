import React, { Component } from 'react';

import './App.css';

import background from './background.mp4'

import Tile from './components/tile/tile'; 
import Piece from './components/peace/peace'; 
import MoveOption from './components/moveOption/moveOption';


const ORIGINAL_BOARD = [
  'bq:D0', 'bk:D15', 'bb1:C0','bb2:C15', 'bn1:B0', 'bn2:B15', 'br1:A0', 'br2:A15',
  'bp1:A1', 'bp2:B1', 'bp3:C1', 'bp4:D1', 'bp5:A14', 'bp6:B14', 'bp7:C14', 'bp8:D14', 
  'wq:D7', 'wk:D8', 'wb1:C7', 'wb2:C8', 'wn1:B7', 'wn2:B8', 'wr1:A7', 'wr2:A8',
  'wp1:A6', 'wp2:B6', 'wp3:C6', 'wp4:D6', 'wp5:A9', 'wp6:B9', 'wp7:C9', 'wp8:D9',
]

const ROOK_DIRECTIONS = [[1,0],[-1,0],[0,-1],[0,1]];
const BISHOP_DIRECTIONS = [[1,1],[1,-1],[-1,-1],[-1,1]];
const KNIGHT_DIRECTIONS = [[2,1],[2,-1],[1,2],[1,-2],[-2,1],[-2,-1],[-1,2],[-1,-2]];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      moves: [], 
      possibleMoves: [],
      next: 'w',
      last: 'b',
      boardState: ORIGINAL_BOARD, 
      player: 'w'
    }
  }

  getLegalMoves = (pos) => {
    let possibleMoves = []; 
    const piece = this.state.boardState.find(p => p.split(':')[1] === pos);
    if(!piece) return possibleMoves; 
    const color = piece.charAt(0);
    const row = Number(pos.substring(1, pos.length));
    const col = this.letterToNumber(pos.charAt(0));
    switch(piece.charAt(1)){
      case 'p': 
        const pawnNr = Number(piece.charAt(2));
        let dir = (color === 'w' && pawnNr > 4) || (color === 'b' && pawnNr < 5) ? 1 : -1;
        let target = `${pos.charAt(0)}${row+dir}`
        //doubleMove
        let target2 = `${pos.charAt(0)}${row+dir*2}`
        if((color === 'w' && (row === 6 || row === 9)) || (color === 'b' && (row === 1 || row === 14))){
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
      case 'b': 
        for(let i = 0;i<4;i++){
          let end = false;
          for(let radius = 1; radius<4; radius++){
            const newCol = this.numberToLetter(col+radius*BISHOP_DIRECTIONS[i][0]);
            const newRow = ((row+16+radius*BISHOP_DIRECTIONS[i][1]) % 16);
            const newPos = `${newCol}${newRow}`
            if(newCol === null){
              end = true;
              continue;
            }
            const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
            if(end) continue;
            if(block){
              if(block.charAt(0) !== color){
                possibleMoves.push(newPos)
              }
              end = true;
              continue;
            }
            possibleMoves.push(newPos); 
          }
        }
        break;
      case 'q': 
      for(let i = 0;i<4;i++){
        let end = false;
        for(let radius = 1; radius<15; radius++){
          const newCol = this.numberToLetter(col+radius*ROOK_DIRECTIONS[i][0]);
          const newRow = ((row+16+radius*ROOK_DIRECTIONS[i][1]) % 16);
          const newPos = `${newCol}${newRow}`
          if(newCol === null){
            end = true;
            continue;
          }
          const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
          if(end) continue;
          if(block){
            if(block.charAt(0) !== color){
              possibleMoves.push(newPos)
            }
            end = true;
            continue;
          }
          possibleMoves.push(newPos); 
        }
      }
      for(let i = 0;i<4;i++){
        let end = false;
        for(let radius = 1; radius<4; radius++){
          const newCol = this.numberToLetter(col+radius*BISHOP_DIRECTIONS[i][0]);
          const newRow = ((row+16+radius*BISHOP_DIRECTIONS[i][1]) % 16);
          const newPos = `${newCol}${newRow}`
          if(newCol === null){
            end = true;
            continue;
          }
          const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
          if(end) continue;
          if(block){
            if(block.charAt(0) !== color){
              possibleMoves.push(newPos)
            }
            end = true;
            continue;
          }
          possibleMoves.push(newPos); 
        }
      }
      break;
      case 'k': 
          for(let i = 0;i<4;i++){
              const newCol = this.numberToLetter(col+1*ROOK_DIRECTIONS[i][0]);
              const newRow = ((row+16+1*ROOK_DIRECTIONS[i][1]) % 16);
              const newPos = `${newCol}${newRow}`
              if(newCol === null){
                continue;
              }
              const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
              if(block){
                if(block.charAt(0) !== color){
                  possibleMoves.push(newPos)
                }
                continue;
              }
              possibleMoves.push(newPos); 
          }
          // bishop moves
          for(let i = 0;i<4;i++){
            let end = false;
            const newCol = this.numberToLetter(col+1*BISHOP_DIRECTIONS[i][0]);
            const newRow = ((row+16+1*BISHOP_DIRECTIONS[i][1]) % 16);
            const newPos = `${newCol}${newRow}`
            if(newCol === null){
              end = true;
              continue;
            }
            const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
            if(end) continue;
            if(block){
              if(block.charAt(0) !== color){
                possibleMoves.push(newPos)
              }
              end = true;
              continue;
            }
            possibleMoves.push(newPos); 
          }
        break;
      case 'r': 
        for(let i = 0;i<4;i++){
          let end = false;
          for(let radius = 1; radius<15; radius++){
            const newCol = this.numberToLetter(col+radius*ROOK_DIRECTIONS[i][0]);
            const newRow = ((row+16+radius*ROOK_DIRECTIONS[i][1]) % 16);
            const newPos = `${newCol}${newRow}`
            if(newCol === null){
              end = true;
              continue;
            }
            const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
            if(end) continue;
            if(block){
              if(block.charAt(0) !== color){
                possibleMoves.push(newPos)
              }
              end = true;
              continue;
            }
            possibleMoves.push(newPos); 
          }
        }
        break;
      case 'n': 
      
      for(let i = 0;i<8;i++){
          
          const newCol = this.numberToLetter(col+1*KNIGHT_DIRECTIONS[i][0]);
          const newRow = ((row+16+1*KNIGHT_DIRECTIONS[i][1]) % 16);
          const newPos = `${newCol}${newRow}`
          if(newCol === null){
            continue;
          }
          const block = this.state.boardState.find(p => p.split(':')[1] === newPos);
          if(block){
            if(block.charAt(0) !== color){

              possibleMoves.push(newPos)
            }
            continue;
          }
          possibleMoves.push(newPos); 
      }
      
      
      
      break;
    }
    return [...new Set(possibleMoves)];
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
        const nextNew = this.state.last; 
        const lastNew = this.state.next
        const movesNew = [...this.state.moves, `${pos}`]
        console.log(this.state.last, lastNew)
        console.log(this.state.next, nextNew)
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
        key={kind}
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
      for(let i=0;i<16;i++){
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
    return this.state.possibleMoves.map(position => {
      return (
        <MoveOption 
          position={position}
          key={position}/>
      )
    })
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
