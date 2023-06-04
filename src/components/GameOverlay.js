import React from "react";
import TryAgainLogo from "../assets/img/try-again.gif";
const GameOverlay = ({ onRestart, board }) => {
  //prima dva propa, fju za ponovno pokretanje i board kao objekat stanja igre
  if (board.hasWon()) {
    return <div className="tile2048"></div>;
  } else if (board.hasLost()) {
    return (
      <div className="gameOver" onClick={onRestart}>
        <img
          src={TryAgainLogo}
          alt="Try again"
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
        />
      </div>
    );
  }
  return null;
};

export default GameOverlay;
