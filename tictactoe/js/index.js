//Set defaults
var turn = 'player';
var turnNum = 1;
var playerLetter = "X";
var computerLetter = "O";
var game = [new Array(3), new Array(3), new Array(3)];
var statusText = document.getElementById("status");

window.onload = function() {
  //Bind clicks to the gameboard


  //Make a play for the player
  document.getElementById("container").addEventListener('click', function(event) {
    if (turn == 'player') {
      var arr = event.target.id.split('');
      play(arr[0], arr[1], playerLetter);
    }
  });

  document.getElementById("select").addEventListener('click', function(event) {
    event.preventDefault();
    var x = document.getElementById("X");
    var o = document.getElementById("O");

    //Set the players icon to X or O
    if (event.target.innerHTML == "X") {
      clearGame();
      playerLetter = "X";
      computerLetter = "O";
      x.className = "selected";
      o.className = "";
    }
    if (event.target.innerHTML == "O") {
      clearGame();
      playerLetter = "O";
      computerLetter = "X";
      x.className = "";
      o.className = "selected";
    }
  });
};

//Make a play in the clicked gameboard location
//and then check for a win
function play(row, col, letter) {
  if (!game[row][col]) {
    game[row][col] = letter;
    document.getElementById(row + '' + col).innerHTML = letter;

    if (checkWin(letter, row, col)) {
      handleWin();
      return;
    }
    if (turnNum == 9) {
      handleTie();
      return;
    }
    turnOver();
    return true;
  } else if (turn == 'player') {
    statusText.innerHTML = "Cannot play there";
  } else return false;
}

function handleWin() {
  if (turn == 'player') statusText.innerHTML = "Winner Winner";
  if (turn == 'computer') statusText.innerHTML = "Loser";
  clearGame();
}

function handleTie() {
  statusText.innerHTML = "Tie Game";
  clearGame();
}

//Swap players, and make a play for the computer
function turnOver() {
  turnNum++;
  if (turn == 'computer') {
    turn = 'player';
    return;
  }
  if (turn == 'player') {
    turn = 'computer';
    var arr = findPlay();
    play(arr[0], arr[1], computerLetter);
    return;
  }
}

//Boolean to check the board for a winner
//check after each play
function checkWin(letter, row, col) {
  var win = letter + letter + letter;
  if (game[row][0] + game[row][1] + game[row][2] == win) return true; //column
  else if (game[0][col] + game[1][col] + game[2][col] == win) return true; //row
  else if (game[0][0] + game[1][1] + game[2][2] == win) return true; //diag1
  else if (game[2][0] + game[1][1] + game[0][2] == win) return true; //diag2
  else return false;
}

function clearGame() {
  game = [new Array(3), new Array(3), new Array(3)];
  for (var i = 0; i <= 2; i++) {
    for (var j = 0; j <= 2; j++) {
      document.getElementById(i + "" + j).innerHTML = "";
    }
  }
  turnNum = 1;
  turn = "player";
}

//Super stupid AI logic.
//Just find a random square that is open
function findPlay() {
  var tryRow = Math.floor(Math.random() * (3));
  var tryCol = Math.floor(Math.random() * (3));
  var arr = [tryRow, tryCol];
  if (!game[tryRow][tryCol]) return arr;
  else return findPlay();
}
