import { Moves } from '../Model/Moves';
import { Board } from '../Model/Board';
import { Penguin } from '../Model/Penguin';
import { GameColor } from '../Model/GameColor';
import { State } from '../Model/State';

const testBoard: Board.Board = Board.createBoard(
  6,
  2,
  [{ row: 3, column: 0 }],
  1,
  11
);

const testTeams: Penguin.PenguinTeam[] = [
  {
    color: GameColor.RED,
    penguins: [
      {position: {row: 0, column: 0}},
      {position: {row: 4, column: 1}}
    ],
    score: 0
  },
  {
    color: GameColor.WHITE,
    penguins: [
      {position: {row: 2, column: 1}},
      {position: {row: 5, column: 1}},
    ],
    score: 0
  }
];

const testGame: State.GameState = {
  penguinTeams: testTeams,
  board: testBoard,
  turn: 0,
  playersTurn: 0
}

const smallBoard: Board.Board = { tiles: [[{ fish: 1 }]] };

const smallTeams: Penguin.PenguinTeam[] = [
  {
    color: GameColor.RED,
    penguins: [{
      position: {row: 0, column: 0}
    }],
    score: 0
  }
];

const smallGame: State.GameState = {
  board: smallBoard,
  penguinTeams: smallTeams,
  turn: 0,
  playersTurn: 0
}

test('tests for getAllMoves', () => {
  const noMoves = Moves.getAllDestinations({ row: 0, column: 0 }, smallGame);
  const test1 = Moves.getAllDestinations({ row: 0, column: 0 }, testGame);
  const test2 = Moves.getAllDestinations({ row: 2, column: 1 }, testGame);
  expect(noMoves).toStrictEqual([]);
  expect(test1).toStrictEqual([
    { row: 1, column: 0 },
    { row: 2, column: 0 },
    { row: 4, column: 0 },
  ]);
  expect(test2).toStrictEqual([
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 3, column: 1 },
  ]);
});

test('tests for getDirectionHelper', () => {
  // Get Up
  const oneUp = Moves.getAllDirectionHelper({ row: 4, column: 0 }, testGame, Moves.getUp);
  const twoUp = Moves.getAllDirectionHelper({ row: 5, column: 1 }, testGame, Moves.getUp);
  const noUp = Moves.getAllDirectionHelper({ row: 5, column: 0 }, testGame, Moves.getUp);
  expect(oneUp).toStrictEqual([
    { row: 2, column: 0 },
  ]);
  expect(twoUp).toStrictEqual([
    { row: 3, column: 1 },
    { row: 1, column: 1 },
  ]);
  expect(noUp).toStrictEqual([]);

  // Get Down
  const twoDown = Moves.getAllDirectionHelper({ row: 0, column: 0 }, testGame, Moves.getDown);
  const noDown = Moves.getAllDirectionHelper({ row: 1, column: 0 }, testGame, Moves.getDown);
  expect(twoDown).toStrictEqual([
    { row: 2, column: 0 },
    { row: 4, column: 0 },
  ]);
  expect(noDown).toStrictEqual([]);

  // Get Diagonal Right Up
  const twoDRU = Moves.getAllDirectionHelper(
    { row: 2, column: 0 },
    testGame,
    Moves.getDiagonalRightUp
  );
  const noDRU = Moves.getAllDirectionHelper({ row: 5, column: 0 }, testGame, Moves.getDiagonalRightUp);
  expect(twoDRU).toStrictEqual([
    { row: 1, column: 0 },
    { row: 0, column: 1 },
  ]);
  expect(noDRU).toStrictEqual([]);

  // Get Diagonal Right Down
  const oneDRD = Moves.getAllDirectionHelper(
    { row: 0, column: 0 },
    testGame,
    Moves.getDiagonalRightDown
  );
  const noDRD = Moves.getAllDirectionHelper(
    { row: 2, column: 0 },
    testGame,
    Moves.getDiagonalRightDown
  );
  expect(oneDRD).toStrictEqual([
    { row: 1, column: 0 },
  ]);
  expect(noDRD).toStrictEqual([]);

  // Get Diagonal Left Up
  const oneDLU = Moves.getAllDirectionHelper(
    { row: 2, column: 1 },
    testGame,
    Moves.getDiagonalLeftUp
  );
  const noDLU = Moves.getAllDirectionHelper({ row: 4, column: 1 }, testGame, Moves.getDiagonalLeftUp);
  expect(oneDLU).toStrictEqual([
    { row: 1, column: 0 },
  ]);
  expect(noDLU).toStrictEqual([]);
 
  // Get Diagonal Left Down
  const twoDLD = Moves.getAllDirectionHelper(
    { row: 0, column: 1 },
    testGame,
    Moves.getDiagonalLeftDown
  );
  const noDLD = Moves.getAllDirectionHelper(
    { row: 2, column: 1 },
    testGame,
    Moves.getDiagonalLeftDown
  );
  expect(twoDLD).toStrictEqual([
    { row: 1, column: 0 },
    { row: 2, column: 0 },
  ]);
  expect(noDLD).toStrictEqual([]);
});

