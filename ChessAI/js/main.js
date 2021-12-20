let board = null
let game = new Chess()
let whiteSquareGrey = '#a9a9a9'
let blackSquareGrey = '#696969'
let $eval = $('#eval')
let turn = 0

let italianop = ["1.e4 e5 2.Nf3 Nc6 3.Bc4"]
let scotchop = ["1.e4 e5 2.Nf3 Nc6 3.d4"]
let petroffop = ["1.e4 e5 2.Nf3 Nf6"]
let ruylopezop = ["1.e4 e5 2.Nf3 Nc6 3.Bb5"]
let queengambitop = ["1.d4 d5 2.c4 dxc4"]


// Evaulation Function
function evaluateBoard() {
  let fentoobject = Chessboard.fenToObj(game.fen())
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
    let possibleMoves = game.moves()
    if (depth == 0) {
      return evaluateBoard();
    }

    if (possibleMoves.length === 0) return window.alert("Checkmate!");

    let bestEvaluation = -99999

    for (let j = 0; j < possibleMoves.length; j++) {
      let move = possibleMoves[j]
      game.move(move)
      let evaluation = -Search(depth - 1)
      bestEvaluation = Math.max(evaluation, bestEvaluation)
      game.undo(move)
      window.alert(evaluation)
      window.alert(bestEvaluation)
    }
    
    return bestEvaluation;
  }catch(e){
  alert(e.stack)}
}

//function Search(depth) {
//     try{
//     let fentoobject = Chessboard.fenToObj(game.fen())
//     let possibleMoves = game.moves()
//     window.alert(possibleMoves)
  
//     // game over
//     if (possibleMoves.length === 0) return window.alert("Checkmate!");
  
//     if (depth == 0) {
//       return evaluateBoard(fentoobject);
//     }
  
//     let bestMove = ''
//     let evaluationInt = 99999
//     let evaluation = 0
    
//     for (let j = 0; j < possibleMoves.length; j++) {
      
//       let move = possibleMoves[j]
      
//       game.move(move)
//       fentoobject = Chessboard.fenToObj(game.fen())
//       evaluation = evaluateBoard(fentoobject)
//       game.undo(move)
  
//       if (evaluation <= evaluationInt) {
//         evaluationInt = evaluation
//         bestMove = move
//       }
  
//       game.setTurn("w")
//       whitemoves = game.moves()
//       window.alert(whitemoves)      
      
      
      
      
//     }
//     window.alert(bestMove)
//     window.alert(evaluationInt)
    
//     return evaluationInt, bestMove;
//     }catch(e){
//     alert(e)}
//   }

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

function enemyMove () {
  // search function (depth, alpha, beta)
  let depth = 1

  //if (turn == 0) {
    //nextMove = "e5"
    //game.move(nextMove)
  //} else if (turn == 1) {
    //nextMove = "Nc6"
    //game.move(nextMove)
  //} else {
    //nextMove = Search(depth)
    //game.move(nextMove)
  //}
  window.alert(Search(depth))
  board.position(game.fen())

  //turn = turn + 1
  //window.alert(turn)
}

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
