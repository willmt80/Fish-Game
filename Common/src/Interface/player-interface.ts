import { GameColor } from '../Model/GameColor';
import { Position } from '../Model/Position';
import { State } from '../Model/State';
import { Moves } from '../Model/Moves';

export namespace PlayerInterface {
  /**
   * Represents a player of the game
   * A player should have the functionality to place a penguin and make a move.
   * Other functions are optional, but must be present in the type
   * Constraint: Each player must terminate execution of it's methods within 30 seconds
   */
  export type Player = {
    /**
     * Username of the player. This should be unique and the system will check for this upon sign-up.
     */
    username: string,
     
    /**
     * Age of the player
     */
    age: number,
    /**
     * Referee tells the player that it is time to place penguins
     * @param color the referee tells the player its assigned color
     * @param turnOrder the assigned turn order for players in the game
     * @param state the state of the game before any penguins have been placed
     */
    gameSetupBegins: (
      color: GameColor,
      turnOrder: GameColor[],
      state: State.GameState
    ) => void;
    /**
     * Referee tells the player it is their turn to place a penguin on the board.
     * The Player returns the position they wish to add a penguin to.
     *
     * To see coordinate system refer to: ../Model/Board
     *
     * @param state the player is given state to make their move off of
     * @return {row: number, column: number} the position to move a penguin to
     */
    getPenguinPlacement: (state: State.GameState) => Position.position;
    /**
     * Referee tells the player that the game is starting
     *
     * @param state the state of the game at start.
     *              this allows the player to see all penguin positions
     */
    gameIsStarting: (state: State.GameState) => void;
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
    getPenguinMove: (state: State.GameState) => Moves.Move;

    /**
     * Referee kicks the player out of the game when they make an invalid move
     */
    kickOut: () => void;

    /**
     * Referee shows player the state of the game after a rival player takes changes the state
     * is called when another player places a penguin or moves a penguin
     *
     * @param state the player is given the state of the game to see new penguin positions
     */
    somePlayerChangedState: (state: State.GameState) => void;

    /**
     * The referee tells the player that the game is over, and whether or not they
     * @param didIWin did the player win
     */
    gameOver: (didIWin: boolean) => void;

    /**
     * The tournament manager tells the player if they won or lost the tournament
     * If the player wins, they must accept that they won the tournament
     * @param didIWin did the player win
     * @return true if the player accepts the fact that they won
     */
    tournamentOver: (didIWin: boolean) => boolean;
  };
}
