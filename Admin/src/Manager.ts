import { PlayerInterface } from "../../Common/src/Interface/player-interface";
import { Board } from "../../Common/src/Model/Board";
import { TournamentManager } from "./Interface/manager-interface";
import { Referee } from "./Referee";

/**
 * The manager takes in players who have signed up, then creates referees 
 * for and runs a single game tournament until a winner or several
 * winners emerge. The tournament uses a knock-out elimination system 
 * and the top finisher(s) of every game of round n move on to round
 * n+1. The tournament ends when two tournament rounds of games in a 
 * row produce the exact same winners, when there are too few players
 * for a single game, or when the number of participants has become 
 * small enough to run a single final game. When the tournament
 * is over the manager informs all actives players whether they won or lost.
 */
export namespace Manager {
  const MAX_PLAYERS = 4;
  const MIN_PLAYERS = 2;

  // We want a standard board size for the tournament
  // hole placement and number of fish are handled by
  // the Referee
  const ROWS = 5;
  const COLUMNS = 5;

  type ActivePlayers = {
    remainingPlayers: PlayerInterface.Player[];
    losers: PlayerInterface.Player[];
  };

  /**
   * runs a tournament with the players who have signed up
   * then alerts the players that were not kicked if they won or lost
   * returns a promise with the final winners of the tournament
   * @param contestants the list of the contestants that will play in this tournament
   * @param board optionally pass in a board that will be used for all games in the tournament
   * @return a promise with the winners of the tournament
   */
  export async function runTournamentWithResults(
    participants: PlayerInterface.Player[],
    board?: Board.Board
  ): Promise<PlayerInterface.Player[]> {
    const activePlayers: ActivePlayers = await runTournament(
      participants,
      board
    );
    tellPlayersTheyLost(activePlayers.losers);
    const winnerResponses: ActivePlayers = await tellPlayersTheyWon(
      activePlayers.remainingPlayers
    );
    return winnerResponses.remainingPlayers;
  }

  /**
   * Runs a tournament in it's entirety and compiles the result of the tournament
   *
   * INVARIANT: The Players passed into this function will have unique usernames
   *
   * @param contestants the current active contestants in the tournament
   * @param board? optionally pass in a board that will be used for all games in the tournament
   * @return a promise with the array of winners of a tournament
   */
  export async function runTournament(
    contestants: PlayerInterface.Player[],
    board?: Board.Board
  ): Promise<ActivePlayers> {
    if (contestants.length < MIN_PLAYERS) {
      return { remainingPlayers: contestants, losers: [] };
    }
    const roundResults = await playRound(contestants, board);
    if (contestants.length <= MAX_PLAYERS) {
      return roundResults;
    }
    if (arePlayerArraysTheSame(roundResults.remainingPlayers, contestants)) {
      return roundResults;
    }
    const nextRound = await runTournament(roundResults.remainingPlayers, board);
    nextRound.losers.push(...roundResults.losers);
    return nextRound;
  }

