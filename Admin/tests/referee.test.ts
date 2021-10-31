import { Referee } from '../src/Referee';
import { PlayerInterface } from '../../Common/src/Interface/player-interface';
import { State } from '../../Common/src/Model/State';
import { Position } from '../../Common/src/Model/Position';
import { Strategy } from '../../Player/src/Strategy';
import { HousePlayer } from '../../Player/src/Player';
import { Board } from '../../Common/src/Model/Board';
import { GameColor } from '../../Common/src/Model/GameColor';
import { Space } from '../../Common/src/Model/Space';
import { Moves } from '../../Common/src/Model/Moves';

const badPlayerMoves: PlayerInterface.Player = {
  username: "a",
  age: 10,
  getPenguinMove: (state: State.GameState) => ({
    from: { row: -1, column: 1 },
    to: { row: 30, column: 30 },
  }),
  getPenguinPlacement: (state: State.GameState) => Strategy.penguinPlacements(state),
  gameOver: () => {},
  somePlayerChangedState: () => {},
  kickOut: () => {},
  gameIsStarting: () => {},
  gameSetupBegins: () => {},
  tournamentOver: () => true,
};

const badPlayerPlacements: PlayerInterface.Player = {
  username: "b",
  age: 10,
  getPenguinMove: (state: State.GameState) => Strategy.minimaxMove(state, 1),
  getPenguinPlacement: (state: State.GameState) => ({ row: 44, column: 55 }),
  gameOver: () => {},
  somePlayerChangedState: () => {},
  kickOut: () => {},
  gameIsStarting: () => {},
  gameSetupBegins: () => {},
  tournamentOver: () => true,
};

const timeoutPlayer: PlayerInterface.Player = {
  username: "c",
  age: 10,
  getPenguinMove: (state: State.GameState) => {
    while(true) {
    }
    return Strategy.minimaxMove(state, 1)
  },
  getPenguinPlacement: (state: State.GameState) => ({ row: 44, column: 55 }),
  gameOver: () => {},
  somePlayerChangedState: () => {},
  kickOut: () => {},
  gameIsStarting: () => {},
  gameSetupBegins: () => {},
  tournamentOver: () => true,
};

const goodPlayer = HousePlayer;

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

const tieBoard: Board.Board = {
  tiles: [
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
    [{ fish: 1 }],
  ],
};

