"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("../../Common/src/Model/State");
const GameTree_1 = require("../../Common/src/Model/GameTree");
const conversionUtils_1 = require("./conversionUtils");
const parseJson_1 = require("./parseJson");
const Position_1 = require("../../Common/src/Model/Position");
const Moves_1 = require("../../Common/src/Model/Moves");
const ArrayUtils_1 = require("../../Common/src/Utils/ArrayUtils");
main();
function main() {
    var s = process.stdin;
    let jsonArray = [];
    parseJson_1.parseJSON(s, jsonArray, () => {
        if (jsonArray.length !== 1) {
            throw new Error('Usage: must Input a State');
        }
        const moveResQuery = jsonArray[0];
        const state = conversionUtils_1.convertStateMatthiasToOurState(moveResQuery.state);
        const fromPosition = conversionUtils_1.convertMatthiasPositionToPositionType(moveResQuery.from);
        const toPosition = conversionUtils_1.convertMatthiasPositionToPositionType(moveResQuery.to);
        const moveFirstPlayer = State_1.State.movePenguin(0, { from: fromPosition, to: toPosition }, state); // if this throws then we were given an invalid state
        // we need to check if any of player 2's penguins can move into any of these positions
        const holeyMoveArray = [
            Moves_1.Moves.getUp(toPosition, moveFirstPlayer.board),
            Moves_1.Moves.getDiagonalRightUp(toPosition, moveFirstPlayer.board),
            Moves_1.Moves.getDiagonalRightDown(toPosition, moveFirstPlayer.board),
            Moves_1.Moves.getDown(toPosition, moveFirstPlayer.board),
            Moves_1.Moves.getDiagonalLeftDown(toPosition, moveFirstPlayer.board),
            Moves_1.Moves.getDiagonalLeftUp(toPosition, moveFirstPlayer.board),
        ].filter((value) => value !== null);
        const combinator = (action, moves) => {
            const newMoves = [];
            if (action[0]) {
                const destination = action[0].to;
                const reachesNeighboringPosition = ArrayUtils_1.orMap(holeyMoveArray, (holeyMove) => Position_1.Position.arePositionsEqual(holeyMove, destination));
                if (reachesNeighboringPosition) {
                    newMoves.push(action[0]);
                }
            }
            return newMoves.concat(...moves);
        };
        const moves = GameTree_1.GameTree.applyCombinatorToChildren([false, { state: moveFirstPlayer }], combinator, 1);
        if (moves.length === 0) {
            console.log(false);
            return;
        }
        let bestMove = moves[0];
        let positionInArray = holeyMoveArray.findIndex((pos) => Position_1.Position.arePositionsEqual(pos, bestMove.to));
        for (let i = 1; i < moves.length; i++) {
            const currMove = moves[i];
            const findPositionInHoleyMoveArray = holeyMoveArray.findIndex((pos) => Position_1.Position.arePositionsEqual(pos, currMove.to));
            if (findPositionInHoleyMoveArray <= positionInArray) {
                bestMove = Moves_1.Moves.moveTieBreaker(bestMove, moves[i]);
            }
        }
        const positionWithBestMove = [
            [bestMove.from.row, bestMove.from.column],
            [bestMove.to.row, bestMove.to.column],
        ];
        console.log(JSON.stringify(positionWithBestMove));
    });
}
