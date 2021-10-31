import { Board } from '../../Common/src/Model/Board';
import { GameColor } from '../../Common/src/Model/GameColor';
import { Penguin } from '../../Common/src/Model/Penguin';
import { State } from '../../Common/src/Model/State';
import { HousePlayer } from '../src/Player';

const smallBoard: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 4 }],
    [{}, { fish: 1 }],
  ],
};

const sixByOneBoard: Board.Board = {
  tiles: [
    [{ fish: 1 }],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
  ],
};

const sixByOneBoardCopy: Board.Board = {
  tiles: [
    [{ fish: 1 }],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
  ],
};

const smallTeams = [
  {
    penguins: [{ position: { row: 1, column: 1 } }],
    score: 0,
    color: GameColor.RED,
  },
  {
    penguins: [{ position: { row: 0, column: 0 } }],
    score: 0,
    color: GameColor.BROWN,
  },
] as Penguin.PenguinTeam[];

const sixByOneTeams = [
  {
    penguins: [{ position: { row: 0, column: 0 } }],
    score: 0,
    color: GameColor.RED,
  },
  {
    penguins: [{ position: { row: 1, column: 0 } }],
    score: 0,
    color: GameColor.BROWN,
  },
];

const tinyTeams = [
  {
    penguins: [],
    score: 0,
    color: GameColor.RED,
  },
  {
    penguins: [],
    score: 0,
    color: GameColor.BROWN,
  },
] as Penguin.PenguinTeam[];

const smallGame: State.GameState = {
  penguinTeams: smallTeams,
  board: smallBoard,
  turn: 1,
  playersTurn: 1,
};

const tinyGame: State.GameState = {
  penguinTeams: tinyTeams,
  board: {
    tiles: [
      [{ fish: 1 }, { fish: 2 }],
      [{}, { fish: 4 }],
      [{ fish: 1 }, { fish: 2 }],
      [{}, { fish: 4 }],
    ],
  },
  turn: 1,
  playersTurn: 1,
};

const strategyGame: State.GameState = {
  penguinTeams: smallTeams,
  board: {
    tiles: [
      [{ fish: 1 }, { fish: 2 }],
      [{ fish: 1 }, { fish: 4 }],
      [{ fish: 1 }, { fish: 2 }],
      [{ fish: 2 }, { fish: 4 }],
    ],
  },
  turn: 1,
  playersTurn: 1,
};

const sixByOneGame: State.GameState = {
  penguinTeams: sixByOneTeams,
  board: sixByOneBoard,
  turn: 0,
  playersTurn: 0,
};

test('test that player uses the strategy for moves', () => {
  const player = HousePlayer;
  expect(player.getPenguinMove(sixByOneGame)).toStrictEqual({
    from: { row: 0, column: 0 },
    to: { row: 4, column: 0 },
  });

  expect(player.getPenguinMove({ ...sixByOneGame, playersTurn: 1 })).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 2, column: 0 },
  });
});

test('test that player uses the strategy for penguin placements', () => {
  const player = HousePlayer;
  expect(player.getPenguinPlacement(strategyGame)).toStrictEqual({
    row: 0,
    column: 1,
  });

  const strategyGameWithOnePlacement = State.placePenguin(
    0,
    { row: 0, column: 1 },
    strategyGame
  );

  expect(player.getPenguinPlacement(strategyGameWithOnePlacement)).toStrictEqual({
    row: 1,
    column: 0,
  });

  const strategyGameWithTwoPlacement = State.placePenguin(
    0,
    { row: 1, column: 0 },
    strategyGameWithOnePlacement
  );

  expect(player.getPenguinPlacement(strategyGameWithTwoPlacement)).toStrictEqual({
    row: 2,
    column: 0,
  });
});
