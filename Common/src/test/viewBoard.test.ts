import { Board } from '../Model/Board';
import { State } from '../Model/State';
import { GameColor } from '../Model/GameColor';
import { ViewBoard } from '../View/ViewBoard';
import { trimEnd } from 'lodash';

const board = Board.createBoardWithMinimum1FishTiles(
  [{ row: 0, column: 0 }],
  3
);

// const samplePlayers: Player.Player[] = [
//   { name: 'matthias', age: 1, teamColor: GameColor.BLACK },
//   { name: 'suzanne', age: 2, teamColor: GameColor.RED },
// ];

let sampleGame = State.createGameState([GameColor.BLACK, GameColor.RED], 3, 2);

sampleGame = State.addHolesToGameBoard(sampleGame, [{ row: 0, column: 1 }]);

sampleGame = State.placePenguin(0, { row: 1, column: 1 }, sampleGame);

sampleGame = State.placePenguin(1, { row: 2, column: 1 }, sampleGame);

sampleGame = State.placePenguin(1, { row: 0, column: 0 }, sampleGame);

const sampleViewSpaceList = ViewBoard.convertGameToViewSpaceList(sampleGame);

test('test getCoords', () => {
  expect(ViewBoard.getCoords(0, 0)).toStrictEqual({ x: 0, y: 0 });
  expect(ViewBoard.getCoords(3, 0)).toStrictEqual({ x: 1, y: 1 });
  expect(ViewBoard.getCoords(4, 1)).toStrictEqual({ x: 2, y: 2 });
  expect(ViewBoard.getCoords(0, 1)).toStrictEqual({ x: 2, y: 0 });
  expect(ViewBoard.getCoords(1, 0)).toStrictEqual({ x: 1, y: 0 });
});

test('test convert board to view board', () => {
  expect(sampleViewSpaceList.length).toBe(6);
  expect(sampleViewSpaceList[0].coord).toStrictEqual({ x: 0, y: 0 });
  expect(sampleViewSpaceList[1].coord).toStrictEqual({ x: 2, y: 0 });
  expect(sampleViewSpaceList[3].coord).toStrictEqual({ x: 3, y: 0 });
  expect(sampleViewSpaceList[5].coord).toStrictEqual({ x: 2, y: 1 });

  expect(sampleViewSpaceList[0].isTile).toBe(true);
  expect(sampleViewSpaceList[1].isTile).toBe(false);
  expect(sampleViewSpaceList[2].isTile).toBe(true);
  expect(sampleViewSpaceList[3].isTile).toBe(true);
  expect(sampleViewSpaceList[4].isTile).toBe(true);
  expect(sampleViewSpaceList[5].isTile).toBe(true);

  expect({ ...(sampleViewSpaceList[0] as ViewBoard.ViewTile) }.penguin).toBe(
    GameColor.RED
  );
  expect({ ...(sampleViewSpaceList[3] as ViewBoard.ViewTile) }.penguin).toBe(
    GameColor.BLACK
  );
  expect(
    { ...(sampleViewSpaceList[2] as ViewBoard.ViewTile) }.penguin
  ).toBeUndefined();
});
