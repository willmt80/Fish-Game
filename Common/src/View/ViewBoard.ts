import { Board } from '../Model/Board';
import { GameColor } from '../Model/GameColor';
import { Penguin } from '../Model/Penguin';
import { Space } from '../Model/Space';
import { State } from '../Model/State';
import { boardColToHexX, boardRowToHexY } from '../Utils/ConvertBoard';

/*
  A collection of data representations and functions related to
  converting our model to a representation that can be interpreted
  by our hexagon rendering library

  This representation exists for rendering purposes and it is
  different from our normal board because of the particular library we use
*/
export namespace ViewBoard {

  /**
  * ViewBoard has the coordinate system below
    _____         _____
   /     \       /     \
  /  0, 0 \_____/ 2, 0  \_____
  \       /     \       /     \
   \_____/ 1 ,0  \_____/  3, 0 \
   /     \       /     \       /
  / 0, 1  \_____/ 2 , 1 \_____/
  \       /     \       /     \
   \_____/ 1, 1  \_____/  3,1  \
   /     \       /     \       /
  /  0,2  \_____/  2,2  \_____/
  \       /     \       /
   \_____/       \_____/
 */

  /**
   * The coordinates within the ViewBoard
   */
  export type XAndY = {
    x: number;
    y: number;
  };

  /**
   * A Hole in the ViewBoard
   */
  export type ViewHole = {
    coord: XAndY;
    isTile: false;
  };

  /**
   * A Tile in the View Board
   */
  export type ViewTile = {
    coord: XAndY;
    fish: number;
    isTile: true;
    penguin?: GameColor;
  };

  /**
   * A Space on the board
   */
  export type ViewSpace = ViewHole | ViewTile;

  /**
   * A flattened representation of a the 2D board representation
   *
   * This is required by our hexagon rendering library
   */
  export type ViewSpaceList = Array<ViewSpace>;

  /**
   * Convert the row and column of our model to the equivalent to the x, y coordinates
   *
   * @param rowIndex The row number
   * @param colIndex The column Number
   * @returns The x, y coordinates in an object
   */
  export function getCoords(rowIndex: number, colIndex: number): XAndY {
    return {
      x: boardColToHexX(rowIndex, colIndex),
      y: boardRowToHexY(rowIndex),
    };
  }

  /**
   * Convert the game to a 2d list of ViewSpace for rendering
   *
   * @param game the game to be converted
   * @returns An array of array of ViewSpace
   */
  function convertGameToViewBoard(game: State.GameState): Array<Array<ViewSpace>> {
    return game.board.tiles.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return convertSpaceToViewSpace(rowIndex, colIndex, col, game.penguinTeams);
      });
    });
  }

  /**
   * Convert the model space object to a renderable ViewSpace
   *
   * @param row the row to be converted to the y value
   * @param column the column to be converted to the x value
   * @param tile the tile
   * @param penguinTeams the penguinTeams used to find penguins
   * @return the appropriate ViewSpace for the type of Space
   */
  function convertSpaceToViewSpace(
    row: number,
    column: number,
    tile: Space.Space,
    penguinTeams: Penguin.PenguinTeam[]
  ): ViewSpace {
    if (Space.isActiveTile(tile)) {
      return {
        coord: getCoords(row, column),
        fish: Space.getFish(tile),
        isTile: true,
        penguin: getGameColorFromLocation(row, column, penguinTeams)
      };
    } else {
      return {
        coord: getCoords(row, column),
        isTile: false,
      };
    }
  }

  /**
   * Get the color of the team that owns the penguin at the given location
   * @param row the row
   * @param column the column
   * @param penguinTeams the PenguinTeams in which to search for the Penguin
   */
  function getGameColorFromLocation(
    row: number,
    column: number, 
    penguinTeams: Penguin.PenguinTeam[]
  ): GameColor | undefined{
    for(let penguinTeam of penguinTeams) {
      if (Penguin.getPenguinFromTeam(penguinTeam, { row: row, column: column })) {
        return penguinTeam.color;
      }
    }
  }

  /**
   * Converts the Game to a 1d array of ViewSpace
   *
   * @param game The GameState
   * @return the 1d array for ViewSpace
   */
  export function convertGameToViewSpaceList(game: State.GameState): ViewSpaceList {
    return ([] as ViewSpace[]).concat(...convertGameToViewBoard(game));
  }
}
