import { Board } from '../Model/Board';
import { GameColor } from '../Model/GameColor';
import { GameTree } from '../Model/GameTree';
import { Penguin } from '../Model/Penguin';
import { State } from '../Model/State';

const notSoSmall: Board.Board = {
  tiles: [
    [{ fish: 2 }, { fish: 4 }, {}],
    [{ fish: 1 }, { fish: 1 }, { fish: 2 }],
    [{ fish: 2 }, { fish: 4 }, {}],
    [{}, { fish: 4 }, { fish: 3 }],
    [{ fish: 2 }, {}, { fish: 3 }],
    [{}, { fish: 4 }, {}],
  ],
};

const smallBoard: Board.Board = {
  tiles: [
    [{ fish: 1 }, { fish: 2 }, { fish: 2 }],
    [{}, { fish: 2 }, { fish: 2 }],
    [{ fish: 1 }, { fish: 2 }, { fish: 2 }],
  ],
};

const teenyBoard: Board.Board = {
  tiles: [[{ fish: 2 }], [{ fish: 1 }], [{ fish: 4 }], [{ fish: 5 }]],
};

const teenyGameOverBoard: Board.Board = {
  tiles: [[{ fish: 2 }], [{ fish: 1 }], [{ fish: 4 }], [{ fish: 5 }]],
};

const smallTeams = [
  {
    penguins: [
      { position: { row: 1, column: 1 } },
      { position: { row: 2, column: 1 } },
    ],
    score: 0,
    color: GameColor.BLACK,
  },
  {
    penguins: [
      { position: { row: 0, column: 0 } },
      { position: { row: 1, column: 2 } },
    ],
    score: 0,
    color: GameColor.BROWN,
  },
] as Penguin.PenguinTeam[];

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

const strategyGame: State.GameState = {
  penguinTeams: strategyTeams,
  board: {
    tiles: [
      [{ fish: 1 }, { fish: 2 }],
      [{ fish: 1 }, { fish: 4 }],
      [{ fish: 1 }, { fish: 2 }],
      [{ fish: 2 }, { fish: 4 }],
    ],
  },
  turn: 0,
  playersTurn: 0,
};

const twelveByOneBoard: Board.Board = {
  tiles: [
    [{ fish: 1 }],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
    [{}],
    [{ fish: 3 }],
    [{ fish: 2 }],
    [{ fish: 6 }],
    [{ fish: 5 }],
    [{ fish: 4 }],
  ],
};

