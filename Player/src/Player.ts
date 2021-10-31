import { State } from '../../Common/src/Model/State';
import { PlayerInterface } from '../../Common/src/Interface/player-interface';
import { Strategy } from './Strategy';

/**
 * The HousePlayer is a Player that utilizes the strategy described in ./Strategy
 * The HousePlayer places penguins in a zig-zag pattern, and makes moves based on the minimaxMove
 * function
 *
 * For further reference look at Common/src/Interface/Player-Interface
 */
export const HousePlayer: PlayerInterface.Player = {
  
  /**
   * the default name of the houseplayer, will be modified before games begin
   */
   username: 'default',

  /**
   * Age of the player
   */
  age: 20,
  /**
   * Referee tells the player it is their turn to place a penguin on the board.
   * The Player returns the position they wish to add a penguin to.
   *
   * To see coordinate system refer to: ../Model/Board
   *
   * @param state the player is given state to make their move off of
   * @return {row: number, column: number} the position to move a penguin to
   */
  getPenguinPlacement: (state: State.GameState) => Strategy.penguinPlacements(state),
  /**
   * Referee tells the player that it is their turn, it is up to the player
   * to determine their next move
   *
   * To see coordinate system refer to: ../Model/Board
   *
   * @param state the player is given state to make their move off of
   * @return [{row: number, column: number}, {row: number, column: number}] which represents
   *         the position to move a penguin from, and the position to move a penguin to
   */
  getPenguinMove: (state: State.GameState) =>
    Strategy.minimaxMove(state, state.penguinTeams.length * 3),

  // Our player does not care about reports from the referee unless
  // they must place a penguin or make a move so all of these functions
  // do nothing
  gameOver: () => {},
  somePlayerChangedState: () => {},
  kickOut: () => {},
  gameIsStarting: () => {},
  gameSetupBegins: () => {},
  tournamentOver: (didIWin: boolean) => true,
};
