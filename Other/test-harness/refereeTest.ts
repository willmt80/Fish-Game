import { parseJSON } from './parseJson';
import { depthState, gameDescription } from './conversionUtils';
import { Board } from '../../Common/src/Model/Board';
import { State } from '../../Common/src/Model/State';
import { HousePlayer } from '../../Player/src/Player';
import { Strategy } from '../../Player/src/Strategy';
import { Referee } from '../../Admin/src/Referee';

main();
function main() {
  var s = process.stdin;
  let jsonArray: gameDescription[] = [];
  parseJSON(s, jsonArray, () => {
    if (jsonArray.length !== 1) {
      throw new Error('expected single Game Description');
    }

    const {row, column, players, fish} = jsonArray[0];
    const board: Board.Board = Board.createBoard(row, column, [], fish, row * column);
    const ourPlayers = players.map((matthiasPlayer, index) => {
      return {
        ...HousePlayer,
        age: index,
        username: matthiasPlayer[0],
        getPenguinMove: (state: State.GameState) => Strategy.minimaxMove(state, matthiasPlayer[1] * ourPlayers.length)
      }
    });
    const gameEndReport = Referee.refereeGameWithBoard(ourPlayers, board);
    
    gameEndReport.then(result => {
      const winnerNames = result.winners.map(playerResult => playerResult.player.username);
      winnerNames.sort();
      console.log(JSON.stringify(winnerNames));
    })
  });
} 