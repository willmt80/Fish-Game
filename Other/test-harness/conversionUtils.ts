import { Board } from '../../Common/src/Model/Board';
import { GameColor } from '../../Common/src/Model/GameColor';
import { Moves } from '../../Common/src/Model/Moves';
import { Penguin } from '../../Common/src/Model/Penguin';
import { Position } from '../../Common/src/Model/Position';
import { Space } from '../../Common/src/Model/Space';
import { State } from '../../Common/src/Model/State';

export type stateMatthias = {
  players: playerMatthias[];
  board: number[][];
};

export type playerMatthias = {
  color: string;
  score: number;
  places: [number, number][];
};

export type depthState = [number, stateMatthias];

export type gameDescription = {
  row: number,
  column: number,
  players: [string, number][],
  fish: number
}

/**
 * Converts the json board representation to the Board in our model
 * @param matthiasBoard a 2d array of numbers
 */
export function convertMatthiasBoardToOurBoard(
  matthiasBoard: number[][]
): Board.Board {
  let spaces: Space.Space[][] = [];
  const rowMax = findRowWithMaxColumns(matthiasBoard);
  for (let row = 0; row < matthiasBoard.length; row++) {
    spaces.push(convertMatthiasRowToOurRow(matthiasBoard[row], rowMax));
  }
  return { tiles: spaces };
}

/**
 * Finds the row with the max number of columns, used to pad
 * short rows with appropriate number of 0 tiles
 * @param matthiasBoard the input board
 */
function findRowWithMaxColumns(matthiasBoard: number[][]) {
  return Math.max(...matthiasBoard.map((row) => row.length));
}

/**
 * Converts a row of numbers to a row of Space
 * @param matthiasRow an array of numbers
 * @param maxRowLength the length of the row with the most tiles (for padding)
 */
function convertMatthiasRowToOurRow(
  matthiasRow: number[],
  maxRowLength: number
): Space.Space[] {
  const newRow = [];
  let fish: number;
  for (let col = 0; col < matthiasRow.length; col++) {
    fish = matthiasRow[col];
    if (fish > 0) {
      newRow.push({ fish: fish });
    } else {
      newRow.push({});
    }
  }
  while (newRow.length < maxRowLength) {
    newRow.push({});
  }

  return newRow;
}

/**
 * Convert a given position (required by test harness) into our representation of a position
 * @param matthiasPosition a tuple representing x and y
 */
export function convertMatthiasPositionToPositionType(
  matthiasPosition: [number, number]
): Position.position {
  return { row: matthiasPosition[0], column: matthiasPosition[1] };
}

/**
 * Converts the JSON state representation to a State in our model
 *
 * @param matthiasState a list of players and a board
 */
export function convertStateMatthiasToOurState(
  matthiasState: stateMatthias
): State.GameState {
  const board: Board.Board = convertMatthiasBoardToOurBoard(
    matthiasState.board
  );
  const penguinTeams: Penguin.PenguinTeam[] = convertPlayersMatthiasToPenguinTeams(
    matthiasState.players
  );

  return {
    board,
    penguinTeams,
    turn: 0,
    playersTurn: 0,
  };
}

/**
 * Converts the JSON list of players to a record of PenguinTeam in our model
 *
 * @param players a list of players
 */
function convertPlayersMatthiasToPenguinTeams(
  players: playerMatthias[]
): Penguin.PenguinTeam[] {
  const penguinTeams = players.reduce(
    (teams: Penguin.PenguinTeam[], player: playerMatthias) => {
      const gameColor: GameColor = convertMatthiasColorStringToGameColor(
        player.color
      );
      teams.push(convertPlayerMatthiasToPenguinTeam(player, gameColor));
      return teams;
    },
    []
  );

  return penguinTeams;
}

/**
 * Converts the JSON player to a PenguinTeam in our model
 *
 * @param player a player
 * @param gameColor a GameColor
 */
function convertPlayerMatthiasToPenguinTeam(
  player: playerMatthias,
  gameColor: GameColor
): Penguin.PenguinTeam {
  const penguins = player.places.map((pos) => {
    return { position: convertMatthiasPositionToPositionType(pos) };
  });

  return {
    penguins,
    score: player.score,
    color: gameColor,
  };
}

