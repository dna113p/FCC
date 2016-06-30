//Grab the sounds for each button
sound = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
]

window.onload = function() {
  //Create a new Simon game
  var Simon = new Game();

  //Bind the new game buttons click event to start a new game
  document.getElementById("buttons").addEventListener('click', function(e) {
    var type = e.target.id;
    Simon.clearGame();
    Simon.startGame(type);

    //Bind the reset button after a game has started
    document.getElementById('reset').addEventListener('click', function(e) {
      Simon.clearGame();
    });

  });
}

//Simon game logic
function Game() {
  var plays = [];     //array to hold the sequence of plays
  var current = 0;    //index into plays of the currently active play
  var counter = document.getElementById('count');
  var mode;

  //Bind click to the game buttons
  //so that they initiate a play
  document.getElementById("game").addEventListener('click', function(e) {
    var num = e.target.id;
    this.play(num);
  }.bind(this));

  //Generate a random play
  //and start the sequence
  this.addPlay = function() {
    //If we are at 20 plays, then we have found a winner! Woop woop
    if (plays.length == 20) {
      plays = [];
      current = 0;
      counter.innerHTML = "Winner!";
      return;
    }
    current = 0;
    var random = Math.round(Math.random() * 3);
    plays.push(random);
    counter.innerHTML = plays.length;
    this.playSequence();
  }

  //Begin game by adding a new play
  this.startGame = function(type) {
    mode = type;
    this.addPlay();
  }

  //Make a play
  this.play = function(num) {

    //Check if the play matches our expected play
    if (plays[current] == num) {
      flash(num);
      current++;
      if (current >= plays.length) {
        spinFlash();
        this.addPlay();
      }
      return true;
    }
    else {
      //Check for strict mode.
      //Restart during strict mode
      //otherwise replay the current sequence
      if (mode == "strict") {
        plays = [];
        current = 0;
        counter.innerHTML = "Loser!";
        flash(0);flash(1);flash(2);flash(3);
        return;
      }
      else {
        flash(0);
        flash(1);
        current = 0;
        this.playSequence();
      }
    }
  }

  //Play the currently stored game sequence
  this.playSequence = function() {
    for (var i = 0; i < plays.length; i++) {
      var ms = (i + 1) * 1000;
      setTimeout(function(x) {
        return function() {
          flash(plays[x]);
        }
      }(i), ms);
    }
  }

  //Reset the current game
  this.clearGame = function () {
    counter.innerHTML = "--";
    current = 0;
    plays = [];
  }

}

//Flash the button with associated num
function flash(num) {
  var element = document.getElementById(num);
  addClass(element, "highlight");
  sound[num].play();
  setTimeout(function() {
    removeClass(element, "highlight");
  }, 500);
}

//Make a cool sound for succesfull pattern
function spinFlash() {
  setTimeout(function() {
    sound[2].play();
  }, 200)
  setTimeout(function() {
    sound[1].play();
  }, 300)
  setTimeout(function() {
    sound[0].play();
  }, 400)
}


//Helpers to add and remove classes from dom elements
function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += ' ' + className;
}
function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}
