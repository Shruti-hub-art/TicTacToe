import React, { useState } from 'react';


function Square({value, color="white", onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick} style={{background: color}}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } 
  // Additional Feature: When no one wins, display a message about the result being a draw.
  else if (squares.every((square) => square)) {
    status = 'Draw';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Additional Feature: Use loops to make the squares instead of hardcoding them.
  // Additional Feature: Change the color of the winning squares.
  const board = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j;
      if (winner && winner.includes(squareIndex)) {
        row.push(
          <Square
            key={squareIndex}
            value={squares[squareIndex]}
            color="green"
            onSquareClick={() => handleClick(squareIndex)}
          />
        );
        continue;
      }
      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
        />
      );
    }
    board.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }
  return (
    <div>
      <div className="status">{status}</div>
      {board}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0,currentMove+1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    if (ascending) {
      move = history.length - 1 - move;
    }
    let description;
    // Additional Feature: Display the location for each move in the format (row, col) in the move history list.
    const playedLocation = move > 0 ? history[move].findIndex((square, index) => square !== history[move - 1][index]) : null;
    const x = playedLocation % 3;
    const y = Math.floor(playedLocation / 3);
    const playedCoordinates = '(' + x + ', ' + y + ')';
    
    if (move > 0) {
      description = 'Go to move #' + move + ' (' + (move % 2 === 0 ? 'O' : 'X') + ' played at ' + playedCoordinates + ')';
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove) {
      description = <b>{description}</b>;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return(
    <div className='game-container'>
      <div className='game-title'>Tic Tac Toe</div>
      <div className='game'>
        <div className='game-board'>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
        <div className='game-info'>
          {/* Additional Feature: For the current move only, show “You are at move #…” instead of a button.*/}
          <div className='move-number'>You are at move #{currentMove}</div>
          <ol>{moves}</ol>
        </div>
        {/*Additional Feature: Add a toggle button that lets you sort the moves in either ascending or descending order.*/}
        <div className='game-options'>
          <div className='game-options-title'>Game Options</div>
          <div className='ascending-toggle'>
            <button onClick={() => setAscending(!ascending)}>Toggle Move List Ascending/Descending</button>
          </div>
          <div className='reset-button'>
            <button onClick={() => resetGame()}>Reset Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return ;
}
