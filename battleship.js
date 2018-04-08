var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [ { locations: ["06", "16", "26"], hits: ["", "", ""] },
    { locations: ["24", "34", "44"], hits: ["", "", ""] },
    { locations: ["10", "11", "12"], hits: ["", "", ""] } ],

  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i]; //pobranie okrętu
      var index = ship.locations.indexOf(guess); //wywołanie metody indexOf
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("TRAFIONY!");
        if (this.isSunk(ship)) {
          view.displayMessage("Zatopiłeś mój okręt!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Pudło!");
    return false;
  },

  isSunk: function(ship) {
    for (var i=0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipsLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShips();
      } while (this.collision(locations)); {
        this.ships[i].locations = locations;
      }
    }
  }

};

var controller = {
  guesses: 0,

  processGuess(guess) {
    var location = this.parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("Zatopiłeś wszystkie okręty w " + this.guesses + " próbach.");
      }
    }
  },

  parseGuess: function(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
      alert("Proszę wpisać jedną literę i jedną cyfrę");
    } else {
      firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar);
      var column = guess.charAt(1);

      if (isNaN(row) || isNaN(column)) {
        alert("Ups, to nie są współrzędne!");
      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
          alert("Pole poza planszą!");
        } else {
          return row + column;
        }
    }
    return null;
  },
};

function init() {

  var fiteButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = "";
  }

  function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
      fireButton.click();
      return false;
    }
  }


window.onload = init;
