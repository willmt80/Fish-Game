"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberUtils_1 = require("../../Common/src/Utils/NumberUtils");
const conversionUtils_1 = require("./conversionUtils");
const parseJson_1 = require("./parseJson");
const Strategy_1 = require("../../Player/src/Strategy");
/**
 * Depth-State is [D, State]
 *    where D is a Natural in [1,2]
 *    and state is a StateMatthias defined elsewhere
 */
main();
function main() {
    var s = process.stdin;
    let jsonArray = [];
    parseJson_1.parseJSON(s, jsonArray, () => {
        if (jsonArray.length !== 1) {
            throw new Error('Expected a single Depth State');
        }
        const [depth, stateMatthias] = jsonArray[0];
        if (!NumberUtils_1.isPositiveInteger(depth)) {
            throw new Error('Depth must be greater than 0');
        }
        const state = conversionUtils_1.convertStateMatthiasToOurState(stateMatthias);
        const depthSearch = state.penguinTeams.length * depth;
        try {
            const bestMove = Strategy_1.Strategy.minimaxMove(state, depthSearch);
            const positionWithBestMove = [
                [bestMove.from.row, bestMove.from.column],
                [bestMove.to.row, bestMove.to.column],
            ];
            console.log(JSON.stringify(positionWithBestMove));
        }
        catch (_a) {
            console.log(false);
        }
    });
}
