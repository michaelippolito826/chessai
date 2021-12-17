let board = null
let game = new Chess()
let whiteSquareGrey = '#a9a9a9'
let blackSquareGrey = '#696969'
let $eval = $('#eval')
// Evaulation Function
function evaluateBoard(fentoobject) {
  var piecesOnBoard = [];
  for(key in fentoobject) {
    if (fentoobject.hasOwnProperty(key)) {
      piecesOnBoard.push(fentoobject[key]);
    }
  }
  //window.alert(piecesOnBoard)


  let whiteEvaluation = 0
  let blackEvaluation = 0
  try {
  for (let i = 0; i < piecesOnBoard.length; i++) {
       let currentPieceValue = getPieceValue(piecesOnBoard[i])
       if (currentPieceValue > 0) {
           whiteEvaluation = whiteEvaluation + currentPieceValue
       } else if (currentPieceValue < 0) {
           blackEvaluation = blackEvaluation + currentPieceValue }  
  }
  let evaluation = whiteEvaluation + blackEvaluation
  return evaluation;
  }catch(e){
  alert(e)
  }
}

function Search(depth) {
  try{
  let fentoobject = Chessboard.fenToObj(game.fen())
  let possibleMoves = game.moves()
  window.alert(possibleMoves)

  // game over
  if (possibleMoves.length === 0) return window.alert("Checkmate!");


  
  if (depth == 0) {
    return evaluateBoard(fentoobject);
  }
  let bestMove = ''
  let evaluationInt = 99999
  let evaluation = 0
  
  for (let j = 0; j < possibleMoves.length; j++) {
    
    let move = possibleMoves[j]
    
    game.move(move)
    fentoobject = Chessboard.fenToObj(game.fen())
    evaluation = evaluateBoard(fentoobject)
    game.undo(move)

    //game.setTurn("w")
    //whitemoves = game.moves()
    //window.alert(whitemoves)
    
    if (evaluation <= evaluationInt) {
      evaluationInt = evaluation
      bestMove = move
    }
  }
  window.alert(bestMove)
  window.alert(evaluationInt)
  
  
  return bestMove;
  }catch(e){
  alert(e)}
}

function getPieceValue (piece) {
  if (piece === 'wP') {
      return 100;
  } else if (piece === 'wN') {
      return 300;
  } else if (piece === 'wB') {
      return 300;
  } else if (piece === 'wR') {
      return 500;
  } else if (piece === 'wQ') {
      return 900;
  } else if (piece === 'wK') {
      return 9000;
  } else if (piece === 'bP') {
      return -100;
  } else if (piece === 'bN') {
      return -300;
  } else if (piece === 'bB') {
      return -300;
  } else if (piece === 'bR') {
      return -500;
  } else if (piece === 'bQ') {
      return -900;
  } else if (piece === 'bK') {
      return -9000;
  }
    throw "Unknown piece type: " + piece;
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

function enemyMove () {
  // search function (depth, alpha, beta)
  
  let depth = 1

  nextMove = Search(depth)
  game.move(nextMove)
  







  //possibleMoves = Search()
  //if (possibleMoves == undefined) {}
  //else {
    //var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    //game.move(possibleMoves[randomIdx])
    //let fentoobject = Chessboard.fenToObj(game.fen())
      //let evaluation = evaluateBoard(fentoobject)
      //window.alert(evaluation)
  //}

  
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
  window.setTimeout(enemyMove, 250)

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
  showErrors: 'alert',
}
board = Chessboard('myBoard', config)

//window.addEventListener("error", handleError, true);

function handleError(evt) {
    if (evt.message) { // Chrome sometimes provides this
      alert("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);
    } else {
      alert("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));
    }
}
window.onerror = function(message, url, line) {
  alert(message + ', ' + url + ', ' + line);
};
