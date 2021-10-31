import { isPositiveInteger } from '../../Common/src/Utils/NumberUtils';
import {
  convertStateMatthiasToOurState,
  stateMatthias,
  depthState
} from './conversionUtils';
import { parseJSON } from './parseJson';
import { Strategy } from '../../Player/src/Strategy';

/**
 * Depth-State is [D, State]
 *    where D is a Natural in [1,2]
 *    and state is a StateMatthias defined elsewhere
 */

main();
function main() {
  var s = process.stdin;
  let jsonArray: depthState[] = [];
  parseJSON(s, jsonArray, () => {
    if (jsonArray.length !== 1) {
      throw new Error('Expected a single Depth State');
    }

    const [depth, stateMatthias] = jsonArray[0];
    if (!isPositiveInteger(depth)) {
      throw new Error('Depth must be greater than 0');
    }

    const state = convertStateMatthiasToOurState(stateMatthias);
    const depthSearch = state.penguinTeams.length * depth;
    try {

      const bestMove = Strategy.minimaxMove(state, depthSearch);
      const positionWithBestMove = [
        [bestMove.from.row, bestMove.from.column],
        [bestMove.to.row, bestMove.to.column],
      ];
      console.log(JSON.stringify(positionWithBestMove));
    } catch {
      console.log(false);
    }
  });
}