  /**
   * Determines if the two given player arrays are the same
   * @param players1 the first array to check
   * @param players2 the second array to check
   */
  export function arePlayerArraysTheSame(
    players1: PlayerInterface.Player[],
    players2: PlayerInterface.Player[]
  ): boolean {
    const sortedPlayers1 = [...players1];
    sortedPlayers1.sort(sortPlayerPredicateUsername);
    const sortedPlayers2 = [...players2];
    sortedPlayers2.sort(sortPlayerPredicateUsername);
    if (players1.length === players2.length) {
      for (let i = 0; i < players1.length; i++) {
        if (sortedPlayers1[i].username !== sortedPlayers2[i].username) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Allocates all contestants to games and runs an entire round of the tournament
   * @param contestants the list of contestants playing in this round
   * @param board optionally pass in board to be used in all games
   * @return a promise with the list of contestants remaining after an entire round has been played
   */
  export async function playRound(
    contestants: PlayerInterface.Player[],
    board?: Board.Board
  ): Promise<ActivePlayers> {
    const allocatedContestants = allocatePlayersToGames(contestants);
    const finalContestants: ActivePlayers = {
      remainingPlayers: [],
      losers: [],
    };
    let winningPlayers = [];
    let losers = [];
    let playerResults: Referee.GameEndReport;
    for (let playerGroup of allocatedContestants) {
      playerResults = await playGame(playerGroup, board);
      winningPlayers = playerResults.winners.map(
        (playerResult) => playerResult.player
      );
      losers = playerResults.losers.map((playerResult) => playerResult.player);
      finalContestants.remainingPlayers.push(...winningPlayers);
      finalContestants.losers.push(...losers);
    }
    return finalContestants;
  }

  /**
   * Creates an array of array of contestants that represents the players that
   * will be in each game for a round of the tournament
   * @param contestants the list of contestants for this round of the tournament
   */
  export function allocatePlayersToGames(
    contestants: PlayerInterface.Player[]
  ): PlayerInterface.Player[][] {
    const copyContestants: PlayerInterface.Player[] = [...contestants];
    const result: PlayerInterface.Player[][] = [];
    let numPlayersToAdd = MAX_PLAYERS;
    while (copyContestants.length > 0) {
      if (
        copyContestants.length < numPlayersToAdd &&
        copyContestants.length < MIN_PLAYERS
      ) {
        const contestantsToAddBack = result.pop() as PlayerInterface.Player[];
        copyContestants.push(...contestantsToAddBack);
        // TODO: Run tests to determine if this condition is necessary 
        if (numPlayersToAdd === MAX_PLAYERS) {
          numPlayersToAdd -= 1;
        }
      }
      const add = copyContestants.splice(0, numPlayersToAdd);
      add.sort(sortPlayerPredicateAge);
      result.push([...add]);
    }
    return result;
  }

  /**
   * The function used to sort players in ascending order by their age
   * If the ages of two players are the same, sort players by the lexicographic
   * order of their username
   * 
   * @param player1 The first player
   * @param player2 The second player
   * @return negative number of player1 comes before player2 or positive if 
   *         player2 comes before player1
   */
  function sortPlayerPredicateAge(
    player1: PlayerInterface.Player,
    player2: PlayerInterface.Player
  ): number {
    if (player1.age === player2.age) {
      return sortPlayerPredicateUsername(player1, player2);
    } else {
      return player1.age - player2.age;
    }
  }

  /**
   * The function used to sort players in ascending order by their age
   * @param player1 The first player
   * @param player2 The second player
   * @return negative number of player1 comes before player2 or positive if 
   *         player2 comes before player1
   */
  function sortPlayerPredicateUsername(
    player1: PlayerInterface.Player,
    player2: PlayerInterface.Player
  ) {
    return player1.username.localeCompare(player2.username);
  }

  /**
   * Plays an individual game with the given contestants and returns the contestants
   * after a game has completed. optionally updates TournamentManager. the scores and win statistics
   * of the contestants depending on the structure of the tournament
   * @param contestants the contestants that will be playing one game
   * @param board? optionally pass in board to be used for this game
   * @return the list of contestants with updates from the results of the game
   */
  export async function playGame(
    players: PlayerInterface.Player[],
    board?: Board.Board
  ): Promise<Referee.GameEndReport> {
    if (board === undefined) {
      return Referee.refereeGame(players, ROWS, COLUMNS);
    } else {
      return Referee.refereeGameWithBoard(players, board);
    }
  }

  /**
   * Alerts players they have won the tournament
   * If players do not accept that they won, then they will become losers
   * @param winners the winners of the tournament
   */
  export async function tellPlayersTheyWon(
    winners: PlayerInterface.Player[]
  ): Promise<ActivePlayers> {
    const newWinners: PlayerInterface.Player[] = [];
    const newLosers: PlayerInterface.Player[] = [];
    for (const player of winners) {
      try {
        const response = await Referee.promiseTimeout(
          5000,
          Referee.callPlayerFunction<boolean>(() => {
            return player.tournamentOver(true);
          })
        );
        if (response) {
          newWinners.push(player);
        } else {
          newLosers.push(player);
        }
      } catch {
        newLosers.push(player);
      }
    }
    setTimeout(() => {})
    return { remainingPlayers: newWinners, losers: newLosers };
  }

  /**
   * Alert players they have lost the tournament
   * @param losers the losing players
   */
  function tellPlayersTheyLost(losers: PlayerInterface.Player[]): void {
    losers.forEach(async (player) => {
      try {
        Referee.promiseTimeout(
          10,
          Referee.callPlayerFunction<boolean>(() =>
            player.tournamentOver(false)
          )
        );
      } catch {
        return;
      }
    });
  }
}
