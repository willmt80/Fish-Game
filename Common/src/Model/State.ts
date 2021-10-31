import { Penguin } from './Penguin';
import { Position } from './Position';
import { Board } from './Board';
import { GameColor } from './GameColor';
import { Moves } from './Moves';
import { orMap, andMap } from '../Utils/ArrayUtils';

// A collection of data representations and function related to the game state
export namespace State {
  /**
   * GameState is a representation of the current game at any given moment
   */
  export type GameState = {
    // PenguinTeams represents the players linked to the penguins
    // Location of Penguins on the board determined by the Penguin's position.
    // There are between 2 and 4 players, Turn order is determined by index.
    penguinTeams: Penguin.PenguinTeam[];
    // Represents the current state of the board
    board: Board.Board;
    // which turn number are we on. this is a natural number
    turn: number;
    // the index of the player whose turn it currently is
    playersTurn: number;
  };

  /**
   * Create a game state given the players colors and the dimensions of the board
   *
   * @param colors an array colors that are used to create Penguinteams
   * @param row the number of rows for the board
   * @param col the number of columns for the board
   * @return A new GameState
   */
  export function createGameState(
    colors: GameColor[],
    row: number,
    col: number
  ): GameState {
    const board: Board.Board = Board.createBoard(row, col, [], 5, 1, true);
    const penguinTeams: Penguin.PenguinTeam[] = createPenguinTeams(colors);

    return {
      penguinTeams: penguinTeams,
      board: board,
      turn: 0,
      playersTurn: 0,
    };
  }

  /**
   * Determine if the given GameStates are equal
   *
   * @param state1 the first gamestate
   * @param state2 the second gamestate
   * @return true if gamestates are equal, otherwise false
   */
  export function areGameStatesEqual(
    state1: GameState,
    state2: GameState
  ): boolean {
    return (
      Board.areBoardsEqual(state1.board, state2.board) &&
      Penguin.arePenguinTeamArraysEqual(
        state1.penguinTeams,
        state2.penguinTeams
      ) &&
      state1.playersTurn === state2.playersTurn &&
      state1.turn === state2.turn
    );
  }

  /**
   * Add holes to game board
   *
   * @param gameState the GameState
   * @param holes the holes to be added to the board
   * @throws if the holes are in invalid positions
   */
  export function addHolesToGameBoard(
    gameState: GameState,
    holes: Position.position[]
  ): GameState {
    Board.validateHolePositions(
      gameState.board.tiles.length, // rows
      gameState.board.tiles[0].length, // columns
      holes
    );
    const newBoard = Board.addHolesToBoard(gameState.board, holes);
    return {
      penguinTeams: gameState.penguinTeams,
      board: newBoard,
      playersTurn: gameState.playersTurn,
      turn: gameState.turn,
    };
  }

  /**
   * Create penguins teams for each of the colors
   *
   * Each team will have 6 - n penguins where n is the total number of players
   * @param colors the colors which represent the players in this game ordered
   * by their turn in the game
   * @return A list of PenguinTeam
   */
  export function createPenguinTeams(
    colors: GameColor[]
  ): Penguin.PenguinTeam[] {
    const penguinTeams: Penguin.PenguinTeam[] = [];
    colors.forEach((color) => {
      penguinTeams.push({ color: color, penguins: [] as Array<Penguin.Penguin>, score: 0 });
    })
    return penguinTeams;
  }

  /**
   * Gets the PenguinTeam for the current turn
   * @param state The state from which to get the PenguinTeam
   */
  export function getCurrentPenguinTeam(state: GameState): Penguin.PenguinTeam {
    return state.penguinTeams[state.playersTurn];
  }

  /**
   * This increments the turn without making a move.
   *
   * This can be used to skip a players turn and move onto the next player
   *
   * @param state The state to increment
   * @return a game state with the next players turn se
   */
  export function incrementTurn(state: GameState): GameState {
    return {
      board: state.board,
      turn: state.turn + 1,
      penguinTeams: state.penguinTeams,
      playersTurn: (state.playersTurn + 1) % state.penguinTeams.length,
    };
  }

