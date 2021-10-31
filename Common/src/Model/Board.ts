import { Space } from './Space';
import { Position } from './Position';
import { isNaturalNumber, isPositiveInteger } from '../Utils/NumberUtils';
import { areArraysEqual } from '../Utils/ArrayUtils';

// Grouping of relevant board types and functions
export namespace Board {
  /**
   * A Board is a group of spaces with the coordinate system below.
   * To access the hexagon labelled 0,0, we would use Board.tiles[0][0] representing the row and column
   * within our array.
      _____         _____
     /     \       /     \
    /  0, 0 \_____/ 0, 1  \_____
    \       /     \       /     \
     \_____/ 1 ,0  \_____/  1, 1 \
     /     \       /     \       /
    / 2, 0  \_____/ 2 , 1 \_____/
    \       /     \       /     \
     \_____/ 3, 0  \_____/  3,1  \
     /     \       /     \       /
    /  4,0  \_____/  4,1  \_____/
    \       /     \       /
     \_____/       \_____/
   */
  export type Board = {
    tiles: Space.Space[][];
  };

  /**
   * Gets the tile on the board at the given positions
   * @throws TypeError if not given natural numbers
   * @throws RangeError if there is no tile at the given positions
   * @param board an array of tiles
   * @param position the position
   * @returns the tile at the given row and column
   */
  export function getTile(
    board: Board,
    position: Position.position
  ): Space.Space {
    validateTile(board, position);
    return board.tiles[position.row][position.column];
  }

  /**
   * Gets the number of fish on tile on the board at the given position
   * @throws TypeError if not given natural numbers
   * @throws RangeError if there is no tile at the given positions
   * @param board the board
   * @param position the position of the tile to get the fish for
   * @returns the fish at the given row and column
   */
  export function getFishOnTile(
    board: Board,
    position: Position.position
  ): number {
    try {
      validateTile(board, position);
      return Space.getFish(board.tiles[position.row][position.column]);
    } catch {
      return 0;
    }
  }

  /**
   * Gets the number of rows in the given board
   * @param board the board from which to get rows
   * @return the number of rows in the board
   */
  export function getRows(board: Board) {
    return board.tiles.length;
  }

  /**
   * Get the number of tiles per row (columns)
   * @param board the board to get the columns for
   * @return the number of columns in the board
   */
  export function getColumns(board: Board) {
    return board.tiles[0].length ?? 0;
  }

  /**
   * Removes a tile from the board
   *
   * @throws TypeError if not given natural numbers
   * @throws RangeError if there is no tile at the given positions
   * @param board the current board
   * @param position the position of the tile to be removed
   * @returns a new board with the tile removed
   */
  export function removeTile(board: Board, position: Position.position): Board {
    validateTile(board, position);

    const newTiles: Space.Space[][] = [...board.tiles];
    const newTileRow: Space.Space[] = Array.from(
      Object.create(board.tiles[position.row])
    );

    newTileRow[position.column] = {} as Space.Hole;
    newTiles[position.row] = newTileRow;

    return { tiles: newTiles };
  }

  /**
   * Creates a copy of the given board to avoid mutation
   * @param board the board to copy
   * @return the copied board
   */
  export function copyBoard(board: Board): Board {
    return {
      tiles: [...board.tiles.map((row) => [...row])],
    };
  }

  /**
   * Determines if the given boards are equal
   * @param board1 the first board
   * @param board2 the second board
   * @return true if equal, otherwise false
   */
  export function areBoardsEqual(board1: Board, board2: Board) {
    return areArraysEqual(board1.tiles, board2.tiles, areRowsEqual);
  }

  /**
   * Determines if the given rows are equal
   * @param row1 the first row
   * @param row2 the second row
   * @return true if equal, otherwise false
   */
  function areRowsEqual(row1: Space.Space[], row2: Space.Space[]): boolean {
    return areArraysEqual(row1, row2, Space.areSpacesEqual);
  }