const twelveByOneStatePlaced = {
  board: twelveByOneBoard,
  turn: 1,
  playersTurn: 1,
  penguinTeams: [
    {
      penguins: [
        { position: { row: 0, column: 0 } },
        { position: { row: 2, column: 0 } },
        { position: { row: 4, column: 0 } },
        { position: { row: 10, column: 0 } },
      ],
      score: 1,
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

const teenyTeam = [
  {
    penguins: [{ position: { row: 0, column: 0 } }],
    score: 0,
    color: GameColor.BLACK,
  },
  {
    penguins: [{ position: { row: 1, column: 0 } }],
    score: 0,
    color: GameColor.RED,
  },
] as Penguin.PenguinTeam[];

const smallGame: State.GameState = {
  //players: [player2, player3],
  penguinTeams: smallTeams,
  board: smallBoard,
  turn: 1,
  playersTurn: 1,
};

const notSoSmallGame: State.GameState = {
  //players: [player2, player3],
  penguinTeams: smallTeams,
  board: notSoSmall,
  turn: 1,
  playersTurn: 1,
};

const teenyGame: State.GameState = {
  //players: [player3, player1],
  penguinTeams: teenyTeam,
  board: teenyBoard,
  turn: 1,
  playersTurn: 1,
};

const teenyGameOver: State.GameState = {
  //players: [player3, player1],
  penguinTeams: teenyTeam,
  board: teenyGameOverBoard,
  turn: 1,
  playersTurn: 1,
};

const tree = GameTree.generateWholeTree(teenyGame);

test('test for generating a tree', () => {
  const generator = GameTree.generateTree(teenyGame);
  let generateOneLevelDown = generator.next();

  expect(generateOneLevelDown.done).toBe(false);
  generateOneLevelDown = generateOneLevelDown as {
    value: GameTree.Game;
    done: false;
  };

  let childrenLevel1 = generateOneLevelDown.value
    .children as GameTree.ActionGameTuple[];

  expect(childrenLevel1).toHaveLength(2);
  expect(childrenLevel1[0][0]).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 2, column: 0 },
  });

  expect(childrenLevel1[0][1].state.board.tiles).toStrictEqual([
    [{ fish: 2 }],
    [{}],
    [{ fish: 4 }],
    [{ fish: 5 }],
  ]);

  expect(childrenLevel1[0][1].state.playersTurn).toBe(0);

  expect(childrenLevel1[0][1].state.penguinTeams[1]).toStrictEqual({
    penguins: [
      {
        position: {
          column: 0,
          row: 2,
        },
      },
    ],
    score: 1,
    color: GameColor.RED,
  });

  expect(childrenLevel1[1][0]).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 3, column: 0 },
  });

  const secondGeneration = generator.next().value as GameTree.Game;
  const sgFirstLevelChildren =
    secondGeneration.children ?? ([] as GameTree.ActionGameTuple[]);

  const sgSecondLevelChildren =
    sgFirstLevelChildren[0][1].children ?? ([] as GameTree.ActionGameTuple[]);

  expect(sgSecondLevelChildren).toHaveLength(1);
  // there was no move down to this level
  expect(sgSecondLevelChildren[0][0]).toBe(false);
  // current board
  expect(sgSecondLevelChildren[0][1].state.board.tiles).toStrictEqual([
    [
      {
        fish: 2,
      },
    ],
    [{}],
    [
      {
        fish: 4,
      },
    ],
    [
      {
        fish: 5,
      },
    ],
  ]);
  // same as last board
  expect(sgSecondLevelChildren[0][1].state.board.tiles).toStrictEqual(
    childrenLevel1[0][1].state.board.tiles
  );

  // turn has incremented
  expect(sgSecondLevelChildren[0][1].state.playersTurn).toStrictEqual(1);

  expect(sgSecondLevelChildren[0][1].state.turn).toStrictEqual(3);

  const thirdGeneration = generator.next().value as GameTree.Game;
  const tgFirstLevelChildren =
    thirdGeneration.children ?? ([] as GameTree.ActionGameTuple[]);

  const tgSecondLevelChildren =
    tgFirstLevelChildren[0][1].children ?? ([] as GameTree.ActionGameTuple[]);

  const tgThirdLevelChildren =
    tgSecondLevelChildren[0][1].children ?? ([] as GameTree.ActionGameTuple[]);

  // check the state of the board after traversing down the side we've been checking

  expect(tgThirdLevelChildren).toHaveLength(1);
  // what move did I take to get here
  expect(tgThirdLevelChildren[0][0]).toStrictEqual({
    from: { row: 2, column: 0 },
    to: { row: 3, column: 0 },
  });
  expect(tgThirdLevelChildren[0][1].state.board.tiles).toStrictEqual([
    [
      {
        fish: 2,
      },
    ],
    [{}],
    [{}],
    [
      {
        fish: 5,
      },
    ],
  ]);

  expect(State.canAnyPenguinBeMoved(tgThirdLevelChildren[0][1].state)).toBe(
    false
  );
  expect(generator.next().done).toBe(true);
});

test('test areThereAnyMorePotentialGameStates', () => {
  expect(
    GameTree.areThereAnyMorePotentialGameStates({ state: teenyGame })
  ).toBe(true);

  const generator = GameTree.generateTree(teenyGame);
  expect(
    GameTree.areThereAnyMorePotentialGameStates(generator.next().value)
  ).toBe(true);
  expect(
    GameTree.areThereAnyMorePotentialGameStates(generator.next().value)
  ).toBe(true);
  expect(
    GameTree.areThereAnyMorePotentialGameStates(generator.next().value)
  ).toBe(false);
});

