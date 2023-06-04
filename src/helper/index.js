var rotateLeft = function (matrix) {
  var rows = matrix.length;
  var columns = matrix[0].length;
  var res = []; // smestamo rotirajucu matricu
  for (var row = 0; row < rows; ++row) {
    res.push([]);
    //ubacivanje praznog niza
    for (var column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1];
      //rotiranje ulevo
    }
  }
  return res;
};

class Tile {
  constructor(value, row, column) {
    //atributi i njene default vrednosti
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    //referenca na plocicu u koju ulazi
    this.id = this.id++ || 0;
  }
  moveTo(row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
  }
  isNew() {
    return this.oldRow === -1 && !this.mergedInto;
  }
  hasMoved() {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() ||
          this.fromColumn() !== this.toColumn())) ||
      this.mergedInto
    );
  }
  fromRow() {
    return this.mergedInto ? this.row : this.oldRow;
  }
  fromColumn() {
    return this.mergedInto ? this.column : this.oldColumn;
  }
  toRow() {
    return this.mergedInto ? this.mergedInto.row : this.row;
  }
  toColumn() {
    return this.mergedInto ? this.mergedInto.column : this.column;
  }
}

class Board {
  constructor() {
    //niz plocica
    this.tiles = [];
    //niz celija
    this.cells = [];
    this.score = 0;
    this.size = 4;
    this.fourProbability = 0.1;
    this.deltaX = [-1, 0, 1, 0];
    this.deltaY = [0, -1, 0, 1];
    for (var i = 0; i < this.size; ++i) {
      this.cells[i] = [
        this.addTile(),
        this.addTile(),
        this.addTile(),
        this.addTile(),
      ];
    }
    this.addRandomTile();
    this.addRandomTile();
    this.setPositions();
    this.won = false;
  }
  addTile(args) {
    var res = new Tile(args);
    this.tiles.push(res);
    return res;
  }

  moveLeft() {
    var hasChanged = false;
    for (var row = 0; row < this.size; ++row) {
      var currentRow = this.cells[row].filter((tile) => tile.value !== 0);
      var resultRow = [];
      for (var target = 0; target < this.size; ++target) {
        var targetTile = currentRow.length
          ? currentRow.shift()
          : this.addTile();
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          var tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergedInto = targetTile;
          var tile2 = currentRow.shift();
          tile2.mergedInto = targetTile;
          targetTile.value += tile2.value;
          this.score += tile1.value + tile2.value;
        }
        resultRow[target] = targetTile;
        this.won |= targetTile.value === 2048;
        hasChanged |= targetTile.value !== this.cells[row][target].value;
      }
      this.cells[row] = resultRow;
    }
    return hasChanged;
  }
  setPositions() {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.oldRow = tile.row;
        tile.oldColumn = tile.column;
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.markForDeletion = false;
      });
    });
  }
  addRandomTile() {
    var emptyCells = [];
    for (var r = 0; r < this.size; ++r) {
      for (var c = 0; c < this.size; ++c) {
        if (this.cells[r][c].value === 0) {
          //prolazi se kroz sve celije i gleda da li je prazna, ukoliko jeste ubacuje se u niz (index i kolona)
          emptyCells.push({ r: r, c: c });
        }
      }
    }
    var index = ~~(Math.random() * emptyCells.length);
    //kao math floor samo sto odsece decimale, generise od 0 do emptyCells
    var cell = emptyCells[index];
    var newValue = Math.random() < this.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
  }
  move(direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    //brise one koje su oznacene sa markForDelete
    for (var i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    var hasChanged = this.moveLeft();
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
      this.addRandomTile();
    }
    this.setPositions();
    return this;
  }
  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
    this.tiles.forEach((tile) => {
      tile.markForDeletion = true;
    });
  }
  hasWon() {
    return this.won;
  }
  hasLost() {
    var canMove = false;
    for (var row = 0; row < this.size; ++row) {
      for (var column = 0; column < this.size; ++column) {
        canMove |= this.cells[row][column].value === 0;
        //dobice bilo koja celija ima vrednost 0, binarni operator
        for (var dir = 0; dir < 4; ++dir) {
          //proveravaju se sve susedne celije
          var newRow = row + this.deltaX[dir];
          var newColumn = column + this.deltaY[dir];
          if (
            newRow < 0 ||
            newRow >= this.size ||
            newColumn < 0 ||
            newColumn >= this.size
          ) {
            continue;
          }
          //proveravanje da li vrednosti susednih celija upadaju u granice
          canMove |=
            this.cells[row][column].value ===
            this.cells[newRow][newColumn].value;
          //ukoliko postoji jos neka plocica sa istim brojem postoji mogucnsot za spajanje
        }
      }
    }
    return !canMove;
  }
}

export { Board };