const fourByFourBoard = {
  tiles: [
    [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
    [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
    [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }],
    [{ fish: 1 }, { fish: 1 }, { fish: 1 }, { fish: 1 }]
  ]
}

const twelveByOneTeamsOnePlayer = [
  {
    penguins: [],
    score: 0,
    color: GameColor.RED,
  },
];

const twelveByOneTeams = [
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
];

const twelveByOneTeamsThreePlayers = [
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
  {
    penguins: [],
    score: 0,
    color: GameColor.WHITE,
  },
];

const twelveByOneGameOnePlayer: State.GameState = {
  penguinTeams: twelveByOneTeamsOnePlayer,
  board: twelveByOneBoard,
  turn: 0,
  playersTurn: 0,
};

const twelveByOneGame: State.GameState = {
  penguinTeams: twelveByOneTeams,
  board: twelveByOneBoard,
  turn: 0,
  playersTurn: 0,
};

const twelveByOneGameThreePlayers: State.GameState = {
  penguinTeams: twelveByOneTeamsThreePlayers,
  board: twelveByOneBoard,
  turn: 0,
  playersTurn: 0,
};

const tieGame: State.GameState = {
  penguinTeams: twelveByOneTeamsThreePlayers,
  board: tieBoard,
  turn: 0,
  playersTurn: 0,
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


test('test for getNumberOfHoles', () => {
  expect(Referee.getNumberOfHoles(4, 4, 2)).toBe(1);
  expect(Referee.getNumberOfHoles(4, 4, 4)).toBe(1);
  expect(Referee.getNumberOfHoles(5, 5, 3)).toBe(3);
});

test('test for referee without state', () => {
  const goodGame = Referee.refereeGame(
    [goodPlayer, goodPlayer, goodPlayer],
    4,
    4
  );
  goodGame.then(data => expect(data.kickedPlayers).toHaveLength(0));
  goodGame.then(data => expect(data.winners.length + data.losers.length).toBe(3));

  const gameWithAKickedPlayer = Referee.refereeGame(
    [goodPlayer, badPlayerMoves, goodPlayer],
    4,
    4
  );

  gameWithAKickedPlayer.then(data => expect(data.kickedPlayers).toHaveLength(1));
  gameWithAKickedPlayer.then(data => expect(data.winners.length + data.losers.length).toBe(2));

  const gameWithAllKickedPlayers = Referee.refereeGame(
    [badPlayerPlacements, badPlayerMoves, badPlayerPlacements],
    5,
    5
  );

  gameWithAllKickedPlayers.then(data => expect(data.kickedPlayers).toHaveLength(3));
  gameWithAllKickedPlayers.then(data => expect(data.winners.length + data.losers.length).toBe(0));

  const gameWithTwoPlayers = Referee.refereeGame(
    [goodPlayer, badPlayerPlacements],
    5,
    5
  );

  gameWithTwoPlayers.then(data => expect(data.kickedPlayers).toHaveLength(1));
  gameWithTwoPlayers.then(data => expect(data.winners).toHaveLength(1));
});

test('test for referee with board', () => {
  const boardGame1GoodPlayer = Referee.refereeGameWithBoard(
    [goodPlayer],
    twelveByOneBoard
  );

  boardGame1GoodPlayer.then(data => expect(data.kickedPlayers).toHaveLength(0));
  boardGame1GoodPlayer.then(data => expect(data.winners).toHaveLength(1));

  const boardGame2BadPlayers = Referee.refereeGameWithBoard(
    [badPlayerMoves, badPlayerPlacements],
    twelveByOneBoard
  );

  boardGame2BadPlayers.then(data => expect(data.kickedPlayers).toEqual([
    badPlayerPlacements, badPlayerMoves
  ]));

  const boardGame4GoodPlayers = Referee.refereeGameWithBoard(
    [goodPlayer, goodPlayer, goodPlayer, goodPlayer],
    twelveByOneBoard
  );

  boardGame4GoodPlayers.then(data => expect(data.kickedPlayers).toHaveLength(0));

  const boardGame2Good2Bad = Referee.refereeGameWithBoard(
    [goodPlayer, badPlayerPlacements, goodPlayer, badPlayerMoves],
    twelveByOneBoard
  );

  boardGame2Good2Bad.then(data => expect(data.kickedPlayers).toHaveLength(2));

  expect(
    Referee.refereeGameWithBoard([goodPlayer, goodPlayer], fourByFourBoard)
  ).resolves.toStrictEqual({
    winners: [
      {
        player: goodPlayer,
        score: 4
      },
      {
        player: goodPlayer,
        score: 4
      }
    ],
    losers: [],
    kickedPlayers: []
  });
});

test('test for referee game with state', () => {
  expect(Referee.refereeGameWithState(
    [goodPlayer], 
    twelveByOneGameOnePlayer
  )).resolves.toStrictEqual({
    winners: [
      {
        player: goodPlayer,
        score: 32,
      },
    ],
    losers: [],
    kickedPlayers: [],
  });

  expect(Referee.refereeGameWithState(
    [badPlayerPlacements],
    twelveByOneGameOnePlayer
  )).resolves.toStrictEqual({
      winners: [],
      losers: [],
      kickedPlayers: [badPlayerPlacements],
  });

  expect(Referee.refereeGameWithState(
    [goodPlayer, goodPlayer], 
    twelveByOneGame
  )).resolves.toStrictEqual({
      winners: [
        {
          player: goodPlayer,
          score: 9,
        },
      ],
      losers: [
        {
          player: goodPlayer,
          score: 6,
        },
      ],
      kickedPlayers: [],
  });

  expect(Referee.refereeGameWithState(
    [badPlayerMoves, badPlayerPlacements],
    twelveByOneGame
  )).resolves.toStrictEqual({
      winners: [],
      losers: [],
      kickedPlayers: [badPlayerPlacements, badPlayerMoves],
  });


  
  expect(Referee.refereeGameWithState(
      [goodPlayer, badPlayerPlacements],
      twelveByOneGame
    )).resolves.toStrictEqual({
      winners: [
        {
          player: goodPlayer,
          score: 31,
        },
      ],
      losers: [],
      kickedPlayers: [badPlayerPlacements],
  });

  expect(Referee.refereeGameWithState(
    [goodPlayer, goodPlayer, goodPlayer],
    twelveByOneGameThreePlayers
  )).resolves.toStrictEqual({
      winners: [
        {
          player: goodPlayer,
          score: 9,
        },
      ],
      losers: [
        {
          player: goodPlayer,
          score: 0,
        },
        {
          player: goodPlayer,
          score: 2,
        },
      ],
      kickedPlayers: [],
  });

  expect(Referee.refereeGameWithState(
    [badPlayerPlacements, goodPlayer, badPlayerPlacements],
    twelveByOneGameThreePlayers
  )).resolves.toStrictEqual({
      winners: [
        {
          player: goodPlayer,
          score: 34,
        },
      ],
      losers: [],
      kickedPlayers: [badPlayerPlacements, badPlayerPlacements],
  });

  expect(Referee.refereeGameWithState(
    [badPlayerMoves, badPlayerPlacements, goodPlayer],
    twelveByOneGameThreePlayers
  )).resolves.toStrictEqual({
    winners: [
      {
        player: goodPlayer,
        score: 35,
      },
    ],
    losers: [],
    kickedPlayers: [badPlayerPlacements, badPlayerMoves],
  });

  expect(Referee.refereeGameWithState(
    [goodPlayer, badPlayerMoves, goodPlayer],
    twelveByOneGameThreePlayers
  )).resolves.toStrictEqual({
    winners: [
      {
        player: goodPlayer,
        score: 17,
      },
    ],
    losers: [
      {
        player: goodPlayer,
        score: 7,
      },
    ],
    kickedPlayers: [badPlayerMoves],
  });


  expect(Referee.refereeGameWithState(
    [goodPlayer, badPlayerPlacements, goodPlayer],
    tieGame
  )).resolves.toStrictEqual({
    winners: [
      {
        player: goodPlayer,
        score: 3,
      },
      {
        player: goodPlayer,
        score: 3,
      },
    ],
    losers: [],
    kickedPlayers: [badPlayerPlacements],
  });
});

test('tests for penguin placement phase', () => {
  const players = [badPlayerPlacements, goodPlayer];

  const fourByFourStateWithBoard = Referee.constructInitialGameState(
    [GameColor.RED, GameColor.WHITE],
    fourByFourBoard
  );

  Referee.penguinPlacementPhase([goodPlayer, goodPlayer], fourByFourStateWithBoard).then(data => {
    expect(data.currentState.penguinTeams).toHaveLength(2)
  });

  Referee.penguinPlacementPhase(players, twelveByOneGame).then(data => {
    expect(data.currentState.penguinTeams).toHaveLength(1)
  });  

  const oneBadPlayerGame = Referee.penguinPlacementPhase(
    [goodPlayer, badPlayerPlacements],
    twelveByOneGame
  );

  oneBadPlayerGame.then(data => expect(data.currentState.penguinTeams).toHaveLength(1));

  oneBadPlayerGame.then(data => expect(data.remainingPlayers).toHaveLength(1));

  oneBadPlayerGame.then(data => expect(data.kickedPlayers).toHaveLength(1));

  oneBadPlayerGame.then(data => expect(data.currentState.penguinTeams[0].penguins).toHaveLength(4));

  const twoBadPlayersGame = Referee.penguinPlacementPhase(
    [goodPlayer, badPlayerPlacements, badPlayerPlacements],
    twelveByOneGameThreePlayers
  );

  twoBadPlayersGame.then(data => expect(data.remainingPlayers).toHaveLength(1));

  twoBadPlayersGame.then(data => expect(data.currentState.penguinTeams).toHaveLength(1));

  twoBadPlayersGame.then(data => expect(data.kickedPlayers).toHaveLength(2));

  const goodPlayers = [goodPlayer, goodPlayer];

  const validPlayers = Referee.penguinPlacementPhase(
    goodPlayers,
    twelveByOneGame
  );

  validPlayers.then(data => {
    expect(data.kickedPlayers).toHaveLength(0)
  });

  expect(validPlayers).resolves.toStrictEqual({
    currentState: {
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
    },
    remainingPlayers: [goodPlayer, goodPlayer],
    kickedPlayers: [],
  }); 
});

test('tests for movePenguin', () => {

  const goodMovePromise: Promise<State.GameState> = Referee.penguinMove(
    twelveByOneStatePlaced,
    goodPlayer
  );

  const badMovePromise: Promise<State.GameState> = Referee.penguinMove(
    twelveByOneStatePlaced,
    badPlayerMoves
  );
  
  expect(() => badMovePromise).rejects.toThrow(
    Error("Error: Proposed move is not valid given the contraints of the given gamestate")
  );

  /*
  const timeOutPromise: Promise<State.GameState> = Referee.penguinMove(
    twelveByOneStatePlaced,
    timeoutPlayer
  );

  expect(() => timeOutPromise).rejects.toThrow(
    Error()
  );
  */
   
  expect(goodMovePromise).resolves.toStrictEqual(
    {
      board: {
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
      },
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
    }
  );
});

test('test for promiseTimeout', () => {

  const timeOutPromise: Promise<void> = new Promise((resolve, reject) => {
    setTimeout(reject, 20000, "hi");
  });

  const test = () => Referee.promiseTimeout<void>(5, timeOutPromise);

  return expect(test()).rejects.toMatch("Timed out in 5ms.");
});


//move penguin penguin phase
test('tests for movePeguinPhase', () => {

  const badMovePlayers = [badPlayerMoves, badPlayerMoves];
  const badMoveGoodMovePlayers = [badPlayerMoves, goodPlayer];

  const twoKickedEnding = Referee.movePenguinsPhase(
    badMovePlayers,
    twelveByOneStatePlaced
  );

  const oneGoodPlayerPostKicked = Referee.movePenguinsPhase(
    [badPlayerMoves, goodPlayer],
    {
      board: twelveByOneBoard,
      penguinTeams: [
        {
          penguins: [
            {position: {row: 0, column: 0}},
            {position: {row: 2, column: 0}},
            {position: {row: 4, column: 0}},
          ],
          score: 0,
          color: GameColor.RED
        },
        {
          penguins: [
            {position: {row: 1, column: 0}},
            {position: {row: 3, column: 0}},
            {position: {row: 5, column: 0}},
          ],
          score: 0,
          color: GameColor.BLACK
        },
      ],
      playersTurn: 0,
      turn: 0
    }
  );

  expect(twoKickedEnding).resolves.toStrictEqual({
    currentState: {
      board: twelveByOneBoard,
      turn: 0,
      playersTurn: 0,
      penguinTeams: [],
    },
    remainingPlayers: [],
    kickedPlayers: [badPlayerMoves, badPlayerMoves],
  }); 

  const oneKickedEnding = Referee.movePenguinsPhase(
    badMoveGoodMovePlayers,
    twelveByOneStatePlaced
  );
   
  expect(oneKickedEnding).resolves.toStrictEqual({
    currentState: {
      board: {
        tiles: [
          [{ fish: 1 }],
          [{}],
          [{ fish: 2 }],
          [{}],
          [{}],
          [{}],
          [{ fish: 1 }],
          [{}],
          [{ fish: 2 }],
          [{}],
          [{}],
          [{}],
        ],
      },  
      turn: 8,
      playersTurn: 0,
      penguinTeams: [
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 2, column: 0 } },
            { position: { row: 6, column: 0 } },
            { position: { row: 8, column: 0 } },
          ],
          score: 36,
          color: GameColor.BROWN,
        },
      ],
    },
    remainingPlayers: [goodPlayer],
    kickedPlayers: [badPlayerMoves],
  });
  
  const goodPlayersMoves = Referee.movePenguinsPhase(
    [goodPlayer, goodPlayer],
    twelveByOneStatePlaced
  );
  expect(goodPlayersMoves).resolves.toStrictEqual({
    currentState: {
      board: {
        tiles: [
          [{ fish: 1 }],
          [{ fish: 3 }],
          [{ fish: 2 }],
          [{ fish: 6 }],
          [{ fish: 5 }],
          [{ fish: 4 }],
          [{}],
          [{}],
          [{ fish: 2 }],
          [{}],
          [{}],
          [{ fish: 4 }],
        ],
      },
      turn: 4,
      playersTurn: 0,
      penguinTeams: [
        {
          penguins: [
            { position: { row: 0, column: 0 } },
            { position: { row: 2, column: 0 } },
            { position: { row: 4, column: 0 } },
            { position: { row: 8, column: 0 } },
          ],
          score: 6,
          color: GameColor.RED,
        },
        {
          penguins: [
            { position: { row: 1, column: 0 } },
            { position: { row: 3, column: 0 } },
            { position: { row: 5, column: 0 } },
            { position: { row: 11, column: 0 } },
          ],
          score: 9,
          color: GameColor.BROWN,
        },
      ],
    },
    remainingPlayers: [goodPlayer, goodPlayer],
    kickedPlayers: [],
  });
});  

