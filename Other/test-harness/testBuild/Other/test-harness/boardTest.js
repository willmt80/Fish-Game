"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Moves_1 = require("../../Common/src/Model/Moves");
const conversionUtils_1 = require("./conversionUtils");
const parseJson_1 = require("./parseJson");
/**
 *  Board-Posn is
 *    { "position" : Position,
 *      "board" : Board}
 * Board is a JSON array of JSON arrays where each element
 *  is either 0 or a number between 1 and 5.
 *  The size of the board may not exceed a total of 25 tiles.
 * INTERPRETATION A 0 denotes a hole in the board configuration. All other
 *  numbers specify the number of fish displayed on the tile.
 * Position is a JSON array that contains two natural numbers: [board-row,board-column].
 * INTERPRETATION The position uses the computer graphics coordinate system
 * meaning the Y axis points downwards. The position refers to a tile with at least one fish on it.
 */
/**
 * Runs the the json parser on std in
 *
 * Standard in must be of the form: number[][], number[]
 * Where the second array is the input board, and the first array is the move position
 */
main();
function main() {
    var s = process.stdin;
    let jsonArray = [];
    parseJson_1.parseJSON(s, jsonArray, () => {
        if (jsonArray.length < 1 || jsonArray.length > 1) {
            throw new Error('Must input a BoardPosn');
        }
        const board = conversionUtils_1.convertMatthiasBoardToOurBoard(jsonArray[0].board);
        const position = conversionUtils_1.convertMatthiasPositionToPositionType(jsonArray[0].position);
        // Getting all the reachable moves takes in a gamestate instead
        // of a board
        const emptyState = {
            board: board,
            penguinTeams: [],
            turn: 0,
            playersTurn: 0
        };
        const allMoves = Moves_1.Moves.getAllDestinations(position, emptyState);
        console.log(JSON.stringify(allMoves.length));
    });
}