  /**
   * Creates a board that has holes in specific places and is set up with a
   * minimum number of 1-fish tiles
   *
   * @param holes locations of holes on the board
   * @param minimum1FishTiles minimum number of 1 fish tiles
   * @return a board that has holes where specified
   */
  export function createBoardWithMinimum1FishTiles(
    holes: Array<Position.position>,
    minimum1FishTiles: number
  ): Board {
    const numberOfTotalTiles = holes.length + minimum1FishTiles;
    const squareRowsAndColumns = Math.ceil(Math.sqrt(numberOfTotalTiles));
    return createBoard(
      squareRowsAndColumns,
      squareRowsAndColumns,
      holes,
      1,
      minimum1FishTiles
    );
  }

  /**
   * creates a board that has the same number of fish on every tile and has no holes
   * @param numberOfTiles minimum number of tiles
   * @param fishPerTile number of fish on each tile
   */
  export function createBoardNoHoles(
    numberOfTiles: number,
    fishPerTile: number
  ): Board {
    isPositiveInteger(numberOfTiles);
    const squareRowsAndColumns = Math.ceil(Math.sqrt(numberOfTiles));
    return {
      tiles: createActiveBoard(
        squareRowsAndColumns,
        squareRowsAndColumns,
        fishPerTile
      ),
    };
  }

  /**
   * Creates a board with a given number of rows and columns
   *
   * @param rows the number of rows in the board
   * @param columns the number of columns in the board
   * @param holes the list of locations of each of the hole tiles
   * @param fish the maximum number of fish that will appear on each active tile
   * @param minimumActiveTiles the minimum number of tiles with fish
   * @param areFishRandomized? If true, active tiles will have random number of fish between 1 and given fish
   * @throws TypeError if board size does not have positive rows and columns
   * @throws TypeError if fish is not a positive integer
   *
   */
  export function createBoard(
    rows: number,
    columns: number,
    holes: Array<Position.position>,
    fish: number,
    minimumActiveTiles: number,
    areFishRandomized?: boolean
  ): Board {
    validateArguments(rows, columns, fish, holes, minimumActiveTiles);
    const activeBoard: Board = {
      tiles: createActiveBoard(rows, columns, fish, areFishRandomized),
    };
    return addHolesToBoard(activeBoard, holes);
  }

  /**
   * Create board with with only tiles (no holes)
   * @param rows the number of rows to construct
   * @param columns the number of columns to construct
   * @param fish the maximum number of fish that will appear on each active tile
   * @param areFishRandomized If true, active tiles will have random number of fish between 1 and given fish
   */
  function createActiveBoard(
    rows: number,
    columns: number,
    fish: number,
    areFishRandomized?: boolean
  ): Space.Space[][] {
    let row: number;
    let board: Space.Space[][] = [];
    for (row = 0; row < rows; row++) {
      board[row] = createActiveBoardRow(columns, fish, areFishRandomized);
    }
    return board;
  }

  /**
   * Create a single row of the active board
   * @param columns the number of columns to construct
   * @param fish the maximum number of fish that will appear on each active tile
   * @param areFishRandomized If true, active tiles will have random number of fish between 1 and given fish
   * @returns an array of ActiveTile with a fish amount
   */
  function createActiveBoardRow(
    columns: number,
    fish: number,
    areFishRandomized?: boolean
  ): Array<Space.Tile> {
    let column: number;
    const rowArray: Array<Space.Tile> = [];
    for (column = 0; column < columns; column++) {
      rowArray[column] = { fish: numberOfFish(fish, areFishRandomized) };
    }
    return rowArray;
  }

  /**
   * The number of fish to be placed on a tile
   *
   * @param fish
   * @param areFishRandomized?
   * @returns if areFishRandomized is true, a positive integer between 1 and fish, otherwise, fish
   */
  function numberOfFish(fish: number, areFishRandomized?: boolean): number {
    if (areFishRandomized) {
      return Math.ceil(Math.random() * fish);
    }
    return fish;
  }