  /**
   * To place a penguin on the board
   * Will place a penguin at the given position
   *
   * @param player the index of the penguinTeam that owns the Penguin to be placed
   * @param position
   * @param gameState
   * @throws if there are no penguins to place,
   *         if given an invalid board coordinate,
   *         if there is already penguin in this position
   *         if the given position is a hole
   */
  export function placePenguin(
    player: number,
    position: Position.position,
    gameState: GameState
  ): GameState {
    validPenguinPlacement(position, gameState);
    const playersTeam = gameState.penguinTeams[player];

    const placedPenguinArray: Penguin.Penguin[] = Penguin.placePenguinTeamMember(
      playersTeam.penguins,
      position
    );
    const penguinTeams = [...gameState.penguinTeams];
    penguinTeams[player] = {
      color: playersTeam.color,
      score: playersTeam.score,
      penguins: placedPenguinArray,
    };

    return {
      turn: gameState.turn,
      penguinTeams: penguinTeams,
      playersTurn: (gameState.playersTurn + 1) % gameState.penguinTeams.length,
      board: gameState.board,
    };
  }

  /**
   * Determine if a penguin can be placed at the given position
   * @param position the position to check
   * @param gameState the gameState in which to check the position
   * @throws if given an invalid board coordinate,
   *         if there is already penguin in this position
   *         if the given position is a hole
   */
  function validPenguinPlacement(
    position: Position.position,
    gameState: GameState
  ): void {
    Board.validateTile(gameState.board, position);

    if (State.getPenguinAtPosition(gameState, position) !== null) {
      throw new Error(
        'Cannot place penguin where another penguin is already placed'
      );
    }
  }

  /**
   * Determine if a penguin can be placed at the given position
   * @param position the position to check
   * @param gameState the gameState in which to check the position
   * @throws if given an invalid board coordinate,
   *         if there is already penguin in this position
   *         if the given position is a hole
   */
  export function isValidPenguinPlacement(
    position: Position.position,
    gameState: GameState
  ): boolean {
    try {
      Board.validateTile(gameState.board, position); 
      return State.getPenguinAtPosition(gameState, position) === null
    } catch (err) {
      return false
    };
  }

  /**
   * Move the penguin from the given fromPosition to the given toPosition
   * @param player The index of the PenguinTeam to which the penguin belongs
   * @param move the move of the penguin to one position to a new position
   * @param gameState the gameState
   * @throws there is no penguin at the from position
   *         there is already a penguin at this position
   *         the position is not a tile on the board
   *         we cannot move to the given position from the given position
   * @returns The gameState with the penguin in a new position
   */
  export function movePenguin(
    player: number,
    move: Moves.Move,
    gameState: GameState
  ): GameState {
    const foundPenguin = Penguin.getPenguinFromTeam(gameState.penguinTeams[player], move.from);
    if (!foundPenguin) {
      throw new Error('No penguin owned by this player at the given position');
    }
    validatePenguinMoveToPosition(move, gameState);

    const fishAtTile = Board.getFishOnTile(gameState.board, move.from);

    const penguinAtToPosition = Penguin.setPenguinPosition(
      foundPenguin,
      move.to
    );
    const newPenguinTeam = Penguin.replacePenguin(
      move.from,
      penguinAtToPosition,
      gameState.penguinTeams[player],
      fishAtTile
    );
    const newPenguinTeams = [...gameState.penguinTeams];
    newPenguinTeams[player] = newPenguinTeam;
    return {
      turn: gameState.turn + 1,
      playersTurn: (gameState.playersTurn + 1) % gameState.penguinTeams.length,
      penguinTeams: newPenguinTeams,
      board: Board.removeTile(gameState.board, move.from),
    };
  }