/**
 * Convert the string color, into our representation of color
 *
 * @param color the string representation of a color
 * @return GameColor of the given color
 * @throws if the given color does not have a matching gamecolor
 */
function convertMatthiasColorStringToGameColor(color: String) {
  switch (color) {
    case 'red':
      return GameColor.RED;
    case 'brown':
      return GameColor.BROWN;
    case 'white':
      return GameColor.WHITE;
    case 'black':
      return GameColor.BLACK;
    default:
      throw new Error(`Given color ${color} is not a game color`);
  }
}

/**
 * Convert the string color, into our representation of color
 *
 * @param color the string representation of a color
 * @return GameColor of the given color
 * @throws if the given color does not have a matching gamecolor
 */
function convertGameColorStringToMatthiasColor(color: GameColor) {
  switch (color) {
    case GameColor.RED:
      return 'red';
    case GameColor.BROWN:
      return 'brown';
    case GameColor.WHITE:
      return 'white';
    case GameColor.BLACK:
      return 'black';
    default:
      throw new Error(`Given color ${color} is not a game color`);
  }
}

/**
 * Converts our GameState to a JSON state
 *
 * @param state our Gamestate
 */
export function convertOurStateToStateMatthias(
  state: State.GameState
): stateMatthias {
  const board = convertOurBoardToMatthiasBoard(state.board);
  const players = convertPenguinTeamsToMatthiasPlayers(state.penguinTeams);
  return {
    board,
    players,
  };
}

/**
 * Convert our board representation back into a matthias board representation
 * @param board our Board
 */
function convertOurBoardToMatthiasBoard(board: Board.Board): number[][] {
  return board.tiles.map((row) => {
    return row.map((space) => {
      return Space.getFish(space);
    });
  });
}

/**
 * Converts our penguinTeams to a JSON list of players
 *
 * @param teams the penguinTeams indexed by the gameColor
 */
function convertPenguinTeamsToMatthiasPlayers(
  teams: Penguin.PenguinTeam[]
): playerMatthias[] {
  return teams.map((team) => {
    const matthiasColor = convertGameColorStringToMatthiasColor(team.color);

    const penguinsToPositions: [
      number,
      number
    ][] = team.penguins.map((penguin) => [
      penguin.position.row,
      penguin.position.column,
    ]);
    return {
      color: matthiasColor,
      places: penguinsToPositions,
      score: team.score,
    };
  });
}

/**
 *  Try each clockwise move until either the move succeeds or we run out of positions to try
 *
 * @param player the player that own the penguin
 * @param penguin the penguin to be moved
 * @param state the state on which the penguin is moved
 * @return the first clockwise move of false if no valid moves are available
 */
export function moveWithFirstClockwiseMove(
  penguin: Penguin.Penguin,
  state: State.GameState
): State.GameState | false {
  if (!!!penguin.position) {
    return false;
  }
  const orderedMoves = getAllOneTileMoves(penguin.position, state.board);
  if (orderedMoves === []) {
    return false
  } else {
    return State.movePenguin(
      state.playersTurn,
      { from: penguin.position, to: orderedMoves[0] },
      state
    );
    }  
}

/**
 * gets a list of all of the positions of tiles within one space of the given position
 *
 * @param position the starting position
 * @param board the board
 */
function getAllOneTileMoves(
  position: Position.position,
  board: Board.Board
): Position.position[] {
  const holeyMoveArray: Array<Position.position | null> = [
    Moves.getUp(position, board),
    Moves.getDiagonalRightUp(position, board),
    Moves.getDiagonalRightDown(position, board),
    Moves.getDown(position, board),
    Moves.getDiagonalLeftDown(position, board),
    Moves.getDiagonalLeftUp(position, board),
  ];
  const positionsThatAreTiles: Position.position[] = [];
  holeyMoveArray.forEach((pos) => {
    if (pos !== null) {
      positionsThatAreTiles.push(pos as Position.position);
    }
  });
  return positionsThatAreTiles;
}
