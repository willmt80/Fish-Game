"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("../../Common/src/Model/Board");
const State_1 = require("../../Common/src/Model/State");
const GameColor_1 = require("../../Common/src/Model/GameColor");
const GameTree_1 = require("../../Common/src/Model/GameTree");
/**
 * Represents a Referee for a game of fish.
 * A referee supervises an individual game after being handed a number of players. The referee sets up a board and interacts with the players according to the interface protocol.
 * It removes a player that fails or cheats. When the game is over, it reports the outcome of the game and the failing and cheating players.
 * During the game, the referee updates the players on the status of the game.
 * The Referee is also keep players/observers up to date on the status of the game.
 *
 * NOTE: Referee functions are all asynchronous and return promises, this is to accomodate
 * the possibility of timing out players whose actions take to long and to
 * allow the tournament manager to await answers from the referee instead of necessarily running
 * every single game in the round of a tournament sequentially
 */
var Referee;
(function (Referee) {
    // Constants
    // Max number of players in a game
    const MAX_PLAYERS = 4;
    // Min number of players in a game
    const MIN_PLAYERS = 1;
    // Number of penguins per player is calculated as 6 - #of players
    // thus if there were zero players (impossible) then the base team size is 6
    const BASE_TEAM_SIZE = 6;
    // The amount of time that the Referee will wait for a player to respond to a request to place piece/move in ms.
    const WAIT_TIME = 5000;
    // The order that the referee assigns colors to players.
    // I.E. If there are two players their colors will be red and black
    const COLOR_ORDERING = [
        GameColor_1.GameColor.BLACK,
        GameColor_1.GameColor.RED,
        GameColor_1.GameColor.WHITE,
        GameColor_1.GameColor.BROWN,
    ];
    /**
     * Referees a game from start to finish. The referee constructs the board, assigns colors to players,
     * prompts players to place penguins, and facilitates moves.
     *
     * Constraints: The referee will kick players out if they
     * a) submit invalid moves,
     * b) place penguins in invalid positions
     * c) error on their turn
     * The referee cannot currently kick out players for taking too long. However,
     * we assign the time out to a tcp player type that can shut down if it does not receive information quickly enough
     * The referee assumes all players passed to it will work in terms of the player-interface
     * which specifies that players must not take more than WAIT_TIME to submit moves.
     *
     * INVARIANT: Players are given to the referee sorted by age. There must be between 2 and 4 players
     * INVARIANT: Given rows and columns such that each player
     *            can place 6 - N penguins on the board (N being the number of players)
     *
     * @param players a sorted list of players
     * @param rows the row dimension of the board
     * @param columns the column dimension of the board
     */
    function refereeGame(players, rows, columns) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = constructBoard(rows, columns, players.length);
            return refereeGameWithBoard(players, board);
        });
    }
    Referee.refereeGame = refereeGame;
    /**
     * Construct initial state of the game
     * INVARIANT: Given board will have enough tiles such that all players
     *            will be able to place their penguins
     *
     * @param colorsInUse the colors for the PenguinTeams of the game
     * @param board the board to
     */
    function constructInitialGameState(colorsInUse, board) {
        const penguinTeams = State_1.State.createPenguinTeams(colorsInUse);
        return {
            board,
            penguinTeams,
            playersTurn: 0,
            turn: 0,
        };
    }
    Referee.constructInitialGameState = constructInitialGameState;
    /**
     * Constructs a Board for our game with a given number of rows and columns
     * and there will not be too many holes for each player to place their penguins
     * INVARIANT: Given rows and columns such that each player
     *            can place 6 - N penguins on the board (N being the number of players)
     *
     * @param rows the rows of the board
     * @param columns the columns of the board
     * @param numberOfPlayers the number of players in the game
     */
    function constructBoard(rows, columns, numberOfPlayers) {
        const holes = getHoles(rows, columns, numberOfPlayers);
        return Board_1.Board.createBoard(rows, columns, holes, 5, rows * columns - holes.length, true);
    }
    Referee.constructBoard = constructBoard;
    /**
     * Constructs an array of positions representing where to add holes to the board
     * Note: holes are not guaranteed to be unique
     *
     * @param rows the number of rows in the boards
     * @param columns the number of columns in the board
     * @param numberOfPlayers the number of players in the game
     */
    function getHoles(rows, columns, numberOfPlayers) {
        const maxNumberOfHoles = getNumberOfHoles(rows, columns, numberOfPlayers);
        const holes = [];
        for (let i = 0; i < maxNumberOfHoles; i++) {
            const row = Math.floor(Math.random() * rows);
            const column = Math.floor(Math.random() * columns);
            holes.push({ row, column });
        }
        return holes;
    }
    /**
     * Gets the max number of holes for a board of the given size
     *
     * @param rows the number of rows in the board
     * @param columns the number of columns in the board
     * @param numberOfPlayers the number of players in the game
     */
    function getNumberOfHoles(rows, columns, numberOfPlayers) {
        return Math.floor((rows * columns - numberOfPlayers * (6 - numberOfPlayers)) / 5);
    }
    Referee.getNumberOfHoles = getNumberOfHoles;
    /**
     * Referee a complete game played on the given board
     *
     * @param players a sorted list of players
     * @param board the board with which the game will be played
     */
    function refereeGameWithBoard(players, board) {
        return __awaiter(this, void 0, void 0, function* () {
            const colorsInUse = COLOR_ORDERING.slice(0, players.length);
            const state = constructInitialGameState(colorsInUse, board);
            alertPlayersOfTheirColors(players, colorsInUse, state);
            return refereeGameWithState(players, state);
        });
    }
    Referee.refereeGameWithBoard = refereeGameWithBoard;
    /**
     * Referee a complete game keeping track of players removed, given the state for testing purposes
     *
     * INVARIANT: Players are given to the referee sorted by age. There must be between 1 and 4 players
     * INVARIANT: Given rows and columns such that each player
     *            can place 6 - N penguins on the board (N being the number of players)
     * ACCUMULATOR: the accumulated list of players that have been kicked from the game so far for rule violations
     *
     * @param players a sorted list of players
     * @param initialState the starting state of the game
     */
    function refereeGameWithState(players, initialState) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentState, remainingPlayers, kickedPlayers, } = yield penguinPlacementPhase(players, initialState);
            alertPlayersTheGameIsBeginning(remainingPlayers, currentState);
            const movePhaseResult = yield movePenguinsPhase(remainingPlayers, currentState);
            kickedPlayers.push(...movePhaseResult.kickedPlayers);
            const gameReport = getGameEndReport(movePhaseResult.currentState, movePhaseResult.remainingPlayers, kickedPlayers);
            alertPlayersTheGameIsOver(gameReport);
            return gameReport;
        });
    }
    Referee.refereeGameWithState = refereeGameWithState;
    /**
     * The section of gameplay in which players place their penguins on the board
     *
     * If a player proposes a placement that is not on a tile, they will be kicked out of the game
     * this section ends once all players have placed the 6 - N penguins where N is the number of players
     *
     * @param players the players of the game
     * @param gameState the state to add penguins to
     * @return the game state result of placing all penguins on the board
     */
    function penguinPlacementPhase(players, gameState) {
        return __awaiter(this, void 0, void 0, function* () {
            const howManyPenguins = BASE_TEAM_SIZE - players.length;
            return penguinPlacementPhaseWithPenguins(players, gameState, howManyPenguins);
        });
    }
    Referee.penguinPlacementPhase = penguinPlacementPhase;
    /**
     * The section of gameplay in which players place their penguins on the board with constant
     * penguins per player
     *
     * If a player proposes a placement that is not on a tile, they will be kicked out of the game
     * this section ends once all players have placed the 6 - N penguins where N is the number of players
     *
     * @param players the players of the game
     * @param gameState the state to add penguins to
     * @param penguinsPerPlayer the number of penguins that each team has
     * @return  the game state result of placing all penguins on the board, the player still in the game,
     *          and the players who were kicked from the game for violating the rules
     */
    function penguinPlacementPhaseWithPenguins(players, gameState, penguinsPerPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = gameState;
            let kickedPlayersPlacement = [];
            let currentPlayers = [...players];
            for (let placementRound = 0; placementRound < penguinsPerPlayer; placementRound++) {
                const { currentState, remainingPlayers, kickedPlayers } = yield roundOfPlacement(currentPlayers, state);
                state = currentState;
                currentPlayers = [...remainingPlayers];
                kickedPlayersPlacement.push(...kickedPlayers);
            }
            return { currentState: state, remainingPlayers: currentPlayers, kickedPlayers: kickedPlayersPlacement };
        });
    }
    /**
     * Each player places one penguin on the board
     *
     * If a player submits an invalid placement, we return their player index for the
     * referee to kick out
     * @param players the players of the game
     * @param gameState the state of the game
     * @returns a Promise of StateAndPlayerStatuses where the final state is the state
     *         after all placements have been made for this round, the remaining players are players who were
     *         not kicked out of the game, and kicked players are players that were caught violating the rules
     */
    function roundOfPlacement(players, gameState) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = gameState;
            const kickedPlayersPlacement = [];
            let currentPlayers = [...players];
            for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
                const { currentState, remainingPlayers, kickedPlayers, } = yield applyActionToState(penguinPlacement, currentPlayers, state);
                state = currentState;
                kickedPlayersPlacement.push(...kickedPlayers);
                currentPlayers = remainingPlayers;
                alertPlayersTheStateHasChanged(currentPlayers, state);
            }
            return { currentState: state, remainingPlayers: currentPlayers, kickedPlayers: kickedPlayersPlacement };
        });
    }
    /**
     * Applies a penguin action to the state of the game. Kicks any players that try to do an invalid action.
     * @param applyAction function which applies action to the game
     * @param players the players of the game
     * @param state the state of the game to modify
     * @return the status of the game after the action with the updated kicked and current players
     */
    function applyActionToState(applyAction, players, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const currPlayerIndex = state.playersTurn;
            const currentPlayer = Object.assign({}, players[currPlayerIndex]);
            const copyState = State_1.State.copyState(state);
            const stateAfterActionPromise = applyAction(copyState, currentPlayer);
            return stateAfterActionPromise.then((response) => {
                return { currentState: response, remainingPlayers: players, kickedPlayers: [] };
            }).catch((err) => {
                callPlayerFunction(() => currentPlayer.kickOut());
                const newCurrPlayers = removeFromPlayerArray(players, currPlayerIndex);
                return {
                    currentState: State_1.State.removePlayer(state, currPlayerIndex),
                    remainingPlayers: newCurrPlayers,
                    kickedPlayers: [currentPlayer]
                };
            });
        });
    }
    /**
     * Gets the state resulting from the given player placing the penguin in the given state
     * @param state the state of the game to add a penguin to
     * @param currentPlayer the current player of the game
     * @param playerIndex the index of the player placing the penguin
     * @return a game state with the penguin placed or throws an error
     */
    function penguinPlacement(state, currentPlayer) {
        const playerIndex = state.playersTurn;
        return promiseTimeout(WAIT_TIME, callPlayerFunction(() => {
            return currentPlayer.getPenguinPlacement(state);
        })).then((response) => {
            if (response &&
                State_1.State.isValidPenguinPlacement(response, state)) {
                return State_1.State.placePenguin(playerIndex, response, state);
            }
            else {
                throw Error("Proposed placement is not valid given the contraints of the given gamestate");
            }
        }).catch((err) => {
            throw Error(err);
        });
    }
    /**
     * The section of gameplay where all penguins have been placed, and players begin taking turns.
     *
     * If a player proposes a move that is invalid, the referee will kick them out
     * If only one player remains or no player can make a move, the game is over
     *
     * @param players the player in the game
     * @param gameState the current state of the game
     * @return a [finalState, remainingPlayers, kickedPlayers] where the final state is the state
     *         after all turns have been taken and the game is over, the remaining players are players who were
     *         not kicked out of the game, and kicked players are players that were caught violating the rules
     */
    function movePenguinsPhase(players, gameState) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = gameState;
            const kickedPlayersMoveRound = [];
            let currentPlayers = players;
            while (State_1.State.canAnyPenguinBeMoved(state) &&
                state.penguinTeams.length >= MIN_PLAYERS) {
                const { currentState, remainingPlayers, kickedPlayers, } = yield applyActionToState(penguinMove, currentPlayers, state);
                state = currentState;
                kickedPlayersMoveRound.push(...kickedPlayers);
                currentPlayers = remainingPlayers;
                alertPlayersTheStateHasChanged(currentPlayers, State_1.State.copyState(state));
            }
            return { currentState: state, remainingPlayers: currentPlayers, kickedPlayers: kickedPlayersMoveRound };
        });
    }
    Referee.movePenguinsPhase = movePenguinsPhase;
    /**
     * Gets the state resulting from the given player making a move on the given state
     * @param state the given state before the move
     * @param currentPlayer the player making the move
     * @return The state representing either new state after a penguin moves or throws an error
     */
    function penguinMove(state, currentPlayer) {
        const gameTreeChildren = GameTree_1.GameTree.generateChildren(state);
        // checks if there is no more moves for this penguin
        if (gameTreeChildren.length === 1 && !gameTreeChildren[0][0]) {
            // returns the state after skipping this penguins turn and advancing the order
            return new Promise((resolve, reject) => {
                resolve(gameTreeChildren[0][1].state);
            });
        }
        return promiseTimeout(WAIT_TIME, callPlayerFunction(() => {
            return currentPlayer.getPenguinMove(state);
        })).then((proposed) => {
            if (proposed
                && State_1.State.isValidPenguinMoveToPosition(proposed, state)) {
                return State_1.State.movePenguin(state.playersTurn, proposed, state);
            }
            else {
                throw Error("Proposed move is not valid given the contraints of the given gamestate");
            }
        }).catch((err) => {
            throw Error(err);
        });
    }
    Referee.penguinMove = penguinMove;
    /**
     * Call player function
     * Wraps call in a try catch. Promise will resolve if the function resolves
     * or throw an error otherwise
     * @param playerF the function to call
     */
    function callPlayerFunction(playerF) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield playerF();
                resolve(response);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    /**
     * Promises a timeout, times out an action if it takes longer than the given number of miliseconds
     * @param ms the time limit in miliseconds
     * @param promiseFn the promise on which the time limit is set
     */
    function promiseTimeout(ms, promiseFn) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a promise that rejects in <ms> milliseconds
            const timeout = new Promise((resolve, reject) => {
                setTimeout(reject, ms, 'Timed out in ' + ms + 'ms.');
            });
            // Returns a race between our timeout and the passed in promise
            return Promise.race([
                promiseFn,
                timeout
            ]);
        });
    }
    Referee.promiseTimeout = promiseTimeout;
    /**
     * Generates the report for the end of the game noting who won, who lost, and who was kicked out
     *
     * @param state the ending state of the game
     * @param players the players that remain in the game
     * @param kickedPlayers the players that were kicked out of the game
     */
    function getGameEndReport(state, players, kickedPlayers) {
        //const addFinalScores = State.addFinalPenguinPositionsToScore(state);
        const [winners, losers] = gameEndStatusOfNonKickedPlayers(state, players);
        return {
            winners: winners,
            losers: losers,
            kickedPlayers: kickedPlayers,
        };
    }
    /**
     * Gets the lists of the players who are winners and losers of the given game state
     *
     * INVARIANT: Will only be called on states in which no penguins can move OR states
     *            which only have one player
     * @param state the state of the game
     * @param players the players of the game
     */
    function gameEndStatusOfNonKickedPlayers(state, players) {
        let winners = [];
        let losers = [];
        let maxScoreSoFar = 0;
        players.forEach((player, index) => {
            const playerScore = state.penguinTeams[index].score;
            const playerResult = { player, score: playerScore };
            if (playerScore > maxScoreSoFar) {
                losers.push(...winners);
                winners = [playerResult];
                maxScoreSoFar = playerScore;
            }
            else if (playerScore === maxScoreSoFar) {
                winners.push(playerResult);
            }
            else {
                losers.push(playerResult);
            }
        });
        return [winners, losers];
    }
    /**
     * Alerts the players of the color they have been assigned for their team
     * @param players the players of the game
     * @param turnOrder the order the players will take turns (by color)
     * @param state the state of the game
     */
    function alertPlayersOfTheirColors(players, turnOrder, state) {
        players.forEach((player, index) => {
            // we don't particularly care if a player errors here, we will catch it in the moves rounds
            callPlayerFunction(function () {
                player.gameSetupBegins(COLOR_ORDERING[index], turnOrder, state);
            });
        });
    }
    /**
     * Alerts the players that the state of the game has been updated as a result
     * of some action in the game (a player being kicked out, placing a penguin, or moving a penguin)
     * @param players the players of the game
     * @param state the state of the game
     */
    function alertPlayersTheStateHasChanged(players, state) {
        players.forEach((player) => {
            callPlayerFunction(function () {
                player.somePlayerChangedState(state);
            });
        });
    }
    /**
     * Alerts the players that moving phase of the game is starting and notifies them of
     * the starting state of the game
     * @param players the players of the game
     * @param state the state of the game
     */
    function alertPlayersTheGameIsBeginning(players, state) {
        players.forEach((player) => {
            callPlayerFunction(function () {
                player.gameIsStarting(state);
            });
        });
    }
    /**
     * Tells the players that the game is over and notifies them of their
     * final standing
     *
     * Note: We do not alert kicked players that they have lost,
     *       they are aware that they have been kicked out
     * @param endReport the summary of the outcome of the game
     */
    function alertPlayersTheGameIsOver(endReport) {
        endReport.winners.forEach((playerResult) => {
            callPlayerFunction(function () {
                playerResult.player.gameOver(true);
            });
        });
        endReport.losers.forEach((playerResult) => {
            callPlayerFunction(function () {
                playerResult.player.gameOver(false);
            });
        });
    }
    /**
     * Removes the player at the given index from the array of players
     * @param players the array of players
     * @param kickOutIndex the index of the player to be removed
     */
    function removeFromPlayerArray(players, kickOutIndex) {
        const newPlayers = players.slice(0);
        newPlayers.splice(kickOutIndex, 1);
        return newPlayers;
    }
})(Referee = exports.Referee || (exports.Referee = {}));
