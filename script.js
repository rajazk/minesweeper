var varibales = {
  alive: true,
  bomb: "💣",
  colors: {
    "1": "blue",
    "2": "green",
    "3": "red",
    "4": "purple",
    "5": "maroon",
    "6": "turquoise",
    "7": "black",
    "8": "grey",
    "9": "LightBlue"
  },
    num_of_bombs: 9,
    num_of_cols: 8,
    num_of_rows: 8
};

function startGame() {
    var gameLevel = "";
    varibales.num_of_rows = 8;
    varibales.num_of_cols = 8;
    varibales.num_of_bombs = 9;
    gameLevel = localStorage.getItem("Level");
  if (gameLevel) {
    if (gameLevel === "Intermediate") {
      varibales.num_of_rows = 16;
      varibales.num_of_cols = 16;
      varibales.num_of_bombs = 40;
    } else if (gameLevel === "Advanced") {
      varibales.num_of_rows = 24;
      varibales.num_of_cols = 24;
      varibales.num_of_bombs = 99;
    }
  }
  varibales.bombs = placeBombs();
  document.getElementById("field").appendChild(createTable());
}

function placeBombs() {
  var i=[];
  var rows = [];

  for (i = 0; i < varibales.num_of_bombs; i++) {
    placeSingleBomb(rows);
  }
  return rows;
}

function placeSingleBomb(bombs) {
    var col;
    var nrow;
    var ncol;
    var row;
  nrow = Math.floor(Math.random() * varibales.num_of_rows);
  ncol = Math.floor(Math.random() * varibales.num_of_cols);
  row = bombs[nrow];

  if (!row) {
    row = [];
    bombs[nrow] = row;
  }

  col = row[ncol];

  if (!col) {
        row[ncol] = true;
        return;
      }
  placeSingleBomb(bombs);

}

function cellID(i, j) {
  return "cell-" + i + "-" + j;
}

function createTable() {
    var table;
    var row;
    var td;
    var i;
    var j;
  table = document.createElement("table");

  for (i = 0; i < varibales.num_of_rows; i++) {
    row = document.createElement("tr");
    for (j = 0; j < varibales.num_of_cols; j++) {
      td = document.createElement("td");
      td.id = cellID(i, j);
      row.appendChild(td);
      addCellListeners(td, i, j);
    }
    table.appendChild(row);
  }
  return table;
}

function addCellListeners(td, i, j) {
  td.addEventListener("mousedown", function (event) {
    if (!varibales.alive) {
      return;
    }
    varibales.mousewhiches += event.which;
    if (event.which === 3) {
      return;
    }
    if (this.flagged) {
      return;
    }
    this.style.backgroundColor = "lightGrey";
  });

  td.addEventListener("mouseup", function (event) {
    if (!varibales.alive) {
      return;
    }

    if (this.clicked && varibales.mousewhiches === 4) {
      performMassClick(this, i, j);
    }

    varibales.mousewhiches = 0;

    if (event.which === 3) {
      if (this.clicked) {
        return;
      }
      if (this.flagged) {
        this.flagged = false;
        this.textContent = "";
      } else {
        this.flagged = true;
        this.textContent = varibales.flag;
      }

      event.preventDefault();
      event.stopPropagation();

      return false;
    } else {
      handleCellClick(this, i, j);
    }
  });

  td.oncontextmenu = function () {
    return false;
  };
}

function handleCellClick(cell, i, j) {
  if (!varibales.alive) {
    return;
  }

  if (cell.flagged) {
    return;
  }

  cell.clicked = true;

  if (varibales.bombs[i] && varibales.bombs[i][j]) {
    cell.style.color = "red";
    cell.textContent = varibales.bomb;
    gameOver();
  } else {
    cell.style.backgroundColor = "lightGrey";
    num_of_bombs = adjacentBombs(i, j);
    if (num_of_bombs) {
      cell.style.color = varibales.colors[num_of_bombs];
      cell.textContent = num_of_bombs;
    } else {
      clickAdjacentBombs(i, j);
    }
  }
}

function adjacentBombs(row, col) {
  var i, j, num_of_bombs;
  num_of_bombs = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (varibales.bombs[row + i] && varibales.bombs[row + i][col + j]) {
        num_of_bombs++;
      }
    }
  }
  return num_of_bombs;
}

function adjacentFlags(row, col) {
  var i, j, num_flags;
  num_flags = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      cell = document.getElementById(cellID(row + i, col + j));
      if (!!cell && cell.flagged) {
        num_flags++;
      }
    }
  }
  return num_flags;
}

function clickAdjacentBombs(row, col) {
  var i, j, cell;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      cell = document.getElementById(cellID(row + i, col + j));
      if (!!cell && !cell.clicked && !cell.flagged) {
        handleCellClick(cell, row + i, col + j);
      }
    }
  }
}

function performMassClick(cell, row, col) {
  if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
    clickAdjacentBombs(row, col);
  }
}

function gameOver() {
  varibales.alive = false;
  document.getElementById("lost").style.display = "block";
}

function gameWon() {
  varibales.alive = false;
  document.getElementById("won").style.display = "none";
}

function reload() {
  window.location.reload();
}

function initializeGame() {
  document.getElementById("lost").style.display = "none";
  document.getElementById("won").style.display = "none";
  document.getElementById("splash").style.display = "";
  setTimeout(function () {
    startGame();
    document.getElementById("splash").style.display = "none";
  }, 2000);
}

function do_startGame(Level) {
  localStorage.setItem("Level", Level);
  reload();
}
