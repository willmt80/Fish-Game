import { State } from '../../Common/src/Model/State';
import { GameTree } from '../../Common/src/Model/GameTree';
import {
  convertMatthiasPositionToPositionType,
  convertStateMatthiasToOurState,
  stateMatthias,
} from './conversionUtils';
import { parseJSON } from './parseJson';
import { Position } from '../../Common/src/Model/Position';
import { Moves } from '../../Common/src/Model/Moves';
import { orMap } from '../../Common/src/Utils/ArrayUtils';
/**
 * Move-Response-Query is
 *      {
 *        "state" : State,
 *        "from" : Position
 *        "to" : Position
 *       }
 *
 * INTERPRETATION The object describes the current state and the move that the
 * currently active player picked. CONSTRAINT The object is invalid, if the
 * specified move is illegal in the given state.
 */

type moveResponseQuery = {
  state: stateMatthias;
  from: [number, number];
  to: [number, number];
};

main();

function main() {
  var s = process.stdin;
  let jsonArray: moveResponseQuery[] = [];

  parseJSON(s, jsonArray, () => {
    if (jsonArray.length !== 1) {
      throw new Error('Usage: must Input a State');
    }
    const moveResQuery: moveResponseQuery = jsonArray[0];
    const state = convertStateMatthiasToOurState(moveResQuery.state);
    const fromPosition = convertMatthiasPositionToPositionType(
      moveResQuery.from
    );

    const toPosition = convertMatthiasPositionToPositionType(moveResQuery.to);

    const moveFirstPlayer = State.movePenguin(
      0,
      { from: fromPosition, to: toPosition },
      state
    ); // if this throws then we were given an invalid state

    // we need to check if any of player 2's penguins can move into any of these positions
    const holeyMoveArray = [
      Moves.getUp(toPosition, moveFirstPlayer.board),
      Moves.getDiagonalRightUp(toPosition, moveFirstPlayer.board),
      Moves.getDiagonalRightDown(toPosition, moveFirstPlayer.board),
      Moves.getDown(toPosition, moveFirstPlayer.board),
      Moves.getDiagonalLeftDown(toPosition, moveFirstPlayer.board),
      Moves.getDiagonalLeftUp(toPosition, moveFirstPlayer.board),
    ].filter((value) => value !== null) as Array<
      Position.position
    >;
    const combinator = (
      action: GameTree.ActionGameTuple,
      moves: Moves.Move[][]
    ) => {
      const newMoves = [] as Moves.Move[];
      if (action[0]) {
        const destination = action[0].to;
        const reachesNeighboringPosition = orMap<Position.position>(
          holeyMoveArray,
          (holeyMove) => Position.arePositionsEqual(holeyMove, destination)
        );
        if (reachesNeighboringPosition) {
          newMoves.push(action[0]);
        }
      }

      return newMoves.concat(...moves);
    };

    const moves = GameTree.applyCombinatorToChildren(
      [false, { state: moveFirstPlayer }],
      combinator,
      1
    );

    if (moves.length === 0) {
      console.log(false);
      return;
    }

    let bestMove = moves[0];
    let positionInArray = holeyMoveArray.findIndex((pos) =>
      Position.arePositionsEqual(pos, bestMove.to)
    );
    for (let i = 1; i < moves.length; i++) {
      const currMove = moves[i];
      const findPositionInHoleyMoveArray = holeyMoveArray.findIndex((pos) =>
        Position.arePositionsEqual(pos, currMove.to)
      );

      if (findPositionInHoleyMoveArray <= positionInArray) {
        bestMove = Moves.moveTieBreaker(bestMove, moves[i]) as Moves.Move;
      }
    }

    const positionWithBestMove = [
      [bestMove.from.row, bestMove.from.column],
      [bestMove.to.row, bestMove.to.column],
    ];
    console.log(JSON.stringify(positionWithBestMove));
  });
}
