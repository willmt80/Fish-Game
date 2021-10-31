import {PlayerInterface} from '../../../Common/src/Interface/player-interface';
export namespace TournamentManager {
  /**
   * A competitor in the tournament is a player
   */

  /**
   * Represents an observer of the tournament
   */
  export type Observer = {
    // Reports an update to an observer of the tournament
    update: (...args: any) => void;
  }

  /**
   * Represents a tournament manager of the game which manages up to thousands of 
   * contestants participating in a tournament which runs thousands of games in total
   */
  export type Manager = {

    /**
     * Begins a tournament with the players who have signed up, and handles any functionality that
     * needs to be done outside of the run games.
     * @param contestants the list of the contestants that will play in this tournament 
     */
    startTournament: (participants: PlayerInterface.Player[]) => void;
    
    /**
     * Runs a tournament in it's entierty and compiles the result of the tournament
     * @param contestants the current active contestants in the tournament
     * @return the resulting sorted list of contestants based on score system of the tournament
     */
    runTournament: (participants: PlayerInterface.Player[]) => PlayerInterface.Player[];

    /**
     * allocates all contestants to games and runs an entire round of the tournament
     * @param contestants the list of contestants playing in this round
     * @return the list of contestants remaining after an entire round has been played
     */
    playRound: (contestants: PlayerInterface.Player[]) => PlayerInterface.Player[];

    /**
     * Plays an individual game with the given contestants and returns the contestants
     * after a game has completed. optionally updates the scores and win statistics 
     * of the contestants depending on the structure of the tournament
     * @param contestants the contestants that will be playing one game
     * @return the list of contestants with updates from the results of the game
     */
    playGame: (contestants: PlayerInterface.Player[]) => PlayerInterface.Player[];

    /**
     * Manages the resulting contestants once the tournament has finished running and returns a
     * list of the resuting contestants in sorted order by their standing in the tournament
     * @param finalContestants The players that remain at the end of a torunament
     * @return the list of the contestants in sorted order by their standing in the tournament 
     */
    manageEndOfTournament: (finalContestants: PlayerInterface.Player[]) => PlayerInterface.Player[]

    /**
     * adds observers to matches, each function should report updates to observers
     * @param observers a list of functions that report updates on the tournament
     */
    manageObservers: (observers: Observer[]) => void;
  };
}