test('test foldr but for trees', () => {
  // (element: State.GameState, previous: T) => T
  const add1Combinator = (element: State.GameState, previous: number) => {
    return previous + 1;
  };
  expect(GameTree.applyFunctionToChildren(teenyGame, add1Combinator, 0)).toBe(
    6
  );
  expect(
    GameTree.applyFunctionToChildren(smallGame, add1Combinator, 0)
  ).toBeTruthy();

  // this is to illustrate that we can run this test
  expect(
    GameTree.applyFunctionToChildren(notSoSmallGame, add1Combinator, 0)
  ).toBeTruthy();

  const getEndNumberOfTurns = (element: State.GameState, previous: number) => {
    return Math.max(previous, element.turn);
  };

  expect(
    GameTree.applyFunctionToChildren(teenyGame, getEndNumberOfTurns, 0)
  ).toBe(4);

  expect(
    GameTree.applyFunctionToChildren(smallGame, getEndNumberOfTurns, 0)
  ).toBeTruthy();

  const getMaxPlayerScore = (element: State.GameState, previous: number) => {
    const currPlayer = element.playersTurn;
    const currPlayerTeam = State.getCurrentPenguinTeam(element);

    return Math.max(previous, currPlayerTeam.score);
  };

  expect(
    GameTree.applyFunctionToChildren(teenyGame, getMaxPlayerScore, 0)
  ).toBe(1);
});

test('test query state', () => {
  const action1 = (state: State.GameState) => {
    const to = { row: 2, column: 0 };
    const from = { row: 1, column: 0 };

    return State.movePenguin(1, { from, to }, state);
  };

  const action2 = (state: State.GameState) => {
    return State.incrementTurn(state);
  };

  const badAction2 = (state: State.GameState) => {
    return teenyGame;
  };

  const action3 = (state: State.GameState) => {
    const to = { row: 3, column: 0 };
    const from = { row: 2, column: 0 };
    return State.movePenguin(1, { to, from }, state);
  };

  expect(GameTree.queryState(teenyGame, [action1, badAction2, action3])).toBe(
    1
  );

  expect(
    Number(GameTree.queryState(teenyGame, [action1, action2, action3]))
  ).toBeNaN();

  const resultGame = GameTree.queryState(teenyGame, [
    action1,
    action2,
    action3,
  ]) as State.GameState;

  expect(State.canAnyPenguinBeMoved(resultGame)).toBe(false);

  expect(resultGame).toStrictEqual({
    penguinTeams: [
      {
        penguins: [{ position: { row: 0, column: 0 } }],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 3, column: 0 } }],
        score: 5,
        color: GameColor.RED,
      },
    ] as Penguin.PenguinTeam[],
    board: {
      tiles: [[{ fish: 2 }], [{}], [{}], [{ fish: 5 }]],
    },
    playersTurn: 0,
    turn: 4,
  } as State.GameState);
});

test('generate children', () => {
  const children = GameTree.generateChildren(strategyGame);

  expect(children).toHaveLength(1);

  expect(children[0][0]).toStrictEqual({
    from: {row: 3, column: 1}, to: {row: 1, column: 1}
  });

  expect(children[0][1].state.playersTurn).toBe(1);

  const twelveByOneChildren = GameTree.generateChildren(twelveByOneStatePlaced);
  expect(twelveByOneChildren).toHaveLength(3);

  const twelveByOneNextMove = State.movePenguin(1, 
    {
      from: {row: 7, column: 0},
      to: {row: 9, column: 0}
    },
    twelveByOneStatePlaced);

  const twelveByOneThirdMove = State.movePenguin(0, 
    {
      from: {row: 10, column: 0},
      to: {row: 8, column: 0}
    },
    twelveByOneNextMove);  

  const twelveByOneThirdChildren = GameTree.generateChildren(twelveByOneThirdMove); 
  expect(twelveByOneThirdChildren).toHaveLength(1);
  
  expect(twelveByOneThirdChildren[0][0]).toStrictEqual({
    from: {row: 9, column: 0},
    to: {row: 11, column: 0}
  });

});

