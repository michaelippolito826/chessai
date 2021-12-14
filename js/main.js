let board = null
let game = new Chess()
let whiteSquareGrey = '#a9a9a9'
let blackSquareGrey = '#696969'
let $eval = $('#eval')

// AI
function evaluateBoard() {
  let totalEvaluation = 0
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j])
    }
  }
  return totalEvaluation
}

function getPieceValue (piece) {
  if (piece === null) {
      return 0;
  }
  function getAbsoluteValue (piece) {
      if (piece.type === 'p') {
          return 10;
      } else if (piece.type === 'r') {
          return 50;
      } else if (piece.type === 'n') {
          return 30;
      } else if (piece.type === 'b') {
          return 30 ;
      } else if (piece.type === 'q') {
          return 90;
      } else if (piece.type === 'k') {
          return 900;
      }
      throw "Unknown piece type: " + piece.type;
  };

  var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


// show legal moves
function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
}

function onDrop(source, target) {
  removeGreySquares()

  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q', // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250)

}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen())
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

let config = {
  draggable: true,
  position: 'start',
  moveSpeed: 100,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
}
board = Chessboard('myBoard', config)
