import { Board } from './Board';
import { State } from './State';
import { isEven, isNaturalNumber } from '../Utils/NumberUtils';
import { Space } from './Space';
import { Position } from './Position';

/**
 * A Namespace to group functions related to moves
 */
export namespace Moves {
  /**
   * A Move is a pair of positions representing a move from one position to another
   */
  export type Move = {
    // the starting position
    from: Position.position;
    // the destination
    to: Position.position;
  };

  /**
   * Checks if two moves are equal
   * @param move1 
   * @param move2 
   * @returns { Boolean } whether the two moves are equal
   */
  export function areMovesEqual(
    move1: Move,
    move2: Move
  ): Boolean {
    return Position.arePositionsEqual(move1.from, move2.from)
        && Position.arePositionsEqual(move1.to, move2.to);
  }

  /**
   * Get the positions of every tile that can be moved to from the current position
   *
   * @param position the position to be moved from
   * @param state the state
   * @return a list of positions
   */
  export function getAllDestinations(
    position: Position.position,
    state: State.GameState
  ): Array<Position.position> {
    let allDestinations: Position.position[] = [];
    return allDestinations.concat(...getAllDestinationsGroupedByDirection(position, state))
  }

  /**
   * Get the positions of every tile that can be moved to from the current position
   * Grouped by direction of movement
   *
   * @param position the position to be moved from
   * @param state the state
   * @return a list of positions
   */
  export function getAllDestinationsGroupedByDirection(
    position: Position.position,
    state: State.GameState
  ): Position.position[][] {
    Board.validateTile(state.board, position);
    return [
      getAllDirectionHelper(position, state, getUp),
      getAllDirectionHelper(position, state, getDiagonalLeftUp),
      getAllDirectionHelper(position, state, getDiagonalRightUp),
      getAllDirectionHelper(position, state, getDiagonalLeftDown),
      getAllDirectionHelper(position, state, getDiagonalRightDown),
      getAllDirectionHelper(position, state, getDown)
    ];
  }

  /**
   * Gets all of the positions of tiles that are not blocked by other penguins
   * using the given direction function
   * 
   * @param position the position to be moved from
   * @param state the state
   * @param getDirection Get tile position in a certain direction or {} if no tile is at that position
   */
  export function getAllDirectionHelper(
    position: Position.position,
    state: State.GameState,
    getDirection: (
      position: Position.position,
      board: Board.Board
    ) => Position.position | null
  ): Array<Position.position> {
    const board = state.board;
    let positionArray: Array<Position.position> = [];
    let nextPosition: Position.position | null = getDirection(position, board);
    while (nextPosition != null && State.getPenguinAtPosition(state, nextPosition) === null) {
      positionArray.push(nextPosition as Position.position);
      nextPosition = getDirection(nextPosition as Position.position, board);
    }
    return positionArray;
  }

  /**
   *  Get tile position diagonally down to the right.
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getDiagonalRightDown(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getDiagonal(position, board, false, true);
  }

  /**
   *  Get tile position diagonally down to the left.
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getDiagonalLeftDown(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getDiagonal(position, board, true, true);
  }

  /**
   *  Get tile position diagonally up to the right.
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getDiagonalRightUp(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getDiagonal(position, board, false, false);
  }

  /**
   *  Get tile position diagonally up to the left.
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getDiagonalLeftUp(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getDiagonal(position, board, true, false);
  }

  /**
   *  Get tile position vertically above the given tile
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getUp(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getTileAtCoordinate(position.row - 2, position.column, board);
  }

  /**
   *  Get tile position vertically below the given tile
   *
   *  If the tile is valid then return it's position, else return empty object
   *
   * @param position the position to be moved from
   * @param board the board
   * @return either a position or an empty object
   */
  export function getDown(
    position: Position.position,
    board: Board.Board
  ): Position.position | null {
    return getTileAtCoordinate(position.row + 2, position.column, board);
  }

  /**
   * Abstracted function to get the tile in a diagonal direction from the current position
   * @param position the position to be moved from
   * @param board the board
   * @param left if true, the tile to the left, else the tile to the right
   * @param down if true, the tile downwards, else the tile upwards
   */
  function getDiagonal(
    position: Position.position,
    board: Board.Board,
    left: boolean,
    down: boolean
  ): Position.position | null {
    const newRow: number = down ? position.row + 1 : position.row - 1;
    let newCol: number = position.column;
    const evenRow = isEven(position.row);
    if (evenRow && left) {
      newCol = newCol - 1;
    } else if (!evenRow && !left) {
      newCol = newCol + 1;
    }
    return getTileAtCoordinate(newRow, newCol, board);
  }

  /**
   * Return tile or lack there of at the given position
   * @param row the row of the new tile
   * @param column the column of the tile
   * @param board the board where the tile resides
   */
  function getTileAtCoordinate(row: number, column: number, board: Board.Board): Position.position | null {
    const isMoveValid = Position.isValidPositionInRange(
      board.tiles.length,
      board.tiles[0].length,
      { row: row, column: column }
    );

    if (isMoveValid) {
      const tileAtMove = !Space.isHole(board.tiles[row][column]);
      return tileAtMove ? { row: row, column: column } : null;
    }
    return null;
  }

  /**
   * If several different actions can realize the same gain, the strategy moves the penguin
   * that has the lowest row number for the place from which the penguin is moved and,
   * within this row, the lowest column number. In case this still leaves the algorithm
   * with more than one choice, the process is repeated for the target field to which the
   * penguins will move. This process is gauranteed to land on one move because if two moves
   * are exactly equal then they are identical moves
   *
   * @param move1
   * @param move2
   * @param this is guaranteed to return a move (in the context of minimax) because
   * if both tie breaker to and from are false then the positions are exactly equal. Which is not possible
   * in a game tree
   */
  export function moveTieBreaker(move1: Moves.Move, move2: Moves.Move): Move | false {
    if (move1 === undefined) {
      return move2;
    }
    if (move2 === undefined) {
      return move1;
    }
    const tieBreakerFrom = positionToMoveTieBreaker(
      move1,
      move2,
      move1.from,
      move2.from
    );
    const tieBreakerTo = positionToMoveTieBreaker(
      move1,
      move2,
      move1.to,
      move2.to
    );
    if (tieBreakerFrom) {
      return tieBreakerFrom;
    }
    return tieBreakerTo;
  }

  /**
   * Compares 2 positions and returns the move with the same number (1 or 2)
   * positions with the lowest row number and, within this row, the lowest column number.
   *
   * @param move1 the move to return if pos1 is smaller
   * @param move2 the move to return if pos 2 is smaller than pos 1
   * @param pos1 the first position
   * @param pos2 the second position
   */
  function positionToMoveTieBreaker(
    move1: Moves.Move,
    move2: Moves.Move,
    pos1: Position.position,
    pos2: Position.position
  ): Moves.Move | false{
    if (pos1.row < pos2.row) {
      return move1;
    }
    if (pos1.row > pos2.row) {
      return move2;
    }
    if (pos1.column < pos2.column) {
      return move1;
    }
    if (pos1.column > pos2.column) {
      return move2;
    }
    return false;
  }
}
