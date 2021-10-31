import { State } from '../../Common/src/Model/State';
import { Position } from '../../Common/src/Model/Position';
import { Board } from '../../Common/src/Model/Board';
import { Moves } from '../../Common/src/Model/Moves';
import { GameTree } from '../../Common/src/Model/GameTree';
import { isEven } from '../../Common/src/Utils/NumberUtils';

/**
 * Represents a strategy for an ai player. The AI places penguins in a zig zag pattern (described below),
 * and uses a minimax algorithm to pick its moves.
 */
export namespace Strategy {

  // path represents the list of moves that have been taken from a given state in the game
  // scoreSoFar is the best final score the player will have if they make a certain move according to minimax
  type ChildScore = {
    path: (Moves.Move | false)[],
    scoreSoFar: number,
  }

  /**
   * Searches for the first available penguin position by zig zagging through rows and columns in the pattern
   * described below. 1 represents the first tile searched, 2 is the second, so on and so forth
   *
   *  _____         _____
     /     \       /     \
    /  1    \_____/   2   \_____
    \       /     \       /     \
     \_____/   3   \_____/  4    \
     /     \       /     \       /
    / 5     \_____/   6   \_____/
    \       /     \       /     \
     \_____/   7   \_____/  8    \
     /     \       /     \       /
    /  9    \_____/  10   \_____/
    \       /     \       /
     \_____/       \_____/
   *
   * @param state
   */
  export function penguinPlacements(state: State.GameState): Position.position {
    const rows: number = Board.getRows(state.board);
    const columns: number = Board.getColumns(state.board);

    let position: Position.position = { row: 0, column: 0 };
    while (!State.isValidPenguinPlacement(position, state)) {
      if (position.row >= rows || position.column >= columns) {
        throw new Error('No valid penguin placement available');
      }
      position = getNewPosition(position, columns);
    }

    return position;
  }

  /**
   * Gets the next position to check in the zig zag pattern described in ascii art above
   *
   * @param position the previous position to be incremented
   * @param maxCols the number of columns in the board
   */
  export function getNewPosition(
    position: Position.position,
    maxCols: number
  ): Position.position {
    if (position.column < maxCols - 1) {
      return { row: position.row, column: position.column + 1};
    } else {
      return { row: position.row + 1, column: 0 };
    }
  }

  /**
   * Gets the best move that a player can make on their turn according to minimax strategy
   * 
   * INVARIANT: Must be called on a state in which the current player is able to make a move
   * @param state the state on which the move will be made
   * @param levels the number of turns that the move will take
   * @throws If no move is available in the given state
   */
  export function minimaxMove(
    state: State.GameState,
    levels: number
  ): Moves.Move {
    const playerIndex = state.playersTurn;
    const move = minimaxPath(state, levels, playerIndex).path[0];
    if (!move) {
      throw new Error('No move is available this turn');
    } else {
      return move;
    }
  }

  /**
   * Gets the move for the current player that will lead to the highest score
   * a player can make after the @param levels turns have been played—assuming
   * that all opponents pick one of the moves that minimizes the current player’s gain
   *
   * INVARIANT: This returns a list of all moves best move for the player whose turn it currently is
   *
   * @param state the current state of the game
   * @param levels the number of player actions that have yet to be taken
   * @param playerIndex the index of the player for whom we are maximizing the score
   * @return the move with the best gain after n turns
   */
  export function minimaxPath(
    state: State.GameState,
    levels: number,
    playerIndex: number
  ): ChildScore {

    const children = GameTree.generateChildren(state);

    const houseTeam = state.penguinTeams[playerIndex];
    if (levels === 0 || children.length === 0) {
      return { scoreSoFar: houseTeam.score, path: [] }
    }

    const isHousePlayer: boolean = state.playersTurn === playerIndex;
    const initScore: number = isHousePlayer ? 0 : Number.POSITIVE_INFINITY;
    let currentBest: ChildScore = { scoreSoFar: initScore, path: [] }

    children.forEach((actionTuple) => {
      const nextAction: Moves.Move | false = actionTuple[0];
      const node: GameTree.Game = actionTuple[1];
      let childrenBestPath = minimaxPath(node.state, levels - 1, playerIndex);
      
      if (!nextAction) {
        childrenBestPath.path.splice(0, 0, false);
        currentBest = childrenBestPath;
      }

      if (isHousePlayer && childrenBestPath.scoreSoFar < currentBest.scoreSoFar
        || (!isHousePlayer && childrenBestPath.scoreSoFar > currentBest.scoreSoFar
        || !nextAction)) { return }
        
      let nextMove = nextAction as Moves.Move;
        
      if (currentBest.scoreSoFar === childrenBestPath.scoreSoFar && childrenBestPath.path[0]) {
        const tieBreakMove = Moves.moveTieBreaker(nextMove, currentBest.path[0] as Moves.Move);
        if (!tieBreakMove || !Moves.areMovesEqual(nextMove, tieBreakMove)) { 
          return;
        }
      } 
      childrenBestPath.path.splice(0, 0, nextMove);
      currentBest = childrenBestPath;

    });

    return currentBest;
  }
}

