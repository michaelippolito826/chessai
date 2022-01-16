let board = null;
let game = new Chess();
let whiteSquareGrey = "#a9a9a9";
let blackSquareGrey = "#696969";
let $eval = $("#eval");
let turn = 0;
let positionCount = 0;
let alpha = Number.NEGATIVE_INFINITY;
let beta = Number.POSITIVE_INFINITY;

let italianop = ["1.e4 e5 2.Nf3 Nc6 3.Bc4"];
let scotchop = ["1.e4 e5 2.Nf3 Nc6 3.d4"];
let petroffop = ["1.e4 e5 2.Nf3 Nf6"];
let ruylopezop = ["1.e4 e5 2.Nf3 Nc6 3.Bb5"];
let queengambitop = ["1.d4 d5 2.c4 dxc4"];

// Evaulation Function
function evaluateBoard() {
  let evalMove = "";
  let fentoobject = Chessboard.fenToObj(game.fen());
  var piecesOnBoard = [];
  for (key in fentoobject) {
    if (fentoobject.hasOwnProperty(key)) {
      piecesOnBoard.push(fentoobject[key]);
    }
  }
  let whiteEvaluation = 0;
  let blackEvaluation = 0;
  for (let i = 0; i < piecesOnBoard.length; i++) {
    let currentPieceValue = getPieceValue(piecesOnBoard[i]);
    if (currentPieceValue > 0) {
      whiteEvaluation = whiteEvaluation + currentPieceValue;
    } else if (currentPieceValue < 0) {
      blackEvaluation = blackEvaluation + currentPieceValue;
    }
  }
  let evaluation = whiteEvaluation + blackEvaluation;
  return [evalMove, evaluation];
}

function Search(depth, black, alpha, beta) {
  try {
    positionCount++;
    let bestMove = "";
    let possibleMoves = game.moves();
    if (depth == 0) {
      return evaluateBoard();
    }
    if (possibleMoves.length === 0) return window.alert("Checkmate!");

    if (black) {
      let bestEvaluation = Number.POSITIVE_INFINITY;
      for (let j = 0; j < possibleMoves.length; j++) {
        if (alpha > beta) {
          break;
        }
        let move = possibleMoves[j];
        game.move(move);
        let [childMove, childEvaluation] = Search(
          depth - 1,
          false,
          alpha,
          beta
        );
        if (childEvaluation < bestEvaluation) {
          bestMove = move;
          bestEvaluation = childEvaluation;
        }
        if (childEvaluation <= beta) {
          beta = childEvaluation;
        }
        alpha = Math.min(childEvaluation, alpha);
        game.undo(move);
      }
      return [bestMove, bestEvaluation];
    } else {
      let bestEvaluation = Number.NEGATIVE_INFINITY;
      for (let j = 0; j < possibleMoves.length; j++) {
        if (alpha > beta) {
          break;
        }
        let move = possibleMoves[j];
        game.move(move);
        let [childMove, childEvaluation] = Search(depth - 1, true, alpha, beta);
        if (childEvaluation > bestEvaluation) {
          bestMove = move;
          bestEvaluation = childEvaluation;
        }
        if (childEvaluation >= alpha) {
          alpha = childEvaluation;
        }
        beta = Math.max(childEvaluation, beta);
        game.undo(move);
      }
      return [bestMove, bestEvaluation];
    }
  } catch (e) {
    alert(e.stack);
  }
}

function getPieceValue(piece) {
  if (piece === "wP") {
    return 100;
  } else if (piece === "wN") {
    return 300;
  } else if (piece === "wB") {
    return 300;
  } else if (piece === "wR") {
    return 500;
  } else if (piece === "wQ") {
    return 900;
  } else if (piece === "wK") {
    return 9000;
  } else if (piece === "bP") {
    return -100;
  } else if (piece === "bN") {
    return -300;
  } else if (piece === "bB") {
    return -300;
  } else if (piece === "bR") {
    return -500;
  } else if (piece === "bQ") {
    return -900;
  } else if (piece === "bK") {
    return -9000;
  }
  throw "Unknown piece type: " + piece;
}

function enemyMove() {
  let depth = 3;
  positionCount = 0;

  let t1 = new Date().getTime();
  let [move, eval] = Search(depth, true, alpha, beta);
  let t2 = new Date().getTime();
  let moveTime = (t2 - t1) / 1000;
  console.log(positionCount);
  console.log(moveTime);
  console.log(move);

  game.move(move);
  board.position(game.fen());
}

// show legal moves
function removeGreySquares() {
  $("#myBoard .square-55d63").css("background", "");
}

function greySquare(square) {
  var $square = $("#myBoard .square-" + square);

  var background = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    background = blackSquareGrey;
  }

  $square.css("background", background);
}

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false;
}

function onDrop(source, target) {
  removeGreySquares();

  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";

  // make move for black
  window.setTimeout(enemyMove, 250);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

// (function () {
//     var old = console.log;
//     var logger = document.getElementById('log');
//     console.log = function () {
//       for (var i = 0; i < arguments.length; i++) {
//         if (typeof arguments[i] == 'object') {
//             logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
//         } else {
//             logger.innerHTML += arguments[i] + '<br />';
//         }
//       }
//     }
// })();

let config = {
  draggable: true,
  position: "start",
  //position: 'r1b1kbnr/ppp2ppp/2nqp3/3pN3/3P4/3Q4/PPP1PPPP/RNB1KB1R',
  moveSpeed: 100,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  showErrors: "alert",
};
board = Chessboard("myBoard", config);