test('generate entire tree', () => {
  const children = tree.children as GameTree.ActionGameTuple[];
  expect(children).toHaveLength(2);

  expect(children[0][0]).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 2, column: 0 },
  });
  expect(children[1][0]).toStrictEqual({
    from: { row: 1, column: 0 },
    to: { row: 3, column: 0 },
  });

  expect(children[0][1].state).toStrictEqual({
    penguinTeams: [
      {
        penguins: [{ position: { row: 0, column: 0 } }],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 2, column: 0 } }],
        score: 1,
        color: GameColor.RED,
      },
    ] as Penguin.PenguinTeam[],
    board: {
      tiles: [[{ fish: 2 }], [{}], [{ fish: 4 }], [{ fish: 5 }]],
    },
    playersTurn: 0,
    turn: 2,
  });

  const grandChildren1 = children[0][1].children as GameTree.ActionGameTuple[];
  expect(grandChildren1).toHaveLength(1);

  expect(grandChildren1[0][0]).toBe(false);
  expect(grandChildren1[0][1].state).toStrictEqual({
    penguinTeams: [
      {
        penguins: [{ position: { row: 0, column: 0 } }],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 2, column: 0 } }],
        score: 1,
        color: GameColor.RED,
      },
    ] as Penguin.PenguinTeam[],
    board: {
      tiles: [[{ fish: 2 }], [{}], [{ fish: 4 }], [{ fish: 5 }]],
    },
    playersTurn: 1,
    turn: 3,
  });

  const greatGrandChildren1 = grandChildren1[0][1]
    .children as GameTree.ActionGameTuple[];
  expect(greatGrandChildren1).toHaveLength(1);
  expect(greatGrandChildren1[0][0]).toStrictEqual({
    from: { row: 2, column: 0 },
    to: { row: 3, column: 0 },
  });
  expect(greatGrandChildren1[0][1].state).toStrictEqual({
    penguinTeams: [
      {
        penguins: [{ position: { row: 0, column: 0 } }],
        score: 0,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 3, column: 0 } }],
        score: 5,
        color: GameColor.RED,
      },
    ] as Penguin.PenguinTeam[],
    board: {
      tiles: [[{ fish: 2 }], [{}], [{}], [{ fish: 5 }]],
    },
    playersTurn: 0,
    turn: 4,
  });

  const grandChildren2 = children[1][1].children as GameTree.ActionGameTuple[];
  expect(grandChildren2).toHaveLength(1);

  expect(grandChildren2[0][0]).toStrictEqual({
    from: { row: 0, column: 0 },
    to: { row: 2, column: 0 },
  });
  expect(grandChildren2[0][1].state).toStrictEqual({
    penguinTeams: [
      {
        penguins: [{ position: { row: 2, column: 0 } }],
        score: 2,
        color: GameColor.BLACK,
      },
      {
        penguins: [{ position: { row: 3, column: 0 } }],
        score: 1,
        color: GameColor.RED,
      },
    ] as Penguin.PenguinTeam[],
    board: {
      tiles: [[{}], [{}], [{ fish: 4 }], [{ fish: 5 }]],
    },
    playersTurn: 1,
    turn: 3,
  });
});

test('test new foldr', () => {
  const identity = (
    element: GameTree.ActionGameTuple,
    accumulator: GameTree.ActionGameTuple[]
  ): GameTree.ActionGameTuple => {
    if (accumulator.length === 0) {
      return [element[0], { state: element[1].state }];
    }
    return [element[0], { state: element[1].state, children: accumulator }];
  };

  const identityResult = GameTree.applyCombinatorToChildren<
    GameTree.ActionGameTuple
  >([false, { state: teenyGame }], identity, 10);

  expect(identityResult).toStrictEqual([false, tree]);
});