  /**
   * Gets the penguin at the given position, returns null if no penguin is found
   * @param gameState the gameState
   * @param position the position of the penguin
   * @returns the penguin
   */
  export function getPenguinAtPosition(
    gameState: GameState,
    position: Position.position
  ): Penguin.Penguin | null {
    const teams = Object.values(gameState.penguinTeams);
    let foundPenguin: Penguin.Penguin | null;
    // for each team, check if you can find a penguin with this position
    for(let penguinTeam of teams) {
      foundPenguin = Penguin.getPenguinFromTeam(penguinTeam, position);
      if (foundPenguin) {
        return foundPenguin;
      }
    };
    return null;
  }

    /**
   * Determine if any member of the team can make a move
   * @param team the penguin teams
   * @param gameState the state of the game
   */
  export function canAnyPenguinOfPenguinTeamBeMoved(
    team: Penguin.PenguinTeam,
    gameState: State.GameState
  ) {
    return orMap<Penguin.Penguin>(Array.from(team.penguins), (p) =>
      canPenguinBeMoved(p, gameState)
    );
  }

  /**
   * Can Penguin be Moved to any of the positions it is in line with
   * @param penguin the penguin
   * @param gameState the game state
   */
  export function canPenguinBeMoved(
    penguin: Penguin.Penguin,
    gameState: State.GameState
  ): boolean {
    const allMoves = Moves.getAllDestinationsGroupedByDirection(
      penguin.position,
      gameState
    ).map((positions: Position.position[]) => {
      if (positions.length > 0) {
        return [positions[0]];
      }
      return positions;
    });

    const checkMoveByOnes = ([] as Position.position[]).concat(...allMoves);

    return isAnyPositionPenguinFree(checkMoveByOnes, gameState);
  }

  /**
   * Determine if any move in the list of moves contains another penguin
   * @param positions the positions a penguin could move to
   * @param state the Gamestate to use for checking penguin moves
   */
  export function isAnyPositionPenguinFree(
    positions: Position.position[],
    state: GameState
  ) {
    return orMap<Position.position>(positions, (posn) =>
      !getPenguinAtPosition(state, posn)
    );
  }

  /**
   * Determine if Every move in the list of m0ves contains another penguin
   * @param positions the positions a penguin could move to
   * @param state Gamestate to use for checking penguin moves
   */
  export function isEveryLocationPenguinFree(
    positions: Position.position[],
    state: GameState
  ) {
    return andMap<Position.position>(positions, (position) =>
      !getPenguinAtPosition(state, position)
    );
  }

  /**
   * Validates the penguin move
   * @param move the proposed move
   * @param gameState the gamestate
   * @throws there is already a penguin at this position
   *         the position is not a tile on the board
   *         we cannot move to the given position from the given position
   */
  function validatePenguinMoveToPosition(
    move: Moves.Move,
    gameState: GameState
  ): void {
    // is there already a penguin at this position
    // is the to position an active tile on the board
    validPenguinPlacement(move.to, gameState);

    // is this a valid move from the given position
    const allMoves: Position.position[] = Moves.getAllDestinations(
      move.from,
      gameState
    );

    const isMoveAvailable: boolean = allMoves.some((position: Position.position) => {
      return Position.arePositionsEqual(move.to, position)
    });  

    // move the penguin to the tile
    if (!isMoveAvailable) {
      throw new Error('This move is illegal');
    }
  }

  /**
   * Validates the penguin move
   * @param move the proposed move
   * @param gameState the gamestate
   * @return true if the the penguin can make the move
   */
  export function isValidPenguinMoveToPosition(
    move: Moves.Move,
    gameState: GameState
  ): boolean {
    try {
      validatePenguinMoveToPosition(move, gameState);
      return true;
    } catch {
      return false;
    }
  }

  /*
  function isPenguinInTheWayOfThisMove(
    move: Moves.Move,
    state: State.GameState
  ) {
    const allMoves = [
      Moves.getAllUp(move.from, state.board),
      Moves.getAllDown(move.from, state.board),
      Moves.getAllDiagonalLeftDown(move.from, state.board),
      Moves.getAllDiagonalLeftUp(move.from, state.board),
      Moves.getAllDiagonalRightDown(move.from, state.board),
      Moves.getAllDiagonalRightUp(move.from, state.board),
    ];
    return orMap(allMoves, (positions: Position.position[]) =>
      isMoveSequenceBlockedByPenguin(move.to, positions, state)
    );
  }
  */

