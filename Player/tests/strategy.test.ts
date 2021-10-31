import { Strategy } from '../src/Strategy';
import { Board } from '../../Common/src/Model/Board';
import { State } from '../../Common/src/Model/State';
import { GameColor } from '../../Common/src/Model/GameColor';
import { Penguin } from '../../Common/src/Model/Penguin';
import { GameTree } from '../../Common/src/Model/GameTree';
import { on } from 'process';

const smallBoard: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 4 }],
    [{}, { fish: 1 }],
  ],
};

const flatBoard: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 1 }, {fish: 5}],
    [{fish: 5}, { fish: 3 }, {fish: 2}],
  ],
};

const oneTeam: Penguin.PenguinTeam[] = [{
  penguins: [{position: {row: 1, column: 1}}],
  color: GameColor.RED,
  score: 0
}];

const oneGame: State.GameState = {
  penguinTeams: oneTeam,
  board: flatBoard,
  playersTurn: 0,
  turn: 0
}

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

const twelveByOneBoard: Board.Board = {
  tiles: [
    [{ fish: 1 }],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
    [{ fish: 1 }],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
  ],
};

const twelveByOneStatePlaced = {
  board: twelveByOneBoard,
  turn: 0,
  playersTurn: 0,
  penguinTeams: [
    {
      penguins: [
        { position: { row: 0, column: 0 } },
        { position: { row: 2, column: 0 } },
        { position: { row: 4, column: 0 } },
        { position: { row: 6, column: 0 } },
      ],
      score: 0,
      color: GameColor.RED,
    },
    {
      penguins: [
        { position: { row: 1, column: 0 } },
        { position: { row: 3, column: 0 } },
        { position: { row: 5, column: 0 } },
        { position: { row: 7, column: 0 } },
      ],
      score: 0,
      color: GameColor.BROWN,
    },
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

const sixByOneBoardOtherTurn: State.GameState = {
  penguinTeams: sixByOneTeams,
  board: sixByOneBoardCopy,
  turn: 0,
  playersTurn: 1,
};

test('Test penguinPlacements', () => {
  expect(Strategy.penguinPlacements(smallGame)).toStrictEqual(
  { row: 0, column: 1 });

  const firstPenguin = State.placePenguin(1, {row: 0, column: 1}, smallGame);

  expect(
    () => Strategy.penguinPlacements(firstPenguin)
  ).toThrow(Error('No valid penguin placement available'));

  const firstPlacement = Strategy.penguinPlacements(tinyGame);
  expect(firstPlacement).toStrictEqual({ row: 0, column: 0 });

  const secondState = State.placePenguin(0, firstPlacement, tinyGame);
  const secondPlacement = Strategy.penguinPlacements(secondState);
  expect(secondPlacement).toStrictEqual({ row: 0, column: 1 });

  const thirdState = State.placePenguin(1, secondPlacement, secondState);
  const thirdPlacement = Strategy.penguinPlacements(thirdState);
  expect(thirdPlacement).toStrictEqual({ row: 1, column: 1 });

  const fourthState = State.placePenguin(0, thirdPlacement, thirdState);
  const fourthPlacement = Strategy.penguinPlacements(fourthState);
  expect(fourthPlacement).toStrictEqual({ row: 2, column: 0 });

  const fifthState = State.placePenguin(1, fourthPlacement, fourthState);
  const fifthPlacement = Strategy.penguinPlacements(fifthState);
  expect(fifthPlacement).toStrictEqual({ row: 2, column: 1 });

  const sixthState = State.placePenguin(0, fifthPlacement, fifthState);
  const sixthPlacement = Strategy.penguinPlacements(sixthState);
  expect(sixthPlacement).toStrictEqual( { row: 3, column: 1 });
});

test('test get next position', () => {
  const startingPosition = { row: 0, column: 0 };
  expect(Strategy.getNewPosition(startingPosition, 2)).toStrictEqual({
    row: 0,
    column: 1,
  });

  expect(
    Strategy.getNewPosition(
      {
        row: 1,
        column: 0,
      },
      2
    )
  ).toStrictEqual({
    row: 1,
    column: 1,
  });

  expect(
    Strategy.getNewPosition(
      {
        row: 0,
        column: 1,
      },
      2
    )
  ).toStrictEqual({
    row: 1,
    column: 0,
  });

  expect(
    Strategy.getNewPosition(
      {
        row: 1,
        column: 1,
      },
      2
    )
  ).toStrictEqual({
    row: 2,
    column: 0,
  });
});

test('test miniMax', () => {

  expect(Strategy.minimaxMove(sixByOneGame, 6)).toStrictEqual({
    from: { row: 0, column: 0 },
    to: { row: 4, column: 0 },
  });

  const otherSixByOne = { ...sixByOneGame, playersTurn: 1 };

  expect(Strategy.minimaxMove(otherSixByOne, -1)).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 2, column: 0 },
  });

  const strategyTeams = [
    {
      penguins: [{ position: { row: 3, column: 1 } }],
      score: 0,
      color: GameColor.RED,
    },
    {
      penguins: [{ position: { row: 2, column: 1 } }],
      score: 0,
      color: GameColor.BROWN,
    },
  ] as Penguin.PenguinTeam[];

  const oneTurnGame: State.GameState = {
    penguinTeams: strategyTeams,
    board: {
      tiles: [
        [{ fish: 1 }, { fish: 2 }],
        [{ fish: 1 }, { fish: 4 }],
        [{ fish: 1 }, { fish: 2 }],
        [{ fish: 2 }, { fish: 4 }],
      ],
    },
    playersTurn: 1,
    turn: 1
  }

  expect(Strategy.minimaxMove(oneTurnGame, -1)).toStrictEqual({
    from: { row: 2, column: 1 },
    to: { row: 1, column: 1 },
  });

  expect(Strategy.minimaxMove(oneTurnGame, 15)).toStrictEqual({
    from: { row: 2, column: 1 },
    to: { row: 1, column: 1 },
  });

  const otherOneTurnGame = { ...oneTurnGame, playersTurn: 0 };

  expect(Strategy.minimaxMove(otherOneTurnGame, -1)).toStrictEqual({
    from: { row: 3, column: 1 },
    to: { row: 1, column: 1 },
  });

  expect(Strategy.minimaxMove(strategyGame, -1)).toStrictEqual({
    from: { row: 0, column: 0 },
    to: { row: 2, column: 1 },
  });

  const otherGame = { ...strategyGame, playersTurn: 0 };

  expect(Strategy.minimaxMove(otherGame, -1)).toStrictEqual({
    from: { row: 1, column: 1 },
    to: { row: 0, column: 1 },
  });

  expect(Strategy.minimaxMove(sixByOneGame, 2)).toStrictEqual({
    from: { row: 0, column: 0 },
    to: { row: 2, column: 0 },
  });

  expect(Strategy.minimaxMove(otherSixByOne, 2)).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 2, column: 0 },
  });

  expect(Strategy.minimaxMove(twelveByOneStatePlaced, -1)).toStrictEqual({
    from: { row: 6, column: 0 },
    to: { row: 10, column: 0 },
  });

  
  const twelveByOne2ndMove = State.movePenguin(0, 
    {
      from: { row: 6, column: 0 },
      to: { row: 10, column: 0 },
    },
    twelveByOneStatePlaced);
  
  expect(Strategy.minimaxMove(twelveByOne2ndMove, -1)).toStrictEqual({
    from: { row: 7, column: 0 },
    to: { row: 9, column: 0 },
  });

  const twelveByOne3rdMove = State.movePenguin(1, 
    {
      from: { row: 7, column: 0 },
      to: { row: 9, column: 0 },
    },
    twelveByOne2ndMove);

  expect(Strategy.minimaxMove(twelveByOne3rdMove, -1)).toStrictEqual({
    from: { row: 10, column: 0 },
    to: { row: 8, column: 0 },
  });  

  const twelveByOne4thMove = State.movePenguin(0, 
    {
      from: { row: 10, column: 0 },
      to: { row: 11, column: 0 },
    },
    twelveByOne3rdMove);

  expect(Strategy.minimaxMove(twelveByOne4thMove, -1)).toStrictEqual({
    from: { row: 9, column: 0 },
    to: { row: 8, column: 0 },
  })
    
  expect(Strategy.minimaxMove(oneGame, -1)).toStrictEqual({
    from: { row: 1, column: 1 },
    to: { row: 0, column: 1 }
  });  
});
