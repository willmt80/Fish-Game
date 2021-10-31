"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameColor_1 = require("../../Common/src/Model/GameColor");
const Moves_1 = require("../../Common/src/Model/Moves");
const Space_1 = require("../../Common/src/Model/Space");
const State_1 = require("../../Common/src/Model/State");
/**
 * Converts the json board representation to the Board in our model
 * @param matthiasBoard a 2d array of numbers
 */
function convertMatthiasBoardToOurBoard(matthiasBoard) {
    let spaces = [];
    const rowMax = findRowWithMaxColumns(matthiasBoard);
    for (let row = 0; row < matthiasBoard.length; row++) {
        spaces.push(convertMatthiasRowToOurRow(matthiasBoard[row], rowMax));
    }
    return { tiles: spaces };
}
exports.convertMatthiasBoardToOurBoard = convertMatthiasBoardToOurBoard;
/**
 * Finds the row with the max number of columns, used to pad
 * short rows with appropriate number of 0 tiles
 * @param matthiasBoard the input board
 */
function findRowWithMaxColumns(matthiasBoard) {
    return Math.max(...matthiasBoard.map((row) => row.length));
}
/**
 * Converts a row of numbers to a row of Space
 * @param matthiasRow an array of numbers
 * @param maxRowLength the length of the row with the most tiles (for padding)
 */
function convertMatthiasRowToOurRow(matthiasRow, maxRowLength) {
    const newRow = [];
    let fish;
    for (let col = 0; col < matthiasRow.length; col++) {
        fish = matthiasRow[col];
        if (fish > 0) {
            newRow.push({ fish: fish });
        }
        else {
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
function convertMatthiasPositionToPositionType(matthiasPosition) {
    return { row: matthiasPosition[0], column: matthiasPosition[1] };
}
exports.convertMatthiasPositionToPositionType = convertMatthiasPositionToPositionType;
/**
 * Converts the JSON state representation to a State in our model
 *
 * @param matthiasState a list of players and a board
 */
function convertStateMatthiasToOurState(matthiasState) {
    const board = convertMatthiasBoardToOurBoard(matthiasState.board);
    const penguinTeams = convertPlayersMatthiasToPenguinTeams(matthiasState.players);
    return {
        board,
        penguinTeams,
        turn: 0,
        playersTurn: 0,
    };
}
exports.convertStateMatthiasToOurState = convertStateMatthiasToOurState;
/**
 * Converts the JSON list of players to a record of PenguinTeam in our model
 *
 * @param players a list of players
 */
function convertPlayersMatthiasToPenguinTeams(players) {
    const penguinTeams = players.reduce((teams, player) => {
        const gameColor = convertMatthiasColorStringToGameColor(player.color);
        teams.push(convertPlayerMatthiasToPenguinTeam(player, gameColor));
        return teams;
    }, []);
    return penguinTeams;
}
/**
 * Converts the JSON player to a PenguinTeam in our model
 *
 * @param player a player
 * @param gameColor a GameColor
 */
function convertPlayerMatthiasToPenguinTeam(player, gameColor) {
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
function convertMatthiasColorStringToGameColor(color) {
    switch (color) {
        case 'red':
            return GameColor_1.GameColor.RED;
        case 'brown':
            return GameColor_1.GameColor.BROWN;
        case 'white':
            return GameColor_1.GameColor.WHITE;
        case 'black':
            return GameColor_1.GameColor.BLACK;
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
function convertGameColorStringToMatthiasColor(color) {
    switch (color) {
        case GameColor_1.GameColor.RED:
            return 'red';
        case GameColor_1.GameColor.BROWN:
            return 'brown';
        case GameColor_1.GameColor.WHITE:
            return 'white';
        case GameColor_1.GameColor.BLACK:
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
function convertOurStateToStateMatthias(state) {
    const board = convertOurBoardToMatthiasBoard(state.board);
    const players = convertPenguinTeamsToMatthiasPlayers(state.penguinTeams);
    return {
        board,
        players,
    };
}
exports.convertOurStateToStateMatthias = convertOurStateToStateMatthias;
/**
 * Convert our board representation back into a matthias board representation
 * @param board our Board
 */
function convertOurBoardToMatthiasBoard(board) {
    return board.tiles.map((row) => {
        return row.map((space) => {
            return Space_1.Space.getFish(space);
        });
    });
}
/**
 * Converts our penguinTeams to a JSON list of players
 *
 * @param teams the penguinTeams indexed by the gameColor
 */
function convertPenguinTeamsToMatthiasPlayers(teams) {
    return teams.map((team) => {
        const matthiasColor = convertGameColorStringToMatthiasColor(team.color);
        const penguinsToPositions = team.penguins.map((penguin) => [
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
function moveWithFirstClockwiseMove(penguin, state) {
    if (!!!penguin.position) {
        return false;
    }
    const orderedMoves = getAllOneTileMoves(penguin.position, state.board);
    if (orderedMoves === []) {
        return false;
    }
    else {
        return State_1.State.movePenguin(state.playersTurn, { from: penguin.position, to: orderedMoves[0] }, state);
    }
}
exports.moveWithFirstClockwiseMove = moveWithFirstClockwiseMove;
/**
 * gets a list of all of the positions of tiles within one space of the given position
 *
 * @param position the starting position
 * @param board the board
 */
function getAllOneTileMoves(position, board) {
    const holeyMoveArray = [
        Moves_1.Moves.getUp(position, board),
        Moves_1.Moves.getDiagonalRightUp(position, board),
        Moves_1.Moves.getDiagonalRightDown(position, board),
        Moves_1.Moves.getDown(position, board),
        Moves_1.Moves.getDiagonalLeftDown(position, board),
        Moves_1.Moves.getDiagonalLeftUp(position, board),
    ];
    const positionsThatAreTiles = [];
    holeyMoveArray.forEach((pos) => {
        if (pos !== null) {
            positionsThatAreTiles.push(pos);
        }
    });
    return positionsThatAreTiles;
}
