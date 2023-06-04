import React from "react";
import "../main.css";
import "../styles.css";

const Tile = ({ tile }) => {
  //1 tile
  //2 tile#
  //3 position_#_#
  //4 row from # to #
  //5 col from # to #
  //6 isMoving
  //7 new
  //8 merged
  //tipovi klasa koje plocica moze dobiti

  let classArray = ["tile"];
  //niz klasa za plocice
  classArray.push("tile" + tile.value);

  if (!tile.mergedInto) {
    classArray.push(`position_${tile.row}_${tile.column}`);
  }

  if (tile.mergedInto) {
    classArray.push("merged");
  }

  if (tile.isNew()) {
    classArray.push("new");
  }

  if (tile.hasMoved()) {
    classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
    classArray.push(`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`);
    classArray.push("isMoving");
  }

  let classes = classArray.join(" ");
  //spajamo sve clanove niza u string odvojene razmakom
  return <span className={classes}> </span>;
  //vracamo span sa klasom koja obuhvata sve moguce klase iz niza
  //taj span je plocica zapravo
};

export default Tile;
