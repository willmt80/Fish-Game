import { GameColor } from '../Model/GameColor';
import { State } from '../Model/State';
import { Penguin } from '../Model/Penguin';
import { Board } from '../Model/Board';
import { Moves } from '../Model/Moves';
import { Position } from '../Model/Position';

const smallBoard: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 4 }],
    [{}, { fish: 1 }],
  ],
};

const otherSmallBoard: Board.Board = {
  tiles: [
    [{ fish: 3 }],
    [{}],
    [{ fish: 3 }],
    [{ fish: 3 }],
    [{ fish: 3 }],
    [{ fish: 3 }],
  ],
};

const smallTeams = [
  {
    penguins: [
      { position: { row: 1, column: 1 } },
      { position: { row: 2, column: 1 } },
    ],
    score: 0,
    color: GameColor.RED,
  },
  {
    penguins: [
      { position: { row: 0, column: 0 } },
      { position: { row: 1, column: 0 } },
    ],
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

const simpleGame: State.GameState = State.createGameState(
  [GameColor.RED, GameColor.BROWN],
  2,
  3
);

const sixByOneGame: State.GameState = {
  penguinTeams: [
    { penguins: [], color: GameColor.RED, score: 0 },
    { penguins: [], color: GameColor.BROWN, score: 0 },
  ],
  board: otherSmallBoard,
  playersTurn: 0,
  turn: 0,
};

const holeGame: State.GameState = State.addHolesToGameBoard(simpleGame, [
  { row: 1, column: 1 },
]);

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

const twelveByOneTeams = [
  {
    penguins: [
      {position: {row: 0, column: 0}},
      {position: {row: 4, column: 0}}
    ],
    score: 0,
    color: GameColor.RED,
  },
  {
    penguins: [
      {position: {row: 1, column: 0}},
      {position: {row: 5, column: 0}}
    ],
    score: 0,
    color: GameColor.BROWN,
  },
];

const twelveByOneGame: State.GameState = {
  penguinTeams: twelveByOneTeams,
  board: twelveByOneBoard,
  turn: 0,
  playersTurn: 0,
};

test('create game tests', () => {
  expect(
    State.createGameState([GameColor.RED, GameColor.BROWN], 2, 3).turn
  ).toBe(0);

  const penguinTeams = [
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

  expect(
    State.createGameState([GameColor.RED, GameColor.BROWN], 2, 3).penguinTeams
  ).toStrictEqual(penguinTeams);
});

test('test add holes to game board', () => {
  expect(holeGame.board.tiles[1][1]).toStrictEqual({});
  expect(() =>
    State.addHolesToGameBoard(simpleGame, [{ row: 10, column: 1 }])
  ).toThrow(RangeError('Holes must be within the range of the board'));
});

test('tests for placing a penguin at a position in the state', () => {
  expect(() => State.placePenguin(0, { row: 4, column: 1 }, holeGame)).toThrow(
    RangeError('No space at the given positions')
  );

  expect(() => State.placePenguin(0, { row: 1, column: 1 }, holeGame)).toThrow(
    Error('No active tile at the given positions')
  );
  expect(
    State.placePenguin(0, { row: 0, column: 0 }, holeGame).penguinTeams[0]
  ).toStrictEqual({
    penguins: [{ position: { row: 0, column: 0 } }],
    score: 0,
    color: GameColor.RED,
  });

  expect(
    State.placePenguin(0, { row: 0, column: 0 }, holeGame).playersTurn
  ).toBe(1);

  const penguinPlacedMultiple = State.placePenguin(
    0,
    { row: 1, column: 0 },
    State.placePenguin(
      1,
      { row: 0, column: 2 },
      State.placePenguin(0, { row: 0, column: 1 }, holeGame)
    )
  );

  const penguinPlacedMultipleExpect = [
    {
      penguins: [
        {
          position: {
            row: 0,
            column: 1,
          },
        },
        {
          position: {
            row: 1,
            column: 0,
          },
        },
      ],
      score: 0,
      color: GameColor.RED,
    },
    {
      penguins: [
        {
          position: {
            row: 0,
            column: 2,
          },
        },
      ],
      score: 0,
      color: GameColor.BROWN,
    },
  ];

  expect(penguinPlacedMultiple.penguinTeams).toStrictEqual(
    penguinPlacedMultipleExpect
  );

  // cannot place two penguins in the same place
  expect(() =>
    State.placePenguin(
      1,
      { row: 1, column: 0 },
      State.placePenguin(0, { row: 1, column: 0 }, holeGame)
    )
  ).toThrow(
    Error('Cannot place penguin where another penguin is already placed')
  );
});

test('test getPenguinAtPosition', ()=> {
  expect(State.getPenguinAtPosition(twelveByOneGame, {row: 0, column: 0})).toStrictEqual(
    {
      position: {row: 0, column: 0}
    }
  );

  expect(State.getPenguinAtPosition(twelveByOneGame, {row: 5, column: 0})).toStrictEqual(
    {
      position: {row: 5, column: 0}
    }
  );

  expect(State.getPenguinAtPosition(twelveByOneGame, {row: 2, column: 0})).toBeNull();
});

test('test move penguin', () => {
  const penguinPlacedMultiple = State.placePenguin(
    1,
    { row: 1, column: 0 },
    State.placePenguin(0, { row: 0, column: 1 }, holeGame)
  );

  // cannot place penguin where another is already sitting
  expect(() =>
    State.movePenguin(
      1,
      { from: { row: 1, column: 0 }, to: { row: 0, column: 1 } },
      penguinPlacedMultiple
    )
  ).toThrow(
    Error('Cannot place penguin where another penguin is already placed')
  );

  const jumpOverState = State.placePenguin(
    1,
    { row: 2, column: 0 },
    State.placePenguin(0, { row: 0, column: 0 }, sixByOneGame)
  );

  expect(() =>
    State.movePenguin(
      0,
      {
        from: { row: 0, column: 0 },
        to: { row: 4, column: 0 },
      },
      jumpOverState
    )
  ).toThrow(Error('This move is illegal'));

  // cannot place penguin on a hole
  expect(() =>
    State.movePenguin(
      1,
      { from: { row: 1, column: 0 }, to: { row: 1, column: 1 } },
      penguinPlacedMultiple
    )
  ).toThrow(Error('No active tile at the given positions'));

  const validMove = State.movePenguin(
    1,
    { from: { row: 1, column: 0 }, to: { row: 0, column: 0 } },
    penguinPlacedMultiple
  );

  // valid move does not error
  expect(validMove.penguinTeams[1].penguins[0]).toStrictEqual({
    position: { row: 0, column: 0 },
  });

  expect(validMove.penguinTeams[1].score).toBeGreaterThan(0);
  expect(Board.getFishOnTile(validMove.board, { row: 1, column: 0 })).toBe(0);

  const twelveByOneMove = State.movePenguin(
    0,
    { from: { row: 0, column: 0 }, to: { row: 2, column: 0 } },
    twelveByOneGame
  );

  expect(twelveByOneMove.penguinTeams[0].score).toBe(1);
  expect(Board.getFishOnTile(twelveByOneMove.board, { row: 0, column: 0 })).toBe(0);
  expect(twelveByOneMove.penguinTeams[0].penguins[0]).toStrictEqual({
    position: { row: 2, column: 0 },
  });

  const twelveByOneMove2 = State.movePenguin(
    1,
    { from: { row: 5, column: 0 }, to: { row: 6, column: 0 } },
    twelveByOneMove
  );

  expect(twelveByOneMove2.penguinTeams[1].score).toBe(4);
  expect(Board.getFishOnTile(twelveByOneMove2.board, { row: 5, column: 0 })).toBe(0);
  expect(twelveByOneMove2.penguinTeams[1].penguins[1]).toStrictEqual({
    position: { row: 6, column: 0 },
  });

  const twelveByOneMove3 = State.movePenguin(
    0,
    { from: { row: 2, column: 0 }, to: { row: 3, column: 0 } },
    twelveByOneMove2
  );

  expect(twelveByOneMove3.penguinTeams[0].score).toBe(3);
  expect(Board.getFishOnTile(twelveByOneMove3.board, { row: 2, column: 0 })).toBe(0);
  expect(twelveByOneMove3.penguinTeams[0].penguins[0]).toStrictEqual({
    position: { row: 3, column: 0 },
  });
  
  const twelveByOneMove4 = State.movePenguin(
    1,
    { from: { row: 6, column: 0 }, to: { row: 10, column: 0 } },
    twelveByOneMove2
  );

  expect(twelveByOneMove4.penguinTeams[1].score).toBe(5);
  expect(Board.getFishOnTile(twelveByOneMove4.board, { row: 6, column: 0 })).toBe(0);
  expect(twelveByOneMove4.penguinTeams[1].penguins[1]).toStrictEqual({
    position: { row: 10, column: 0 },
  });

});

test('test can any Penguin be moved', () => {
  expect(State.canAnyPenguinBeMoved(simpleGame)).toBe(false);
  const penguinPlacedMultiple = State.placePenguin(
    1,
    { row: 1, column: 0 },
    State.placePenguin(
      0,
      { row: 0, column: 2 },
      State.placePenguin(1, { row: 0, column: 1 }, holeGame)
    )
  );
  expect(State.canAnyPenguinBeMoved(penguinPlacedMultiple)).toBe(true);

  const placeMoreHoles = State.addHolesToGameBoard(penguinPlacedMultiple, [
    { row: 0, column: 0 },
    { row: 1, column: 2 },
  ]);

  expect(State.canAnyPenguinBeMoved(placeMoreHoles)).toBe(false);
});

test('test for isValidPenguinPlacement', () => {
  const penguin1Game: State.GameState = State.placePenguin(
    0,
    {
      row: 1,
      column: 2,
    },
    holeGame
  );

  expect(State.isValidPenguinPlacement({ row: 0, column: 0 }, holeGame)).toBe(
    true
  );

  expect(State.isValidPenguinPlacement({ row: 1, column: 1 }, holeGame)).toBe(
    false
  );

  expect(
    State.isValidPenguinPlacement({ row: 1, column: 2 }, penguin1Game)
  ).toBe(false);
});

test('test for areGameStatesEqual', () => {
  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(true);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [{ position: { row: 1, column: 1 } }],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.BLACK,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 1,
          color: GameColor.BROWN,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, {}],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ] as Penguin.PenguinTeam[],
      board: {
        tiles: [[{}, { fish: 1 }]],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 2 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 2,
      playersTurn: 1,
    })
  ).toBe(false);

  expect(
    State.areGameStatesEqual(smallGame, {
      penguinTeams: [
        {
          penguins: [
            { position: { row: 1, column: 1 } },
            { position: { row: 2, column: 1 } },
          ],
          score: 0,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 1, column: 0 } },
          ],
          score: 0,
          color: GameColor.BROWN,
        },
      ],
      board: {
        tiles: [
          [{ fish: 2 }, { fish: 4 }],
          [{}, { fish: 1 }],
        ],
      },
      turn: 1,
      playersTurn: 2,
    })
  ).toBe(false);
});

