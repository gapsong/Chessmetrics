import { Chess } from 'chess.js';
import { ALL_SQUARES, VALUE_TABLE } from './constants';

export const countPotentialChecks = (fen) => {
  const board = new Chess(fen);

  const checks = board.moves().reduce((acc, item) => {
    if (item.includes('+')) return acc + 1;

    return acc;
  }, 0);

  return checks;
};

// Checks where you cannot get recaptured
export const countPotentialFreeChecks = (fen) => {
  const board = new Chess(fen);

  const checks = board.moves().reduce((acc, item) => {
    const square = getSquareNameFromAlgebraicNotation(item);
    // And the Figures cannot be recaptured
    if (item.includes('+') && countSquareDefenders(board.fen(), square) == 0) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return checks;
};

// Qxe4+ -> e4
export const getSquareNameFromAlgebraicNotation = (move) => {
  for (const square of ALL_SQUARES) {
    if (move.includes(square)) {
      return square;
    }
  }
};

export const countAttackers = (fen) => {
  const board = new Chess(fen);
  return board.moves().reduce((acc, item) => {
    let value = 0;
    if (item.includes('x')) {
      const square = getSquareNameFromAlgebraicNotation(item);
      // square to be able to be captured
      value = value + VALUE_TABLE[board.get(square).type];
    }

    return acc + value;
  }, 0);
};

export const totalAttacks = (fen) => {
  return {
    whiteAttacks: countAttackers(fenToWhite(fen)),
    blackAttacks: countAttackers(fenForOtherSide(fenToWhite(fen))),
  };
};

const fenToWhite = (fen) => {
  return fen.search(' w ') > 0 ? fen.replace(/ w .*/, ' w - - 0 1') : fen.replace(/ b .*/, ' w - - 0 2');
};

function fenForOtherSide(fen) {
  return fen.search(' w ') > 0 ? fen.replace(/ w .*/, ' b - - 0 1') : fen.replace(/ b .*/, ' w - - 0 2');
}

function countSquareDefenders(fen, square) {
  var chess = new Chess(fen);
  var opChess = new Chess(fenForOtherSide(fen));
  var oppositeColor = opChess.turn() == 'w' ? 'b' : 'w';
  opChess.put(
    {
      // put queen in the square, but could be any other piece aswell
      type: 'q',
      color: oppositeColor,
    },
    square,
  );

  var moves = opChess.moves({ verbose: true, legal: false });
  var defendersCount = moves.filter((m) => {
    if (m.to == square && m.flags == 'c') {
      chess.remove(m.from); // Removes all attacking pieces
      return true;
    } else {
      return false;
    }
  }).length;

  if (defendersCount == 0) {
    return 0;
  }

  return defendersCount + countSquareDefenders(chess.fen(), square); // This line removes all attackers and calls the function again. To detect batteries
}