test('tests for the getUp', () => {
  const moveValid = Moves.getUp({ row: 2, column: 0 }, testBoard);
  const moveInvalidHole = Moves.getUp({ row: 5, column: 0 }, testBoard);
  const moveInvalidOutOfBounds = Moves.getUp({ row: 1, column: 1 }, testBoard);
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 0, column: 0 });
});

test('tests for the getDown', () => {
  const moveValid = Moves.getDown({ row: 2, column: 0 }, testBoard);
  const moveInvalidHole = Moves.getDown({ row: 1, column: 0 }, testBoard);
  const moveInvalidOutOfBounds = Moves.getDown(
    { row: 4, column: 1 },
    testBoard
  );
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 4, column: 0 });
});

test('tests for the getDiagonalRightUp', () => {
  const moveValid = Moves.getDiagonalRightUp({ row: 2, column: 0 }, testBoard);
  const moveValidWithColChange = Moves.getDiagonalRightUp(
    { row: 5, column: 0 },
    testBoard
  );
  const moveInvalidHole = Moves.getDiagonalRightUp(
    { row: 4, column: 0 },
    testBoard
  );
  const moveInvalidOutOfBounds = Moves.getDiagonalRightUp(
    { row: 1, column: 2 },
    testBoard
  );
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 1, column: 0 });
  expect(moveValidWithColChange).toStrictEqual({ row: 4, column: 1 });
});

test('tests for the getDiagonalRightDown', () => {
  const moveValid = Moves.getDiagonalRightDown(
    { row: 0, column: 0 },
    testBoard
  );
  const moveValidWithColChange = Moves.getDiagonalRightDown(
    { row: 1, column: 0 },
    testBoard
  );
  const moveInvalidHole = Moves.getDiagonalRightDown(
    { row: 2, column: 0 },
    testBoard
  );
  const moveInvalidOutOfBounds = Moves.getDiagonalRightDown(
    { row: 5, column: 0 },
    testBoard
  );
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 1, column: 0 });
  expect(moveValidWithColChange).toStrictEqual({ row: 2, column: 1 });
});

test('tests for the getDiagonalLeftUp', () => {
  const moveValid = Moves.getDiagonalLeftUp({ row: 1, column: 0 }, testBoard);
  const moveValidWithColChange = Moves.getDiagonalLeftUp(
    { row: 2, column: 1 },
    testBoard
  );
  const moveInvalidHole = Moves.getDiagonalLeftUp(
    { row: 4, column: 1 },
    testBoard
  );
  const moveInvalidOutOfBounds = Moves.getDiagonalLeftUp(
    { row: 0, column: 0 },
    testBoard
  );
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 0, column: 0 });
  expect(moveValidWithColChange).toStrictEqual({ row: 1, column: 0 });
});

test('tests for the getDiagonalLeftDown', () => {
  const moveValid = Moves.getDiagonalLeftDown({ row: 1, column: 0 }, testBoard);
  const moveValidWithColChange = Moves.getDiagonalLeftDown(
    { row: 0, column: 1 },
    testBoard
  );
  const moveInvalidHole = Moves.getDiagonalLeftDown(
    { row: 2, column: 1 },
    testBoard
  );
  const moveInvalidOutOfBounds = Moves.getDiagonalLeftDown(
    { row: 4, column: 0 },
    testBoard
  );
  expect(moveInvalidHole).toStrictEqual(null);
  expect(moveInvalidOutOfBounds).toStrictEqual(null);
  expect(moveValid).toStrictEqual({ row: 2, column: 0 });
  expect(moveValidWithColChange).toStrictEqual({ row: 1, column: 0 });
});

test('tests for move tie breaker', () => {
  expect(Moves.moveTieBreaker(
    { from: {row: 0, column: 0}, to: {row: 1, column: 0} },
    { from: {row: 1, column: 1}, to: {row: 0, column: 1} }
  )).toStrictEqual({
    from: {row: 0, column: 0}, 
    to: {row: 1, column: 0}
  });

  expect(Moves.moveTieBreaker(
    { from: {row: 0, column: 1}, to: {row: 1, column: 0} },
    { from: {row: 0, column: 0}, to: {row: 1, column: 0} }
  )).toStrictEqual({
    from: {row: 0, column: 0}, 
    to: {row: 1, column: 0}
  });

  expect(Moves.moveTieBreaker(
    { from: {row: 2, column: 2}, to: {row: 3, column: 2} },
    { from: {row: 2, column: 2}, to: {row: 1, column: 2} }
  )).toStrictEqual({
    from: {row: 2, column: 2}, 
    to: {row: 1, column: 2}
  });

  expect(Moves.moveTieBreaker(
    { from: {row: 3, column: 3}, to: {row: 3, column: 1} },
    { from: {row: 3, column: 3}, to: {row: 3, column: 2} }
  )).toStrictEqual({
    from: {row: 3, column: 3}, 
    to: {row: 3, column: 1}
  });

  expect(Moves.moveTieBreaker(
    { from: {row: 3, column: 3}, to: {row: 3, column: 2} },
    { from: {row: 3, column: 3}, to: {row: 3, column: 2} }
  )).toBe(false);

});