test('test incrementTurn', () => {
  expect(State.incrementTurn(smallGame).turn).toStrictEqual(2);

  expect(State.incrementTurn(smallGame).playersTurn).toStrictEqual(0);
});

test('test removePlayer', () => {
  expect(State.removePlayer(smallGame, 2)).toStrictEqual({
    penguinTeams: [
      {
        penguins: [
          { position: { row: 1, column: 1 } },
          { position: { row: 2, column: 1 } },
        ],
        score: 0,
        color: GameColor.RED,
      },
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        color: GameColor.BROWN,
        score: 0,
      },
    ],
    board: {
      tiles: [
        [{ fish: 2 }, { fish: 4 }],
        [{}, { fish: 1 }],
      ],
    },
    turn: 1,
    playersTurn: 1,
  });

  expect(State.removePlayer(smallGame, 0)).toStrictEqual({
    penguinTeams: [
      {
        penguins: [
          { position: { row: 0, column: 0 } },
          { position: { row: 1, column: 0 } },
        ],
        color: GameColor.BROWN,
        score: 0,
      },
    ],
    board: {
      tiles: [
        [{ fish: 2 }, { fish: 4 }],
        [{}, { fish: 1 }],
      ],
    },
    turn: 1,
    playersTurn: 0,
  });

  const teams = {
    turn: 0,
    playersTurn: 2,
    penguinTeams: [
      {
        score: 0,
        color: GameColor.RED,
        penguins: [],
      },
      {
        score: 0,
        color: GameColor.BROWN,
        penguins: [],
      },
      {
        score: 0,
        color: GameColor.WHITE,
        penguins: [],
      },
      {
        score: 0,
        color: GameColor.BLACK,
        penguins: [],
      },
    ],
    board: smallBoard,
  };

  expect(State.removePlayer(teams, 2).playersTurn).toBe(2);
  expect(State.removePlayer(teams, 3).playersTurn).toBe(2);
  expect(State.removePlayer({ ...teams, playersTurn: 3 }, 3).playersTurn).toBe(
    0
  );
  expect(State.removePlayer({ ...teams, playersTurn: 2 }, 0).playersTurn).toBe(
    1
  );
  expect(State.removePlayer({ ...teams, playersTurn: 3 }, 1).playersTurn).toBe(
    2
  );
});