test('test construct initial game state', () => {
  const construct1Board = Referee.constructBoard(4, 5, 2);

  const initialState1 = Referee.constructInitialGameState(
    [GameColor.RED, GameColor.BLACK, GameColor.BROWN],
    construct1Board
  );
  expect(initialState1.board.tiles).toHaveLength(4);
  expect(initialState1.board.tiles[0]).toHaveLength(5);
  expect(initialState1.penguinTeams).toStrictEqual([
    {
      color: GameColor.RED,
      score: 0,
      penguins: [],
    },
    {
      color: GameColor.BLACK,
      score: 0,
      penguins: [],
    },
    {
      color: GameColor.BROWN,
      score: 0,
      penguins: [],
    },
  ]);

  expect(initialState1.playersTurn).toBe(0);
  expect(initialState1.turn).toBe(0);

  const initialState2 = Referee.constructInitialGameState(
    [GameColor.BLACK, GameColor.BROWN],
    twelveByOneBoard
  );
  expect(initialState2.board.tiles).toHaveLength(12);
  expect(initialState2.board.tiles[0]).toHaveLength(1);
  expect(initialState2.penguinTeams).toStrictEqual([
    {
      color: GameColor.BLACK,
      score: 0,
      penguins: [],
    },
    {
      color: GameColor.BROWN,
      score: 0,
      penguins: [],
    },
  ]);

  expect(initialState2.playersTurn).toBe(0);
  expect(initialState2.turn).toBe(0);
});

test('test construct board', () => {
  const construct1Board = Referee.constructBoard(10, 10, 2);
  let numberOfHoles = 0;
  construct1Board.tiles.forEach((row) => {
    row.forEach((tile) => {
      expect(row).toHaveLength(10);

      if (!Space.isActiveTile(tile)) {
        numberOfHoles++;
      }
    });
  });
  expect(numberOfHoles).toBeLessThanOrEqual(18);
  expect(construct1Board.tiles).toHaveLength(10);
});