  /**
   * Add Empty spaces to the board as 'Holes'
   *
   * @param board a board with all active tiles
   * @param holes the positions to be replaced with holes
   */
  export function addHolesToBoard(
    board: Board,
    holes: Position.position[]
  ): Board {
    const newBoard: Board = copyBoard(board);
    holes.forEach((posn: Position.position) => {
      newBoard.tiles[posn.row][posn.column] = {} as Space.Hole;
    });
    return newBoard;
  }

  /**
   * Ensures that the arguments for createBoard are acceptable numbers
   * also ensures that the 
   * @param rows the number of rows in the board
   * @param columns the number of columns in the board
   * @param fish the maximum number of fish that will appear on each active tile
   * @param holes the holes to be placed on a board
   * @param minimumActiveTiles the minimum number of tiles with fish
   * @throws TypeError if board size does not have positive rows and columns
   * @throws TypeError if fish is not a positive integer
   * @thorws RangeError if the holes are not within the bounds of the board
   */
  function validateArguments(
    rows: number,
    columns: number,
    fish: number,
    holes: Position.position[],
    minimumActiveTiles: number
  ) {
    validateNumberArguments(rows, columns, fish, minimumActiveTiles);
    validateHolePositions(rows, columns, holes);
    if (holes.length + minimumActiveTiles > rows * columns) {
      throw new RangeError(
        `Must have at least ${minimumActiveTiles} active tiles`
      );
    }
  }

  /**
   * Ensures that the number arguments for createBoard are acceptable
   * @param rows the number of rows in the board
   * @param columns the number of columns in the board
   * @param fish the maximum number of fish that will appear on each active tile
   * @param minimumActiveTiles the minimum number of tiles with fish
   * @throws TypeError if board size does not have positive rows and columns
   * @throws TypeError if fish is not a positive integer
   * @thorws TypeError if the minimum number of active tiles is too low
   */
  function validateNumberArguments(
    rows: number,
    columns: number,
    fish: number,
    minimumActiveTiles: number
  ): void {
    if (!isPositiveInteger(rows) || !isPositiveInteger(columns)) {
      throw new TypeError('Rows and Columns must be positive integers');
    }

    if (!isPositiveInteger(fish)) {
      throw new TypeError('Fish Per Tile must be a positive integer');
    }

    if (!isNaturalNumber(minimumActiveTiles)) {
      throw new TypeError('Minimum active tiles must be a natural number');
    }
  }

  /**
   * Ensures that the references tile is a valid one.
   * A tile is invalid if it is a Hole, if positions are not natural numbers, or if the row/col is out of range of the board.
   * @param board the board
   * @param position the position on the board
   * @throws Error if the tile at the given position is not an active tile
   */
  export function validateTile(
    board: Board.Board,
    position: Position.position
  ) {
    if (!Position.arePositionsNaturalNumbers(position)) {
      throw new TypeError('Rows and Columns must be natural numbers');
    }
    if (board.tiles[position.row] === undefined 
        || board.tiles[position.row][position.column] === undefined) {
      throw new RangeError('No space at the given positions');
    } 
    if (Space.isHole(board.tiles[position.row][position.column])) {
      throw new Error('No active tile at the given positions');
    }
  }

  /**
   * Validate hole positions are within the row and column range of the board
   *
   * @param rows the number of rows
   * @param columns the number of columns
   * @param holes the holes to be checked
   * @throws RangeError if any of the holes are outside the bounds of the board
   */
  export function validateHolePositions(
    rows: number,
    columns: number,
    holes: Position.position[]
  ): void {
    holes.forEach((hole: Position.position) => {
      if (!Position.isValidPositionInRange(rows, columns, hole)) {
        throw new RangeError('Holes must be within the range of the board');
      }
    });
  }
}
