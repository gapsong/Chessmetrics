import { Chess } from 'chess.js';
import {
  countAttackers,
  countPotentialChecks,
  countPotentialFreeChecks,
  getSquareNameFromAlgebraicNotation,
  totalAttacks,
} from '../lib/index.js';

describe('helperfunctions', () => {
  it('check the function getSquareNameFromAlgebraicNotation', () => {
    expect(getSquareNameFromAlgebraicNotation('Qxe4')).toEqual('e4');
    expect(getSquareNameFromAlgebraicNotation('Qxe4+')).toEqual('e4');
    expect(getSquareNameFromAlgebraicNotation('Ke2')).toEqual('e2');
  });
});

describe('count checks', () => {
  it('should could potential checks', () => {
    const board = new Chess('4k3/8/4r3/8/2Q5/8/8/3K4 w - - 0 1');
    expect(countPotentialChecks(board.fen())).toEqual(5);
  });

  it('should could potential Free checks', () => {
    const board = new Chess('4k3/8/4r3/8/2Q5/8/8/3K4 w - - 0 1');
    expect(countPotentialFreeChecks(board.fen())).toEqual(4);
  });

  it('should could potential Free checks 2', () => {
    const board = new Chess('4k3/8/2r1r3/8/2Q5/8/8/3K4 w - - 0 1');
    expect(countPotentialFreeChecks(board.fen())).toEqual(0);
  });
});

describe('count attackers', () => {
  it('should calculate attackers 1', () => {
    const board = new Chess('4k3/8/4r3/8/2Q5/8/8/3K4 w - - 0 1');
    expect(countAttackers(board.fen())).toEqual(5);
    expect(countAttackers(board.fen())).toEqual(5);
  });

  it('should calculate attackers 2', () => {
    const board = new Chess('8/8/8/1r6/8/8/4B3/8 w - - 0 1');
    expect(totalAttacks(board.fen())).toEqual({
      blackAttacks: 0,
      whiteAttacks: 5,
    });
  });

  it('should calculate attackers 3', () => {
    const board = new Chess('8/8/8/1r2B3/8/6b1/8/8 w - - 0 1');
    expect(totalAttacks(board.fen())).toEqual({
      blackAttacks: 6,
      whiteAttacks: 3,
    });
  });

  it('should calculate attackers 4', () => {
    const board = new Chess('4k3/8/2r1r3/8/2Q5/8/8/3K4 b - - 0 1');
    expect(totalAttacks(board.fen())).toEqual({
      blackAttacks: 9,
      whiteAttacks: 10,
    });
  });
});
