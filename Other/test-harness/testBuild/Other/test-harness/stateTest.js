"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseJson_1 = require("./parseJson");
const conversionUtils_1 = require("./conversionUtils");
/**
 * State is
 *    { "players" : Player*,
 *      "board" : Board }
 *
 * Player* is [Player, ..., Player]
 * INTERPRETATION The array lists all players and specifies the order in which they take turns.
 *
 * Player is
 *    { "color" : Color,
 *      "score" : Natural,
 *      "places" : [Position, ..., Position] }
 * INTERPRETATION The color identifies a player's penguins on the board, the score represents how many
 * fish the player has collected so far, and the last field shows where the player's penguins are located.
 *
 * CONSTRAINT All penguins must occupy distinct tiles on the board.
 */
main();
function main() {
    var s = process.stdin;
    let jsonArray = [];
    parseJson_1.parseJSON(s, jsonArray, () => {
        if (jsonArray.length !== 1) {
            throw new Error('Usage: must Input a State');
        }
        const matthiasState = jsonArray[0];
        const state = conversionUtils_1.convertStateMatthiasToOurState(matthiasState);
        // first player in the list
        const firstPenguin = state.penguinTeams[0].penguins[0];
        // try to move their first penguin to north, northeast, southeast, south, southwest, northwest
        const maybeFirstMove = conversionUtils_1.moveWithFirstClockwiseMove(firstPenguin, state);
        if (!maybeFirstMove) {
            console.log(false);
        }
        else {
            const firstMove = maybeFirstMove;
            const tryRotate = firstMove.penguinTeams.shift();
            const newPenguinTeam = firstMove.penguinTeams;
            newPenguinTeam.push(tryRotate);
            const newState = {
                penguinTeams: newPenguinTeam,
                playersTurn: firstMove.playersTurn,
                turn: firstMove.turn,
                board: firstMove.board,
            };
            const newMatthiasState = conversionUtils_1.convertOurStateToStateMatthias(newState);
            console.log(JSON.stringify(newMatthiasState));
        }
    });
}
