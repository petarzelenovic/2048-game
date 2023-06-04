import React, { useState } from "react";
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import "../main.css";
import "../styles.css";
import useEvent from "../hooks/useEvent";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  //  useState hook koji se koristi za da doda stanje boardu

  //fja koja obradjuje pritisak na strelicu tastature
  const handleKeyDown = (event) => {
    if (board.hasWon()) {
      // ako smo pobedili ne radi se nista, kraj fje
      return;
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      // streclice ledo, gore, desno, dole
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      // pomeranje na boardu
      //updatovanje stanja boarda
      setBoard(newBoard);
    }
  };
  useEvent("keydown", handleKeyDown);
  //hook useevent koji kada se dogoti event keydown poziva handlekeyDown fju

  //cells ce sadrzati sve generisane html elemente za cells
  const cells = board.cells.map((row, rowIndex) => {
    //preko .map iteriramo kroz cells u svakom redu
    return (
      <div key={rowIndex}>
        {row.map((col, colIndex) => {
          //itereiramo kroz svaku cell u redu i generise Cell u svakoj iteraciji
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </div>
    );
  });

  //filtriramo sve tile-ove koje imaju vrednos 0, one koje nemaju prolazimo kroz njih i renderujemo ih
  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => {
      return <Tile tile={tile} key={index} />;
    });

  //fja za restartovanje igrice kada se pozove pravi se novi board
  const resetGame = () => {
    setBoard(new Board());
  };

  return (
    <div>
      <div className="details-box">
        <div className="resetButton" onClick={resetGame}>
          New Game
        </div>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
        {/* renderujemo cells i tiles koje smo prethodno gore definisali */}
        {cells}
        {tiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default BoardView;
