"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseJson_1 = require("./parseJson");
const Board_1 = require("../../Common/src/Model/Board");
const Player_1 = require("../../Player/src/Player");
const Strategy_1 = require("../../Player/src/Strategy");
const Referee_1 = require("../../Admin/src/Referee");
main();
function main() {
    var s = process.stdin;
    let jsonArray = [];
    parseJson_1.parseJSON(s, jsonArray, () => {
        if (jsonArray.length !== 1) {
            throw new Error('expected single Game Description');
        }
        const { row, column, players, fish } = jsonArray[0];
        const board = Board_1.Board.createBoard(row, column, [], fish, row * column);
        const ourPlayers = players.map((matthiasPlayer, index) => {
            return Object.assign(Object.assign({}, Player_1.HousePlayer), { age: index, username: matthiasPlayer[0], getPenguinMove: (state) => Strategy_1.Strategy.minimaxMove(state, matthiasPlayer[1] * ourPlayers.length) });
        });
        const gameEndReport = Referee_1.Referee.refereeGameWithBoard(ourPlayers, board);
        gameEndReport.then(result => {
            const winnerNames = result.winners.map(playerResult => playerResult.player.username);
            winnerNames.sort();
            console.log(JSON.stringify(winnerNames));
        });
    });
}