  /**
   * Is a move to this position blocked by a penguin
   *
   * @param destination the desired move
   * @param moveSequence a move sequence is a direction of moves. ie. all positions downwards of a penguin
   * @param state the gameState
   */
  function isMoveSequenceBlockedByPenguin(
    destination: Position.position,
    moveSequence: Position.position[],
    state: GameState
  ): boolean {
    const isMoveInList = moveSequence.some((position) => Position.arePositionsEqual(position, destination));

    if (isMoveInList) {
      const findIndex = moveSequence.findIndex(
        (position: Position.position) => {
          return (
            position.row === destination.row &&
            position.column === destination.column
          );
        }
      );

      const movesBeforeSequence = moveSequence.slice(0, findIndex);

      return !isEveryLocationPenguinFree(
        movesBeforeSequence,
        state
      );
    }
    return false;
  }

  /**
   * Can any penguin in the current state be moved
   * @param gameState the current state of the game
   */
  export function canAnyPenguinBeMoved(gameState: GameState): boolean {
    return orMap<Penguin.PenguinTeam>(
      Object.values(gameState.penguinTeams),
      (team) => canAnyPenguinOfPenguinTeamBeMoved(team, gameState)
    );
  }

  /**
   * Removes a player from the game and corrects the current playersTurn as needed
   * @param gameState the state of the game
   * @param player index of the PenguinTeam to be removed
   * @return the state of the game after the player has been removed
   */
  export function removePlayer(
    gameState: GameState,
    player: number
  ): GameState {
    let newPlayersTurn = gameState.playersTurn;
    if (
      newPlayersTurn === gameState.penguinTeams.length - 1 &&
      player === newPlayersTurn
    ) {
      newPlayersTurn = 0;
    } else if (newPlayersTurn > player) {
      newPlayersTurn = newPlayersTurn - 1;
    }

    const newPenguinTeams = removePenguinTeamOfPlayer(gameState, player);
    return {
      penguinTeams: newPenguinTeams,
      board: gameState.board,
      turn: gameState.turn,
      playersTurn: newPlayersTurn,
    };
  }

  /**
   * Remove the penguin team from the given index in PenguinTeams
   *
   * @param gameState the state of the game
   * @param index the index of the PenguinTeam to be removed
   */
  function removePenguinTeamOfPlayer(
    gameState: GameState,
    index: number
  ): Penguin.PenguinTeam[] {
    const newPenguinTeams: Penguin.PenguinTeam[] = [];

    for (let i = 0; i < gameState.penguinTeams.length; i++) {
      if (i !== index) {
        newPenguinTeams.push(gameState.penguinTeams[i]);
      }
    }
    return newPenguinTeams;
  }


  /**
   * Creates a deep copy of the given gameState to avoid mutation
   */
  export function copyState(state: GameState): GameState {
    const copiedBoard = Board.copyBoard(state.board);
    const copiedPenguinTeams = Penguin.copyPenguinTeams(state.penguinTeams);
    return {
      board: copiedBoard,
      penguinTeams: copiedPenguinTeams,
      playersTurn: state.playersTurn,
      turn: state.turn,
    };
  }

  /**
   * Add final penguin resting place to scores
   * @param state the final state of the game
   */
  export function addFinalPenguinPositionsToScore(state: GameState) {
    const finalTeamStandings = state.penguinTeams.map((penguinTeam) => {
      let finalScore = penguinTeam.score;
      penguinTeam.penguins.forEach((penguin) => {
        finalScore += Board.getFishOnTile(state.board, penguin.position);
      });
      return {
        ...penguinTeam,
        score: finalScore,
      };
    });

    return {
      ...state,
      penguinTeams: finalTeamStandings,
    };
  }
}
