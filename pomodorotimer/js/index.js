// Globals for dragging the timer tickers.
var dragging = false;
var lastY = 0;

function Tic() {
  var tic = document.createElement("div");
  tic.style.borderTop = "1px solid black";
  tic.style.width = "50%";
  tic.style['flex-grow'] = "1";
  return tic;
}
function BigTic() {
  var bigTic = document.createElement("div");
  bigTic.style.borderTop = "1px solid black";
  bigTic.style.width = "100%";
  bigTic.style['flex-grow'] = "1";
  return bigTic
}
function Num(number) {
  var num = document.createElement("span");
  num.innerHTML = number;
  return num;
}

//Creates a ticker
function Ticker(length, direction) {
  var container = document.createElement("div");
  container.style.display = "flex";
  container.style.height = "600px"
  container.style.margin = ".5em";
  var nums = document.createElement("div");
  nums.className += " nums";
  var ticks = document.createElement("div");
  ticks.className += " ticks";

  for (var i = length; i >= 0; i--) {
    if (i % 5 === 0) {
      nums.appendChild(new Num(i));
      ticks.appendChild(new BigTic());
    } else ticks.appendChild(new Tic());
  }

  if (direction == "right") {
    ticks.style['align-items'] = 'flex-start';
    nums.style['align-items'] = 'flex-start'
    container.appendChild(ticks);
  }
  container.appendChild(nums);
  if (direction == "left") {
    ticks.style['align-items'] = 'flex-end';
    nums.style['align-items'] = 'flex-end'
    container.appendChild(ticks);
  }

  return container;
}

//A slider that contains a ticker
function Slider(direction, defaultTime) {
  this.ticker = new Ticker(60, direction);
  this.ticker.style.position = "relative";

  this.slideContainer = document.createElement("div");
  this.slideContainer.appendChild(this.ticker);

  this.setPos = function(val) {
    var val = val.split('px')[0];
    if (val > 590) val = 590;
    if (val < 0) val = 0;
    this.ticker.style.top = val + 'px';
  }

  //Set the position of the timer based on a time value;
  this.setTime = function(time) {
    this.setPos(time * 590 /60 + "px");
  }.bind(this);

  //Get the position of the slider
  this.getPos = function() {
    var top = window.getComputedStyle(this.ticker).getPropertyValue("top");
    return parseInt(top.split('px')[0]);
  }

  //Convert the position of the timer to a time value
  this.posToTime = function() {
    var top = window.getComputedStyle(this.ticker).getPropertyValue("top");
    var val = top.split('px')[0];
    return val * 60 / 590;
  }

  //initiate the time to the highest value
  this.setPos(defaultTime * 590 / 60 + "px");
}

//Sets the position of a slider
Slider.prototype.setPos = function(val) {
  var val = val.split('px')[0];
  if (val > 590) val = 590;
  if (val < 0) val = 0;
  this.ticker.style.top = val + 'px';
}


window.onload = function() {

  //Creates two tickers, one for work, and one for break
  var leftTicker = new Slider('left', 25);
  var rightTicker = new Slider('right', 5);

  document.getElementById("ticker1").appendChild(leftTicker.slideContainer);
  document.getElementById("ticker2").appendChild(rightTicker.slideContainer);


  //Add mousedrag capability to the two tickers
  //
  //
  //on mousedown set dragging to true
  document.querySelector('#ticker1').addEventListener('mousedown', function(event) {
    lastY = event.clientY;
    dragging = leftTicker;
  });
  document.querySelector('#ticker2').addEventListener('mousedown', function(event) {
    lastY = event.clientY;
    dragging = rightTicker;
  });
  //Stop dragging on mouseup
  document.addEventListener('mouseup', function(event) {
    dragging = false;
  });
  //If dragging is true, update the position of the dragging element
  document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (dragging) {
      var diff = event.clientY - lastY;
      dragging.setPos((dragging.getPos() + diff) + "px");
      lastY = event.clientY;
    }
  });


  //Bind button to start the pomodoro timer
  document.querySelector('#button').addEventListener('click', function(event) {
    event.preventDefault();
    var wLabel = document.getElementById('work');
    var bLabel = document.getElementById('break');

    //Set the work timer to active and start a new timer.
    wLabel.className = wLabel.className.replace(" inactive","");
    var breakTime = rightTicker.posToTime() * 60;
    var workTimer = new Timer(leftTicker.posToTime() * 60, leftTicker.setTime, breakTimer);

    //Callback function for the work timer that starts the break timer;
    function breakTimer() {
      bLabel.className = bLabel.className.replace(" inactive","");
      document.getElementById('work').className += " inactive";
      new Timer(breakTime, rightTicker.setTime, finished);
    }

    //Callback function for the break timer
    function finished() {
      bLabel.className += " inactive";
      leftTicker.setTime(25);
      rightTicker.setTime(5);
    }


  });

};

//A timer that takes into account drift
//calls updateCB every interval
//calls finishedCB when time expires
function Timer(time, updateCB, finishedCB) {
  var interval = 1000; // ms
  var expected = Date.now() + interval;
  setTimeout(step, interval);

  function step() {
    var dt = Date.now() - expected;

    //Update the time by 1 second and call the update Callback
    time -= 1;
    updateCB(time/60);

    expected += interval;

    //If we run out of time call the finished Callback
    if (time <= 0) finishedCB();
    else setTimeout(step, Math.max(0, interval - dt)); // take into account drift
  }
}
