/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// create the player object
class Player {
  constructor(player, color) {
    // player number
    this.player = player;
    // player's chosen color
    this.color = color;
  }
};


// create the game class
class Game {
  // the constructor sets player1, player2, and hard codes the height and width
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width}));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    
    // bind handleClick to this instance
    this.handleClick = this.handleClick.bind(this);

    // listen for a click on this instance of the top row
    top.addEventListener('click', this.handleClick);

    // for each column, create a headcell, give it an id of the index, and append it
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.classList.add('head-cell');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    // add the top row to the board
    board.append(top);

    // make main part of board
    // create a row for each iteration of height
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      
      // then for each iteration of width, create a cell
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        // and assign it an id of the x and y coordinates
        cell.setAttribute('id', `${y}-${x}`);
        // add each cell to the current row
        row.append(cell);
      }
      // add each iteration of row to the board
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    setTimeout(() =>{
      // alert the winner, giving time for the last piece to fall
      // restart the game when the alert is dismissed
      alert(msg) ? '' : location.reload();
    }, 300);
    const top = document.querySelector('#column-top');
    top.removeEventListener('click', this.handleClick);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
    return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
  
    // check for win
    // if checkForWin is true
    if (this.checkForWin()) {
      // gameOver is true
      this.gameOver = true;
      //call endGame with the argument being the msg 
      // console.log(this.currPlayer);
      return this.endGame(`Player ${this.currPlayer.player} won!`);
    }
  
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    // if the current player is index 0 in the player array switch it to index 1, if not keep it index 0
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win= cells =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

const newGame = (e) => {
  document.querySelector('#start').addEventListener('click', () => {
    let p1 = new Player('1', document.querySelector('#player1-color').value);
    let p2 = new Player('2', document.querySelector('#player2-color').value);
    if(p1.color === p2.color) {
      alert('Please choose different colors');
      return;
    }
    new Game(p1, p2);
  });
}

newGame();
  

